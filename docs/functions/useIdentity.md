[**# Masa React v2.22.0-alpha.0**](../README.md) • **Docs**

***

[# Masa React v2.22.0-alpha.0](../globals.md) / useIdentity

# Function: useIdentity()

> **useIdentity**(): `object`

## Returns

`object`

### getIdentity()

> **getIdentity**: (`options`?) => `Promise`\<`QueryObserverResult`\<`undefined` \| `null` \| `object`, `Error`\>\>

#### Parameters

• **options?**: `RefetchOptions`

#### Returns

`Promise`\<`QueryObserverResult`\<`undefined` \| `null` \| `object`, `Error`\>\>

### hasIdentity

> **hasIdentity**: `undefined` \| `false` \| `BigNumber`

### identity

> **identity**: `undefined` \| `null` \| `object`

### isFetchingIdentity

> **isFetchingIdentity**: `boolean`

### isIdentityAvailableInNetwork

> **isIdentityAvailableInNetwork**: `boolean`

### isIdentityLoading

> **isIdentityLoading**: `boolean` = `isLoadingIdentity`

### isLoadingIdentity

> **isLoadingIdentity**: `boolean`

### reloadIdentity()

> **reloadIdentity**: (`options`?) => `Promise`\<`QueryObserverResult`\<`undefined` \| `null` \| `object`, `Error`\>\> = `getIdentity`

#### Parameters

• **options?**: `RefetchOptions`

#### Returns

`Promise`\<`QueryObserverResult`\<`undefined` \| `null` \| `object`, `Error`\>\>
