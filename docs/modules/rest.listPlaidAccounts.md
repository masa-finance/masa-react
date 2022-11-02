[# Masa React
](../README.md) / [Exports](../modules.md) / [rest](rest.md) / listPlaidAccounts

# Namespace: listPlaidAccounts

[rest](rest.md).listPlaidAccounts

## Table of contents

### Variables

- [metadata](rest.listPlaidAccounts.md#metadata)

### Functions

- [useMethod](rest.listPlaidAccounts.md#usemethod)
- [useSimpleMethod](rest.listPlaidAccounts.md#usesimplemethod)

## Variables

### metadata

• `Const` **metadata**: [`MethodMetadata`](../interfaces/rest.MethodMetadata.md)

#### Defined in

[masa-react/src/common/rest/plaid/list-plaid-accounts/index.ts:40](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/plaid/list-plaid-accounts/index.ts#L40)

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

[masa-react/src/common/rest/plaid/list-plaid-accounts/index.ts:7](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/plaid/list-plaid-accounts/index.ts#L7)

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

[masa-react/src/common/rest/plaid/list-plaid-accounts/index.ts:18](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/plaid/list-plaid-accounts/index.ts#L18)
