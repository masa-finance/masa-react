[# Masa React
](../README.md) / [Exports](../modules.md) / [rest](rest.md) / listVezgoAccounts

# Namespace: listVezgoAccounts

[rest](rest.md).listVezgoAccounts

## Table of contents

### Variables

- [metadata](rest.listVezgoAccounts.md#metadata)

### Functions

- [useMethod](rest.listVezgoAccounts.md#usemethod)
- [useSimpleMethod](rest.listVezgoAccounts.md#usesimplemethod)

## Variables

### metadata

• `Const` **metadata**: [`MethodMetadata`](../interfaces/rest.MethodMetadata.md)

#### Defined in

[masa-react/src/common/rest/vezgo/list-accounts/index.ts:42](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/vezgo/list-accounts/index.ts#L42)

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

[masa-react/src/common/rest/vezgo/list-accounts/index.ts:7](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/vezgo/list-accounts/index.ts#L7)

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

[masa-react/src/common/rest/vezgo/list-accounts/index.ts:17](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/vezgo/list-accounts/index.ts#L17)
