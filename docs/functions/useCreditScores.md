[**# Masa React v3.20.2**](../README.md) • **Docs**

***

[# Masa React v3.20.2](../globals.md) / useCreditScores

# Function: useCreditScores()

> **useCreditScores**(): `object`

## Returns

`object`

### creditScores

> **creditScores**: `undefined` \| `null` \| `CreditScoreDetails`[]

### getCreditScores()

> **getCreditScores**: (`options`?) => `Promise`\<`QueryObserverResult`\<`null` \| `CreditScoreDetails`[], `Error`\>\>

#### Parameters

• **options?**: `RefetchOptions`

#### Returns

`Promise`\<`QueryObserverResult`\<`null` \| `CreditScoreDetails`[], `Error`\>\>

### isCreditScoreAvailableInNetwork

> **isCreditScoreAvailableInNetwork**: `boolean`

### isCreditScoresLoading

> **isCreditScoresLoading**: `boolean` = `isLoadingCreditScores`

### isLoadingCreditScores

> **isLoadingCreditScores**: `boolean`

### reloadCreditScores()

> **reloadCreditScores**: (`options`?) => `Promise`\<`QueryObserverResult`\<`null` \| `CreditScoreDetails`[], `Error`\>\> = `getCreditScores`

#### Parameters

• **options?**: `RefetchOptions`

#### Returns

`Promise`\<`QueryObserverResult`\<`null` \| `CreditScoreDetails`[], `Error`\>\>
