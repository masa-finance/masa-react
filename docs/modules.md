[# Masa React
](README.md) / Exports

# # Masa React

## Table of contents

### Namespaces

- [rest](modules/rest.md)

### Variables

- [addresses](modules.md#addresses)

### Functions

- [AccessTokenProvider](modules.md#accesstokenprovider)
- [MasaToolsProvider](modules.md#masatoolsprovider)
- [MasaToolsWrapper](modules.md#masatoolswrapper)
- [loadIdentityContracts](modules.md#loadidentitycontracts)
- [useContractCall](modules.md#usecontractcall)
- [useMasaTools](modules.md#usemasatools)

## Variables

### addresses

• `Const` **addresses**: `Addresses`

#### Defined in

masa-sdk/dist/src/contracts/addresses.d.ts:13

## Functions

### AccessTokenProvider

▸ **AccessTokenProvider**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `AccessTokenProps` |

#### Returns

`Element`

#### Defined in

[masa-react/src/common/helpers/provider/access-token-provider.tsx:17](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/helpers/provider/access-token-provider.tsx#L17)

___

### MasaToolsProvider

▸ **MasaToolsProvider**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `MasaToolsProviderProps` |

#### Returns

`Element`

#### Defined in

[masa-react/src/common/helpers/provider/masa-tools-provider.tsx:18](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/helpers/provider/masa-tools-provider.tsx#L18)

___

### MasaToolsWrapper

▸ **MasaToolsWrapper**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `MasaToolsWrapperProps` |

#### Returns

`Element`

#### Defined in

[masa-react/src/common/components/masa-tools-wrapper/index.tsx:9](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/components/masa-tools-wrapper/index.tsx#L9)

___

### loadIdentityContracts

▸ **loadIdentityContracts**(`__namedParameters`): `Promise`<`IIdentityContracts`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `LoadContractArgs` |

#### Returns

`Promise`<`IIdentityContracts`\>

#### Defined in

masa-sdk/dist/src/contracts/loadIdentityContracts.d.ts:7

___

### useContractCall

▸ **useContractCall**(`__namedParameters`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.method` | `Promise`<`any`\> |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `error` | `any` |
| `getData` | () => `any` |
| `loading` | `boolean` |

#### Defined in

[masa-react/src/common/helpers/contracts/index.ts:1](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/helpers/contracts/index.ts#L1)

___

### useMasaTools

▸ **useMasaTools**(): `MasaToolsShape`

#### Returns

`MasaToolsShape`

#### Defined in

[masa-react/src/common/helpers/provider/masa-tools-provider.tsx:34](https://github.com/masa-finance/masa-react/blob/9cffd5b/src/common/helpers/provider/masa-tools-provider.tsx#L34)
