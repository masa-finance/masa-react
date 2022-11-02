[# Masa React
](../README.md) / [Exports](../modules.md) / [rest](rest.md) / getClient

# Namespace: getClient

[rest](rest.md).getClient

## Table of contents

### Variables

- [metadata](rest.getClient.md#metadata)

### Functions

- [useMethod](rest.getClient.md#usemethod)
- [useSimpleMethod](rest.getClient.md#usesimplemethod)

## Variables

### metadata

• `Const` **metadata**: [`MethodMetadata`](../interfaces/rest.MethodMetadata.md)

#### Defined in

[masa-react/src/common/rest/getUser/index.ts:29](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/getUser/index.ts#L29)

## Functions

### useMethod

▸ **useMethod**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `unknown` |
| `error` | `undefined` \| `Error` |
| `getData` | (`lazyData?`: `any`) => `Promise`<`void`\> |
| `loading` | `boolean` |

#### Defined in

[masa-react/src/common/rest/getUser/index.ts:7](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/getUser/index.ts#L7)

___

### useSimpleMethod

▸ **useSimpleMethod**(`__namedParameters`): `UseQueryResult`<`any`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `any` |

#### Returns

`UseQueryResult`<`any`, `unknown`\>

#### Defined in

[masa-react/src/common/rest/getUser/index.ts:15](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/getUser/index.ts#L15)
