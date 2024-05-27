[**# Masa React v2.22.0**](../README.md) • **Docs**

***

[# Masa React v2.22.0](../globals.md) / useSession

# Function: useSession()

> **useSession**(): `object`

## Returns

`object`

### checkLogin()

> **checkLogin**: (`options`?) => `Promise`\<`QueryObserverResult`\<`null` \| `boolean`, `Error`\>\>

#### Parameters

• **options?**: `RefetchOptions`

#### Returns

`Promise`\<`QueryObserverResult`\<`null` \| `boolean`, `Error`\>\>

### getSession()

> **getSession**: (`options`?) => `Promise`\<`QueryObserverResult`\<`null` \| `ISession`, `Error`\>\>

#### Parameters

• **options?**: `RefetchOptions`

#### Returns

`Promise`\<`QueryObserverResult`\<`null` \| `ISession`, `Error`\>\>

### handleLogin()

> **handleLogin**: () => `Promise`\<`null` \| `LoginResult`\> = `loginSessionAsync`

#### Returns

`Promise`\<`null` \| `LoginResult`\>

### handleLogout()

> **handleLogout**: (`logoutCallback`?) => `Promise`\<`void`\>

#### Parameters

• **logoutCallback?**

#### Returns

`Promise`\<`void`\>

### hasSession

> **hasSession**: `undefined` \| `null` \| `boolean`

### isCheckingLogin

> **isCheckingLogin**: `boolean`

### isFetchingSession

> **isFetchingSession**: `boolean`

### isLoadingSession

> **isLoadingSession**: `boolean`

### isLoggedIn

> **isLoggedIn**: `undefined` \| `null` \| `boolean` = `hasSession`

### isLoggingIn

> **isLoggingIn**: `boolean`

### isLoggingOut

> **isLoggingOut**: `boolean`

### isSessionLoading

> **isSessionLoading**: `boolean` = `isLoadingSession`

### loginSession()

> **loginSession**: () => `Promise`\<`null` \| `LoginResult`\> = `loginSessionAsync`

#### Returns

`Promise`\<`null` \| `LoginResult`\>

### loginSessionAsync()

> **loginSessionAsync**: () => `Promise`\<`null` \| `LoginResult`\>

#### Returns

`Promise`\<`null` \| `LoginResult`\>

### logoutSession()

> **logoutSession**: () => `Promise`\<`undefined` \| `object`\>

#### Returns

`Promise`\<`undefined` \| `object`\>

### session

> **session**: `undefined` \| `null` \| `ISession`

### sessionAddress

> **sessionAddress**: `undefined` \| `string`
