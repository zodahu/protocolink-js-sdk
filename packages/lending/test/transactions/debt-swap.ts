import { Adapter } from 'src/adapter';
import { Portfolio } from 'src/protocol.portfolio';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import hre from 'hardhat';
import { mainnetTokens } from '@protocolink/test-helpers';

describe('Transaction: Debt swap', function () {
  const chainId = 1;
  let portfolio: Portfolio;
  let user: SignerWithAddress;
  let adapter: Adapter;

  before(async function () {
    adapter = new Adapter(chainId, hre.ethers.provider, { permitType: 'approve' });
  });

  context('Test Debt swap', function () {
    const testCases = [
      {
        skip: false,
        testingAccount: '0x06e4Cb4f3ba9A2916B6384aCbdeAa74dAAF91550',
        protocolId: 'aavev3',
        marketId: 'mainnet',
        params: {
          srcToken: mainnetTokens.USDC,
          srcAmount: '2000000',
          destToken: mainnetTokens.DAI,
        },
        expects: {
          funds: [],
          balances: [],
          apporveTimes: 1, // approveDelegation
          recieves: [],
        },
      },
    ];

    for (const [i, { skip, testingAccount, protocolId, marketId, params, expects }] of testCases.entries()) {
      if (skip) continue;
      it.only(`case ${i + 1}`, async function () {
        user = await hre.ethers.getImpersonatedSigner(testingAccount);

        const sdkInfo = await adapter.getDebtSwap(protocolId, marketId, params, user.address, portfolio);

        const estimateResult = await sdkInfo.estimateResult;
        expect(estimateResult).to.include.all.keys('funds', 'balances', 'approvals');
        expect(estimateResult.approvals).to.have.lengthOf(expects.apporveTimes);

        for (const approval of estimateResult.approvals) {
          await expect(user.sendTransaction(approval)).to.not.be.reverted;
        }

        const transactionRequest = await sdkInfo.buildRouterTransactionRequest();

        expect(transactionRequest).to.include.all.keys('to', 'data', 'value');

        const tx = await user.sendTransaction(transactionRequest);

        expect(tx).to.not.be.reverted;
      });
    }
  });
});
