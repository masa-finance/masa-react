[# Masa React
](../README.md) / [Exports](../modules.md) / [rest](rest.md) / balances

# Namespace: balances

[rest](rest.md).balances

## Table of contents

### Variables

- [metadata](rest.balances.md#metadata)

### Functions

- [useMethod](rest.balances.md#usemethod)
- [useSimpleMethod](rest.balances.md#usesimplemethod)

## Variables

### metadata

• `Const` **metadata**: [`MethodMetadata`](../interfaces/rest.MethodMetadata.md)

#### Defined in

[masa-react/src/common/rest/balances/index.ts:40](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/balances/index.ts#L40)

## Functions

### useMethod

▸ **useMethod**(`__namedParameters`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `unknown` |
| `error` | `undefined` \| `Error` |
| `getData` | (`lazyData?`: `any`) => `Promise`<`void`\> |
| `loading` | `boolean` |

#### Defined in

[masa-react/src/common/rest/balances/index.ts:7](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/balances/index.ts#L7)

___

### useSimpleMethod

▸ **useSimpleMethod**(`__namedParameters`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cancel` | () => `void` |
| `data` | `unknown` |
| `error` | `undefined` \| `Error` |
| `loading` | `boolean` |
| `refetch` | () => `Promise`<`void`\> |

#### Defined in

[masa-react/src/common/rest/balances/index.ts:18](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/balances/index.ts#L18)
