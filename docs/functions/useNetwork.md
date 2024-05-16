[**# Masa React v3.21.1**](../README.md) • **Docs**

***

[# Masa React v3.21.1](../globals.md) / useNetwork

# Function: useNetwork()

> **useNetwork**(): `object`

## Returns

`object`

### activeChain

> **activeChain**: `undefined` \| `ChainConstants` & `ChainConfig`\<`undefined` \| `ChainFormatters`\> & `object`

### activeChainId

> **activeChainId**: `number`

### activeNetwork

> **activeNetwork**: `string`

### availableChains

> **availableChains**: `Chain`[]

### canProgrammaticallySwitchNetwork

> **canProgrammaticallySwitchNetwork**: `boolean`

### chains

> **chains**: `Chain`[]

### connectors?

> `optional` **connectors**: `Connector`\<`any`, `any`\>[]

### currentNetwork

> **currentNetwork**: `undefined` \| `Network`

### currentNetworkNew

> **currentNetworkNew**: `GetNetworkResult`

### isActiveChainUnsupported

> **isActiveChainUnsupported**: `boolean`

### isSwitchingChain

> **isSwitchingChain**: `boolean`

### networkError

> **networkError**: `null` \| `Error`

### pendingConnector?

> `optional` **pendingConnector**: `Connector`\<`any`, `any`\>

### stopSwitching()

> **stopSwitching**: () => `void`

#### Returns

`void`

### switchNetwork()?

> `optional` **switchNetwork**: (`chainId`?) => `void`

#### Parameters

• **chainId?**: `number`

#### Returns

`void`

### switchNetworkAsync()?

> `optional` **switchNetworkAsync**: (`chainId_`?) => `Promise`\<`Chain`\>

#### Parameters

• **chainId\_?**: `number`

#### Returns

`Promise`\<`Chain`\>

### switchNetworkByName()

> **switchNetworkByName**: (`forcedNetworkParam`) => `void`

#### Parameters

• **forcedNetworkParam**: `NetworkName`

#### Returns

`void`

### switchingToChain

> **switchingToChain**: `undefined` \| `null` \| `number`
