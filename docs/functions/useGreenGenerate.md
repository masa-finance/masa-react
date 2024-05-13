[**# Masa React v3.20.2**](../README.md) • **Docs**

***

[# Masa React v3.20.2](../globals.md) / useGreenGenerate

# Function: useGreenGenerate()

> **useGreenGenerate**(): `object`

## Returns

`object`

### createGreen()

> **createGreen**: (`phoneNumber`, `code`) => `Promise`\<`null` \| `GreenBaseResult`\>

#### Parameters

• **phoneNumber**: `string`

• **code**: `string`

#### Returns

`Promise`\<`null` \| `GreenBaseResult`\>

### createGreenError

> **createGreenError**: `undefined` \| `Error`

### generateGreen()

> **generateGreen**: (`phoneNumber`) => `Promise`\<`null` \| `GenerateGreenResult`\>

#### Parameters

• **phoneNumber**: `string`

#### Returns

`Promise`\<`null` \| `GenerateGreenResult`\>

### generateGreenError

> **generateGreenError**: `undefined` \| `Error`

### handleCreateGreen()

> **handleCreateGreen**: (`phoneNumber`, `code`) => `Promise`\<`null` \| `GreenBaseResult`\> = `createGreen`

#### Parameters

• **phoneNumber**: `string`

• **code**: `string`

#### Returns

`Promise`\<`null` \| `GreenBaseResult`\>

### handleGenerateGreen()

> **handleGenerateGreen**: (`phoneNumber`) => `Promise`\<`null` \| `GenerateGreenResult`\> = `generateGreen`

#### Parameters

• **phoneNumber**: `string`

#### Returns

`Promise`\<`null` \| `GenerateGreenResult`\>

### isCreatingGreen

> **isCreatingGreen**: `boolean`

### isGeneratingGreen

> **isGeneratingGreen**: `boolean`
