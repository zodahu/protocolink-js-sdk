/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';
import type { FunctionFragment, Result } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';

export interface SparkFlashLoanCallbackInterface extends utils.Interface {
  functions: {
    'sparkProvider()': FunctionFragment;
    'executeOperation(address[],uint256[],uint256[],address,bytes)': FunctionFragment;
    'feeRate()': FunctionFragment;
    'metadata()': FunctionFragment;
    'router()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: 'sparkProvider' | 'executeOperation' | 'feeRate' | 'metadata' | 'router'
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'sparkProvider', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'executeOperation',
    values: [string[], BigNumberish[], BigNumberish[], string, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: 'feeRate', values?: undefined): string;
  encodeFunctionData(functionFragment: 'metadata', values?: undefined): string;
  encodeFunctionData(functionFragment: 'router', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'sparkProvider', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'executeOperation', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'feeRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'metadata', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'router', data: BytesLike): Result;

  events: {};
}

export interface SparkFlashLoanCallback extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SparkFlashLoanCallbackInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    sparkProvider(overrides?: CallOverrides): Promise<[string]>;

    executeOperation(
      assets: string[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      arg3: string,
      params: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    feeRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    metadata(overrides?: CallOverrides): Promise<[string]>;

    router(overrides?: CallOverrides): Promise<[string]>;
  };

  sparkProvider(overrides?: CallOverrides): Promise<string>;

  executeOperation(
    assets: string[],
    amounts: BigNumberish[],
    premiums: BigNumberish[],
    arg3: string,
    params: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  feeRate(overrides?: CallOverrides): Promise<BigNumber>;

  metadata(overrides?: CallOverrides): Promise<string>;

  router(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    sparkProvider(overrides?: CallOverrides): Promise<string>;

    executeOperation(
      assets: string[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      arg3: string,
      params: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    feeRate(overrides?: CallOverrides): Promise<BigNumber>;

    metadata(overrides?: CallOverrides): Promise<string>;

    router(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    sparkProvider(overrides?: CallOverrides): Promise<BigNumber>;

    executeOperation(
      assets: string[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      arg3: string,
      params: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    feeRate(overrides?: CallOverrides): Promise<BigNumber>;

    metadata(overrides?: CallOverrides): Promise<BigNumber>;

    router(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    sparkProvider(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    executeOperation(
      assets: string[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      arg3: string,
      params: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    feeRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    metadata(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    router(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}