import { Adapter } from 'src/adapter';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { TokenAmount } from '@protocolink/common';
import * as aaveV2 from 'src/protocols/aave-v2/tokens';
import * as aaveV3 from 'src/protocols/aave-v3/tokens';
import * as apisdk from '@protocolink/api';
import { claimToken, mainnetTokens, snapshotAndRevertEach } from '@protocolink/test-helpers';
import * as common from '@protocolink/common';
import { expect } from 'chai';
import hre from 'hardhat';
import * as logics from '@protocolink/logics';
import * as radiantV2 from 'src/protocols/radiant-v2/tokens';
import * as spark from 'src/protocols/spark/tokens';
import * as utils from 'test/utils';

describe('Transaction: Collateral swap', function () {
  const chainId = 1;
  const slippage = 100;
  const initSupplyAmount = '2';

  let user: SignerWithAddress;
  let adapter: Adapter;

  before(async function () {
    adapter = new Adapter(chainId, hre.ethers.provider);
    [, user] = await hre.ethers.getSigners();
    await claimToken(chainId, user.address, mainnetTokens.WETH, initSupplyAmount);
  });

  snapshotAndRevertEach();

  context('Test Collateral swap', function () {
    const testCases = [
      {
        protocolId: 'aave-v2',
        marketId: 'mainnet',
        srcToken: mainnetTokens.WETH,
        srcAmount: initSupplyAmount,
        srcAccountingToken: aaveV2.mainnetTokens.aWETH,
        destToken: mainnetTokens.WBTC,
        destAccountingToken: aaveV2.mainnetTokens.aWBTC,
        expects: { logicLength: 7 },
      },
      {
        protocolId: 'radiant-v2',
        marketId: 'mainnet',
        srcToken: mainnetTokens.WETH,
        srcAmount: '1',
        srcAccountingToken: radiantV2.mainnetTokens.rWETH,
        destToken: mainnetTokens.WBTC,
        destAccountingToken: radiantV2.mainnetTokens.rWBTC,
        expects: { logicLength: 7 },
      },
      {
        protocolId: 'aave-v3',
        marketId: 'mainnet',
        srcToken: mainnetTokens.WETH,
        srcAmount: '1',
        srcAccountingToken: aaveV3.mainnetTokens.aEthWETH,
        destToken: mainnetTokens.WBTC,
        destAccountingToken: aaveV3.mainnetTokens.aEthWBTC,
        expects: { logicLength: 7 },
      },
      {
        protocolId: 'spark',
        marketId: 'mainnet',
        srcToken: mainnetTokens.WETH,
        srcAmount: '1',
        srcAccountingToken: spark.mainnetTokens.spWETH,
        destToken: spark.mainnetTokens.wstETH,
        destAccountingToken: spark.mainnetTokens.spwstETH,
        expects: { logicLength: 7 },
      },
      {
        protocolId: 'compound-v3',
        marketId: logics.compoundv3.MarketId.USDC,
        srcToken: mainnetTokens.WETH,
        srcAmount: '1',
        srcAccountingToken: mainnetTokens.WETH,
        destToken: mainnetTokens.WBTC,
        destAccountingToken: mainnetTokens.WBTC,
        expects: { logicLength: 5 },
      },
    ];

    testCases.forEach(
      (
        { protocolId, marketId, srcToken, srcAmount, srcAccountingToken, destToken, destAccountingToken, expects },
        i
      ) => {
        it(`case ${i + 1} - ${protocolId}:${marketId}`, async function () {
          // 0. prep user positions
          const account = user.address;
          await utils.deposit(
            chainId,
            protocolId,
            marketId,
            user,
            new common.TokenAmount(srcToken.wrapped, initSupplyAmount)
          );

          // 1. user obtains a quotation for collateral swap srcToken to destToken
          const portfolio = await adapter.getPortfolio(user.address, protocolId, marketId);
          const collateralSwapInfo = await adapter.collateralSwap({
            account,
            portfolio,
            srcToken,
            srcAmount,
            destToken,
          });
          const logics = collateralSwapInfo.logics;
          expect(collateralSwapInfo.error).to.be.undefined;
          expect(logics.length).to.eq(expects.logicLength);

          // 2. user needs to allow the Protocolink user agent to withdraw on behalf of the user
          const estimateResult = await apisdk.estimateRouterData({ chainId, account, logics });
          for (const approval of estimateResult.approvals) {
            await expect(user.sendTransaction(approval)).to.not.be.reverted;
          }
          const permitData = estimateResult.permitData;
          let permitSig;
          const protocol = adapter.getProtocol(protocolId);
          if (protocol.isAssetTokenized(marketId, srcToken)) {
            // 2-1. user sign permit data
            expect(permitData).to.not.be.undefined;
            const { domain, types, values } = permitData!;
            permitSig = await user._signTypedData(domain, types, values);
          } else {
            expect(permitData).to.be.undefined;
          }

          // 3. user obtains a collateral swap transaction request
          expect(logics.length).to.eq(expects.logicLength);
          const transactionRequest = await apisdk.buildRouterTransactionRequest({
            chainId,
            account,
            logics,
            permitData,
            permitSig,
          });
          await expect(user.sendTransaction(transactionRequest)).to.not.be.reverted;

          // 4. user's src token balance will decrease.
          const initSrcBalance = new TokenAmount(srcToken, initSupplyAmount);
          const srcBalance = await utils.getCollateralBalance(chainId, protocolId, marketId, user, srcAccountingToken);
          const destBalance = await utils.getCollateralBalance(
            chainId,
            protocolId,
            marketId,
            user,
            destAccountingToken
          );
          expect(srcBalance!.gte(initSrcBalance.clone().sub(srcAmount))).to.be.true;

          // 5. user's dest token balance will increase.
          // 5-1. rate may change when the block of getting api data is different from the block of executing tx
          const supplyAmount = new common.TokenAmount(destToken, collateralSwapInfo.destAmount);
          const [minSupplyAmount, maxSupplyAmount] = utils.bpsBound(supplyAmount.amount, slippage);
          expect(destBalance!.lte(maxSupplyAmount)).to.be.true;
          expect(destBalance!.gte(minSupplyAmount)).to.be.true;
        });
      }
    );
  });
});
