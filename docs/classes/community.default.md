[community-js](../README.md) / [community](../modules/community.md) / default

# Class: default

[community](../modules/community.md).default

## Table of contents

### Constructors

- [constructor](community.default.md#constructor)

### Methods

- [create](community.default.md#create)
- [finalize](community.default.md#finalize)
- [get](community.default.md#get)
- [getActionCost](community.default.md#getactioncost)
- [getBalance](community.default.md#getbalance)
- [getCommunityContract](community.default.md#getcommunitycontract)
- [getContractSourceId](community.default.md#getcontractsourceid)
- [getCreateCost](community.default.md#getcreatecost)
- [getFee](community.default.md#getfee)
- [getMainContractId](community.default.md#getmaincontractid)
- [getRole](community.default.md#getrole)
- [getState](community.default.md#getstate)
- [getUnlockedBalance](community.default.md#getunlockedbalance)
- [getVaultBalance](community.default.md#getvaultbalance)
- [getWalletAddress](community.default.md#getwalletaddress)
- [increaseVault](community.default.md#increasevault)
- [lockBalance](community.default.md#lockbalance)
- [proposeVote](community.default.md#proposevote)
- [selectWeightedHolder](community.default.md#selectweightedholder)
- [setCommunityTx](community.default.md#setcommunitytx)
- [setContractSourceId](community.default.md#setcontractsourceid)
- [setState](community.default.md#setstate)
- [setWallet](community.default.md#setwallet)
- [transfer](community.default.md#transfer)
- [transferLocked](community.default.md#transferlocked)
- [unlockVault](community.default.md#unlockvault)
- [vote](community.default.md#vote)

## Constructors

### constructor

• **new default**(`arweave`, `wallet?`, `cacheTTL?`)

Before interacting with Community you need to have at least Arweave initialized.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arweave` | `default` | Arweave instance |
| `wallet?` | `JWKInterface` \| ``"use_wallet"`` | JWK wallet file data |
| `cacheTTL` | `number` | Refresh interval in milliseconds for the cached state |

## Methods

### create

▸ **create**(`tags?`): `Promise`<`string`\>

Create a new Community with the current, previously saved (with `setState`) state.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The created community transaction ID.

___

### finalize

▸ **finalize**(`id`, `tags?`): `Promise`<`string`\>

Finalize a vote, to run the desired vote details if approved, or reject it and close.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `id` | `number` | `undefined` | The vote ID, this is the index of the vote in votes |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The transaction ID for this action

___

### get

▸ **get**(`params?`): `Promise`<[`ResultInterface`](../interfaces/faces.ResultInterface.md)\>

Do a GET call to any function on the contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`InputInterface`](../interfaces/faces.InputInterface.md) | InputInterface |

#### Returns

`Promise`<[`ResultInterface`](../interfaces/faces.ResultInterface.md)\>

ResultInterface

___

### getActionCost

▸ **getActionCost**(`inAr?`, `options?`): `Promise`<`string`\>

Get the current action (post interaction) cost of a community.

**`deprecated`** use getFee() instead.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `inAr` | `boolean` | `false` | Return in winston or AR |
| `options?` | `Object` | `undefined` | If return inAr is set to true, these options are used to format the returned AR value. |
| `options.decimals` | `number` | `undefined` | - |
| `options.formatted` | `boolean` | `undefined` | - |
| `options.trim` | `boolean` | `undefined` | - |

#### Returns

`Promise`<`string`\>

___

### getBalance

▸ **getBalance**(`target?`): `Promise`<`number`\>

Get the target or current wallet token balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `string` | The target wallet address |

#### Returns

`Promise`<`number`\>

Current target token balance

___

### getCommunityContract

▸ **getCommunityContract**(): `Promise`<`string`\>

Get the current Community contract ID

#### Returns

`Promise`<`string`\>

___

### getContractSourceId

▸ **getContractSourceId**(): `Promise`<`string`\>

Get the contract source txid used for new PSCs.

#### Returns

`Promise`<`string`\>

The contract source ID.

___

### getCreateCost

▸ **getCreateCost**(`inAr?`, `options?`): `Promise`<`string`\>

Get the current create cost of a community.

**`deprecated`** use getFee() instead.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `inAr` | `boolean` | `false` | Return in winston or AR |
| `options?` | `Object` | `undefined` | If return inAr is set to true, these options are used to format the returned AR value. |
| `options.decimals` | `number` | `undefined` | - |
| `options.formatted` | `boolean` | `undefined` | - |
| `options.trim` | `boolean` | `undefined` | - |

#### Returns

`Promise`<`string`\>

___

### getFee

▸ **getFee**(`inAr?`, `options?`): `Promise`<`string`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `inAr` | `boolean` | `false` |
| `options?` | `Object` | `undefined` |
| `options.decimal?` | `boolean` | `undefined` |
| `options.formatted` | `boolean` | `undefined` |
| `options.trim?` | `boolean` | `undefined` |

#### Returns

`Promise`<`string`\>

___

### getMainContractId

▸ **getMainContractId**(): `Promise`<`string`\>

Get the Main Community contract ID

#### Returns

`Promise`<`string`\>

The main contract ID.

___

### getRole

▸ **getRole**(`target?`): `Promise`<`string`\>

Get the target or current wallet role

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `string` | The target wallet address |

#### Returns

`Promise`<`string`\>

Current target role

___

### getState

▸ **getState**(`cached?`): `Promise`<[`StateInterface`](../interfaces/faces.StateInterface.md)\>

Get the current Community state.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cached` | `boolean` | `true` | Wether to return the cached version or reload |

#### Returns

`Promise`<[`StateInterface`](../interfaces/faces.StateInterface.md)\>

- The current state and sync afterwards if needed.

___

### getUnlockedBalance

▸ **getUnlockedBalance**(`target?`): `Promise`<`number`\>

Get the target or current wallet unlocked token balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `string` | The target wallet address |

#### Returns

`Promise`<`number`\>

Current target token balance

___

### getVaultBalance

▸ **getVaultBalance**(`target?`): `Promise`<`number`\>

Get the target or current wallet vault balance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `string` | The target wallet address |

#### Returns

`Promise`<`number`\>

Current target token balance

___

### getWalletAddress

▸ **getWalletAddress**(): `Promise`<`string`\>

Get the current wallet address.

#### Returns

`Promise`<`string`\>

Promise<string> Wallet address

___

### increaseVault

▸ **increaseVault**(`vaultId`, `lockLength`, `tags?`): `Promise`<`string`\>

Increase the lock time (in blocks) of a vault.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `vaultId` | `number` | `undefined` | The vault index position to increase |
| `lockLength` | `number` | `undefined` | Length of the lock, in blocks |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The transaction ID for this action

___

### lockBalance

▸ **lockBalance**(`qty`, `lockLength`, `tags?`): `Promise`<`string`\>

Lock your balances in a vault to earn voting weight.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `qty` | `number` | `undefined` | Positive integer for the quantity to lock |
| `lockLength` | `number` | `undefined` | Length of the lock, in blocks |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The transaction ID for this action

___

### proposeVote

▸ **proposeVote**(`params`, `tags?`): `Promise`<`string`\>

Create a new vote

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `params` | [`VoteInterface`](../interfaces/faces.VoteInterface.md) | `undefined` | VoteInterface without the "function" |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The transaction ID for this action

___

### selectWeightedHolder

▸ **selectWeightedHolder**(`balances?`, `vault?`): `Promise`<`string`\>

Select one of your community holders based on their weighted total balance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `balances` | [`BalancesInterface`](../interfaces/faces.BalancesInterface.md) | State balances, optional. |
| `vault` | [`VaultInterface`](../interfaces/faces.VaultInterface.md) | State vault, optional. |

#### Returns

`Promise`<`string`\>

___

### setCommunityTx

▸ **setCommunityTx**(`txId`): `Promise`<`boolean`\>

Set the Community interactions to this transaction ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txId` | `string` | Community's Transaction ID |

#### Returns

`Promise`<`boolean`\>

boolean - True if successful, false if error.

___

### setContractSourceId

▸ **setContractSourceId**(`id`): `Promise`<`boolean`\>

Update the used contract source transaction ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | New contract source ID. |

#### Returns

`Promise`<`boolean`\>

boolean that validates if the update was done.

___

### setState

▸ **setState**(`name`, `ticker`, `balances`, `quorum?`, `support?`, `voteLength?`, `lockMinLength?`, `lockMaxLength?`, `vault?`, `votes?`, `roles?`, `extraSettings?`): `Promise`<[`StateInterface`](../interfaces/faces.StateInterface.md)\>

Set the states for a new Community using the Community contract.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The Community name |
| `ticker` | `string` | `undefined` | Currency ticker, ex: TICK |
| `balances` | [`BalancesInterface`](../interfaces/faces.BalancesInterface.md) | `undefined` | an object of wallet addresses and their token balances |
| `quorum` | `number` | `50` | % of votes weight, for a proposal to be valid |
| `support` | `number` | `50` | = % of votes as "yes", for a vote to be valid |
| `voteLength` | `number` | `2000` | For how long (in blocks) should the vote be active |
| `lockMinLength` | `number` | `720` | What is the minimum lock time (in blocks) |
| `lockMaxLength` | `number` | `10000` | What is the maximum lock time (in blocks) |
| `vault` | [`VaultInterface`](../interfaces/faces.VaultInterface.md) | `{}` | Vault object, optional |
| `votes` | [`VoteInterface`](../interfaces/faces.VoteInterface.md)[] | `[]` | Votes, optional |
| `roles` | [`RoleInterface`](../interfaces/faces.RoleInterface.md) | `{}` | Roles, optional |
| `extraSettings` | [`string`, `any`][] | `[]` | Any custom extra settings can be sent here. @since v1.1.0 |

#### Returns

`Promise`<[`StateInterface`](../interfaces/faces.StateInterface.md)\>

- The created state

___

### setWallet

▸ **setWallet**(`wallet`, `address?`): `Promise`<`string`\>

Set the user wallet data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `JWKInterface` \| ``"use_wallet"`` | JWK wallet file data |
| `address?` | `string` | - |

#### Returns

`Promise`<`string`\>

The wallet address

___

### transfer

▸ **transfer**(`target`, `qty`, `tags?`): `Promise`<`string`\>

Transfer token balances to another account.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `target` | `string` | `undefined` | Target Wallet Address |
| `qty` | `number` | `undefined` | Amount of the token to send |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The transaction ID for this action

___

### transferLocked

▸ **transferLocked**(`target`, `qty`, `lockLength`, `tags?`): `Promise`<`string`\>

Transfer tokens to an account's vault.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `target` | `string` | `undefined` | Target Wallet Address |
| `qty` | `number` | `undefined` | Amount of the token to send |
| `lockLength` | `number` | `undefined` | For how many blocks to lock the tokens |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The transaction ID for this action

___

### unlockVault

▸ **unlockVault**(`tags?`): `Promise`<`string`\>

Unlock all your locked balances that are over the lock period.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The transaction ID for this action

___

### vote

▸ **vote**(`id`, `cast`, `tags?`): `Promise`<`string`\>

Cast a vote on an existing, and active, vote proposal.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `id` | `number` | `undefined` | The vote ID, this is the index of the vote in votes |
| `cast` | ``"yay"`` \| ``"nay"`` | `undefined` | Cast your vote with 'yay' (for yes) or 'nay' (for no) |
| `tags` | [`TagInterface`](../interfaces/faces.TagInterface.md)[] | `[]` | optional: tags to be added to this transaction |

#### Returns

`Promise`<`string`\>

The transaction ID for this action
