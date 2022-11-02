[# Masa React
](../README.md) / [Exports](../modules.md) / [rest](rest.md) / postNodeOperators

# Namespace: postNodeOperators

[rest](rest.md).postNodeOperators

## Table of contents

### Variables

- [metadata](rest.postNodeOperators.md#metadata)

### Functions

- [useMethod](rest.postNodeOperators.md#usemethod)
- [useSimpleMethod](rest.postNodeOperators.md#usesimplemethod)

## Variables

### metadata

• `Const` **metadata**: [`MethodMetadata`](../interfaces/rest.MethodMetadata.md)

#### Defined in

[masa-react/src/common/rest/post-node-operators/index.ts:39](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/post-node-operators/index.ts#L39)

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

[masa-react/src/common/rest/post-node-operators/index.ts:7](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/post-node-operators/index.ts#L7)

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

[masa-react/src/common/rest/post-node-operators/index.ts:17](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/post-node-operators/index.ts#L17)
