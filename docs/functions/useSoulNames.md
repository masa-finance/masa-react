[**# Masa React v3.20.1**](../README.md) • **Docs**

***

[# Masa React v3.20.1](../globals.md) / useSoulNames

# Function: useSoulNames()

> **useSoulNames**(): `object`

## Returns

`object`

### getSoulnames()

> **getSoulnames**: (`options`?) => `Promise`\<`QueryObserverResult`\<`null` \| `string`[], `Error`\>\>

#### Parameters

• **options?**: `RefetchOptions`

#### Returns

`Promise`\<`QueryObserverResult`\<`null` \| `string`[], `Error`\>\>

### isLoadingSoulnames

> **isLoadingSoulnames**: `boolean`

### isSoulnameAvailableInNetwork

> **isSoulnameAvailableInNetwork**: `boolean`

### isSoulnamesLoading

> **isSoulnamesLoading**: `boolean` = `isLoadingSoulnames`

### reloadSoulnames()

> **reloadSoulnames**: (`options`?) => `Promise`\<`QueryObserverResult`\<`null` \| `string`[], `Error`\>\> = `getSoulnames`

#### Parameters

• **options?**: `RefetchOptions`

#### Returns

`Promise`\<`QueryObserverResult`\<`null` \| `string`[], `Error`\>\>

### soulnames

> **soulnames**: `undefined` \| `null` \| `string`[]
