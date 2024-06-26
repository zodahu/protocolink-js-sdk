import * as common from '@protocolink/common';
import * as logics from '@protocolink/logics';

export const ID = 'radiant-v2';
export const DISPLAY_NAME = 'Radiant V2';

export interface Reserve {
  asset: common.Token;
  rToken: common.Token;
}

type ContractName = 'ProtocolDataProvider' | 'PriceOracle';

interface Config {
  chainId: number;
  contractMap: Record<ContractName, string>;
}

export const configs: Config[] = [
  {
    chainId: common.ChainId.mainnet,
    contractMap: {
      ProtocolDataProvider: '0x362f3BB63Cff83bd169aE1793979E9e537993813',
      PriceOracle: '0xbD60293fBe4B285402510562A64E5fCEE9c4a8F9',
    },
  },
  {
    chainId: common.ChainId.bnb,
    contractMap: {
      ProtocolDataProvider: '0x2f9D57E97C3DFED8676e605BC504a48E0c5917E9',
      PriceOracle: '0x0BB5c1Bc173b207cBf47CDf013617087776F3782',
    },
  },
  {
    chainId: common.ChainId.arbitrum,
    contractMap: {
      ProtocolDataProvider: '0x596B0cc4c5094507C50b579a662FE7e7b094A2cC',
      PriceOracle: '0xC0cE5De939aaD880b0bdDcf9aB5750a53EDa454b',
    },
  },
];

export const supportedChainIds = logics.radiantv2.supportedChainIds;

export function getContractAddress(chainId: number, name: ContractName) {
  const { contractMap } = configs.find((configs) => configs.chainId === chainId)!;
  return contractMap[name];
}

const depositDisableMap: Record<number, string[]> = {
  [common.ChainId.mainnet]: [],
  [common.ChainId.bnb]: [],
  [common.ChainId.arbitrum]: [],
};

const borrowDisableMap: Record<number, string[]> = {
  [common.ChainId.mainnet]: [],
  [common.ChainId.bnb]: [],
  [common.ChainId.arbitrum]: [],
};

export const isTokenForDeposit = (chainId: number, token: common.Token) => {
  return !depositDisableMap[chainId].includes(token.address);
};

export const isTokenForBorrow = (chainId: number, token: common.Token) => {
  return !borrowDisableMap[chainId].includes(token.address);
};
