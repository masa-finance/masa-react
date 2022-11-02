[# Masa React
](../README.md) / [Exports](../modules.md) / [rest](rest.md) / checkSignatureChallenge

# Namespace: checkSignatureChallenge

[rest](rest.md).checkSignatureChallenge

## Table of contents

### Variables

- [metadata](rest.checkSignatureChallenge.md#metadata)

### Functions

- [useMethod](rest.checkSignatureChallenge.md#usemethod)
- [useSimpleMethod](rest.checkSignatureChallenge.md#usesimplemethod)

## Variables

### metadata

• `Const` **metadata**: [`MethodMetadata`](../interfaces/rest.MethodMetadata.md)

#### Defined in

[masa-react/src/common/rest/check-challenge-signature/index.ts:49](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/check-challenge-signature/index.ts#L49)

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

[masa-react/src/common/rest/check-challenge-signature/index.ts:6](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/check-challenge-signature/index.ts#L6)

___

### useSimpleMethod

▸ **useSimpleMethod**(`__namedParameters`): `UseMutationResult`<`any`, `unknown`, `any`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `any` |

#### Returns

`UseMutationResult`<`any`, `unknown`, `any`, `unknown`\>

#### Defined in

[masa-react/src/common/rest/check-challenge-signature/index.ts:16](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/rest/check-challenge-signature/index.ts#L16)
