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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from '../../../../common';

export interface MasaSBTInterface extends utils.Interface {
  functions: {
    'DEFAULT_ADMIN_ROLE()': FunctionFragment;
    'addLinkPrice()': FunctionFragment;
    'addLinkPriceMASA()': FunctionFragment;
    'balanceOf(address)': FunctionFragment;
    'burn(uint256)': FunctionFragment;
    'exists(uint256)': FunctionFragment;
    'getRoleAdmin(bytes32)': FunctionFragment;
    'grantRole(bytes32,address)': FunctionFragment;
    'hasRole(bytes32,address)': FunctionFragment;
    'name()': FunctionFragment;
    'ownerOf(uint256)': FunctionFragment;
    'queryLinkPrice()': FunctionFragment;
    'queryLinkPriceMASA()': FunctionFragment;
    'renounceRole(bytes32,address)': FunctionFragment;
    'revokeRole(bytes32,address)': FunctionFragment;
    'setAddLinkPrice(uint256)': FunctionFragment;
    'setAddLinkPriceMASA(uint256)': FunctionFragment;
    'setQueryLinkPrice(uint256)': FunctionFragment;
    'setQueryLinkPriceMASA(uint256)': FunctionFragment;
    'supportsInterface(bytes4)': FunctionFragment;
    'symbol()': FunctionFragment;
    'tokenByIndex(uint256)': FunctionFragment;
    'tokenOfOwnerByIndex(address,uint256)': FunctionFragment;
    'tokenURI(uint256)': FunctionFragment;
    'totalSupply()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'DEFAULT_ADMIN_ROLE'
      | 'addLinkPrice'
      | 'addLinkPriceMASA'
      | 'balanceOf'
      | 'burn'
      | 'exists'
      | 'getRoleAdmin'
      | 'grantRole'
      | 'hasRole'
      | 'name'
      | 'ownerOf'
      | 'queryLinkPrice'
      | 'queryLinkPriceMASA'
      | 'renounceRole'
      | 'revokeRole'
      | 'setAddLinkPrice'
      | 'setAddLinkPriceMASA'
      | 'setQueryLinkPrice'
      | 'setQueryLinkPriceMASA'
      | 'supportsInterface'
      | 'symbol'
      | 'tokenByIndex'
      | 'tokenOfOwnerByIndex'
      | 'tokenURI'
      | 'totalSupply'
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'DEFAULT_ADMIN_ROLE',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'addLinkPrice',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'addLinkPriceMASA',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'balanceOf',
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'burn',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'exists',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'getRoleAdmin',
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: 'grantRole',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'hasRole',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: 'name', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'ownerOf',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'queryLinkPrice',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'queryLinkPriceMASA',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'renounceRole',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'revokeRole',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'setAddLinkPrice',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'setAddLinkPriceMASA',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'setQueryLinkPrice',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'setQueryLinkPriceMASA',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'supportsInterface',
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'tokenByIndex',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'tokenOfOwnerByIndex',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'tokenURI',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'totalSupply',
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: 'DEFAULT_ADMIN_ROLE',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'addLinkPrice',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'addLinkPriceMASA',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'burn', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'exists', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'getRoleAdmin',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'grantRole', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'hasRole', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'ownerOf', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'queryLinkPrice',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'queryLinkPriceMASA',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'renounceRole',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'revokeRole', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'setAddLinkPrice',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'setAddLinkPriceMASA',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'setQueryLinkPrice',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'setQueryLinkPriceMASA',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'supportsInterface',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'tokenByIndex',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'tokenOfOwnerByIndex',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'tokenURI', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'totalSupply',
    data: BytesLike
  ): Result;

  events: {
    'Burn(address,uint256)': EventFragment;
    'Mint(address,uint256)': EventFragment;
    'RoleAdminChanged(bytes32,bytes32,bytes32)': EventFragment;
    'RoleGranted(bytes32,address,address)': EventFragment;
    'RoleRevoked(bytes32,address,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Burn'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Mint'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleAdminChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleGranted'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleRevoked'): EventFragment;
}

export interface BurnEventObject {
  _owner: string;
  _tokenId: BigNumber;
}
export type BurnEvent = TypedEvent<[string, BigNumber], BurnEventObject>;

export type BurnEventFilter = TypedEventFilter<BurnEvent>;

export interface MintEventObject {
  _owner: string;
  _tokenId: BigNumber;
}
export type MintEvent = TypedEvent<[string, BigNumber], MintEventObject>;

export type MintEventFilter = TypedEventFilter<MintEvent>;

export interface RoleAdminChangedEventObject {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}
export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string],
  RoleAdminChangedEventObject
>;

export type RoleAdminChangedEventFilter =
  TypedEventFilter<RoleAdminChangedEvent>;

export interface RoleGrantedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleGrantedEvent = TypedEvent<
  [string, string, string],
  RoleGrantedEventObject
>;

export type RoleGrantedEventFilter = TypedEventFilter<RoleGrantedEvent>;

export interface RoleRevokedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleRevokedEvent = TypedEvent<
  [string, string, string],
  RoleRevokedEventObject
>;

export type RoleRevokedEventFilter = TypedEventFilter<RoleRevokedEvent>;

export interface MasaSBT extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MasaSBTInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    addLinkPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    addLinkPriceMASA(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    burn(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    exists(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    queryLinkPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    queryLinkPriceMASA(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAddLinkPrice(
      _addLinkPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAddLinkPriceMASA(
      _addLinkPriceMASA: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setQueryLinkPrice(
      _queryLinkPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setQueryLinkPriceMASA(
      _queryLinkPriceMASA: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  addLinkPrice(overrides?: CallOverrides): Promise<BigNumber>;

  addLinkPriceMASA(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOf(
    owner: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  burn(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  exists(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getRoleAdmin(
    role: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  grantRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  name(overrides?: CallOverrides): Promise<string>;

  ownerOf(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  queryLinkPrice(overrides?: CallOverrides): Promise<BigNumber>;

  queryLinkPriceMASA(overrides?: CallOverrides): Promise<BigNumber>;

  renounceRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAddLinkPrice(
    _addLinkPrice: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAddLinkPriceMASA(
    _addLinkPriceMASA: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setQueryLinkPrice(
    _queryLinkPrice: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setQueryLinkPriceMASA(
    _queryLinkPriceMASA: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  symbol(overrides?: CallOverrides): Promise<string>;

  tokenByIndex(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenOfOwnerByIndex(
    owner: PromiseOrValue<string>,
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenURI(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    addLinkPrice(overrides?: CallOverrides): Promise<BigNumber>;

    addLinkPriceMASA(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    exists(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    name(overrides?: CallOverrides): Promise<string>;

    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    queryLinkPrice(overrides?: CallOverrides): Promise<BigNumber>;

    queryLinkPriceMASA(overrides?: CallOverrides): Promise<BigNumber>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setAddLinkPrice(
      _addLinkPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setAddLinkPriceMASA(
      _addLinkPriceMASA: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setQueryLinkPrice(
      _queryLinkPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setQueryLinkPriceMASA(
      _queryLinkPriceMASA: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    symbol(overrides?: CallOverrides): Promise<string>;

    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    'Burn(address,uint256)'(
      _owner?: PromiseOrValue<string> | null,
      _tokenId?: PromiseOrValue<BigNumberish> | null
    ): BurnEventFilter;
    Burn(
      _owner?: PromiseOrValue<string> | null,
      _tokenId?: PromiseOrValue<BigNumberish> | null
    ): BurnEventFilter;

    'Mint(address,uint256)'(
      _owner?: PromiseOrValue<string> | null,
      _tokenId?: PromiseOrValue<BigNumberish> | null
    ): MintEventFilter;
    Mint(
      _owner?: PromiseOrValue<string> | null,
      _tokenId?: PromiseOrValue<BigNumberish> | null
    ): MintEventFilter;

    'RoleAdminChanged(bytes32,bytes32,bytes32)'(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;
    RoleAdminChanged(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;

    'RoleGranted(bytes32,address,address)'(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;
    RoleGranted(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;

    'RoleRevoked(bytes32,address,address)'(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
    RoleRevoked(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
  };

  estimateGas: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    addLinkPrice(overrides?: CallOverrides): Promise<BigNumber>;

    addLinkPriceMASA(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    exists(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queryLinkPrice(overrides?: CallOverrides): Promise<BigNumber>;

    queryLinkPriceMASA(overrides?: CallOverrides): Promise<BigNumber>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAddLinkPrice(
      _addLinkPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAddLinkPriceMASA(
      _addLinkPriceMASA: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setQueryLinkPrice(
      _queryLinkPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setQueryLinkPriceMASA(
      _queryLinkPriceMASA: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addLinkPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addLinkPriceMASA(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burn(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    exists(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queryLinkPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queryLinkPriceMASA(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAddLinkPrice(
      _addLinkPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAddLinkPriceMASA(
      _addLinkPriceMASA: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setQueryLinkPrice(
      _queryLinkPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setQueryLinkPriceMASA(
      _queryLinkPriceMASA: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}