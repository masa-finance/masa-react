[# Masa React
](../README.md) / [Exports](../modules.md) / [rest](rest.md) / listPlaidTransaction

# Namespace: listPlaidTransaction

[rest](rest.md).listPlaidTransaction

## Table of contents

### Variables

- [metadata](rest.listPlaidTransaction.md#metadata)

### Functions

- [useMethod](rest.listPlaidTransaction.md#usemethod)
- [useSimpleMethod](rest.listPlaidTransaction.md#usesimplemethod)

## Variables

### metadata

• `Const` **metadata**: [`MethodMetadata`](../interfaces/rest.MethodMetadata.md)

#### Defined in

[masa-react/src/common/rest/plaid/list-plaid-transactions/index.ts:64](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/plaid/list-plaid-transactions/index.ts#L64)

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

[masa-react/src/common/rest/plaid/list-plaid-transactions/index.ts:8](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/plaid/list-plaid-transactions/index.ts#L8)

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

[masa-react/src/common/rest/plaid/list-plaid-transactions/index.ts:18](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/plaid/list-plaid-transactions/index.ts#L18)
