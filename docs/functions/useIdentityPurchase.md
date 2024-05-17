[**# Masa React v2.22.0-alpha.0**](../README.md) • **Docs**

***

[# Masa React v2.22.0-alpha.0](../globals.md) / useIdentityPurchase

# Function: useIdentityPurchase()

> **useIdentityPurchase**(): `object`

## Returns

`object`

### handlePurchaseIdentity()

> **handlePurchaseIdentity**: () => `Promise`\<`undefined` \| `boolean`\> = `purchaseIdentity`

#### Returns

`Promise`\<`undefined` \| `boolean`\>

### handlePurchaseIdentityWithSoulname()

> **handlePurchaseIdentityWithSoulname**: (`paymentMethod`, `soulname`, `registrationPeriod`, `style`?) => `Promise`\<`undefined` \| `object` & `CreateSoulNameResult`\> = `purchaseIdentityWithSoulName`

#### Parameters

• **paymentMethod**: `PaymentMethod`

• **soulname**: `string`

• **registrationPeriod**: `number`

• **style?**: `string`

#### Returns

`Promise`\<`undefined` \| `object` & `CreateSoulNameResult`\>

### hasPurchasedIdentity

> **hasPurchasedIdentity**: `undefined` \| `boolean`

### hasPurchasedIdentityWithSoulName

> **hasPurchasedIdentityWithSoulName**: `undefined` \| `object` & `CreateSoulNameResult`

### isPurchasingIdentity

> **isPurchasingIdentity**: `boolean`

### isPurchasingIdentityWithSoulName

> **isPurchasingIdentityWithSoulName**: `boolean`

### purchaseIdentity()

> **purchaseIdentity**: () => `Promise`\<`undefined` \| `boolean`\>

#### Returns

`Promise`\<`undefined` \| `boolean`\>

### purchaseIdentityError

> **purchaseIdentityError**: `undefined` \| `Error`

### purchaseIdentityWithSoulName()

> **purchaseIdentityWithSoulName**: (`paymentMethod`, `soulname`, `registrationPeriod`, `style`?) => `Promise`\<`undefined` \| `object` & `CreateSoulNameResult`\>

#### Parameters

• **paymentMethod**: `PaymentMethod`

• **soulname**: `string`

• **registrationPeriod**: `number`

• **style?**: `string`

#### Returns

`Promise`\<`undefined` \| `object` & `CreateSoulNameResult`\>

### purchaseIdentityWithSoulnameError

> **purchaseIdentityWithSoulnameError**: `undefined` \| `Error`
