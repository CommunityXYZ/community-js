[community-js](../README.md) › [Globals](../globals.md) › ["community"](../modules/_community_.md) › [Community](_community_.community.md)

# Class: Community

## Hierarchy

* **Community**

## Index

### Constructors

* [constructor](_community_.community.md#constructor)

### Methods

* [create](_community_.community.md#create)
* [finalize](_community_.community.md#finalize)
* [get](_community_.community.md#get)
* [getActionCost](_community_.community.md#getactioncost)
* [getBalance](_community_.community.md#getbalance)
* [getCreateCost](_community_.community.md#getcreatecost)
* [getRole](_community_.community.md#getrole)
* [getState](_community_.community.md#getstate)
* [getUnlockedBalance](_community_.community.md#getunlockedbalance)
* [getVaultBalance](_community_.community.md#getvaultbalance)
* [increaseVault](_community_.community.md#increasevault)
* [lockBalance](_community_.community.md#lockbalance)
* [proposeVote](_community_.community.md#proposevote)
* [selectWeightedHolder](_community_.community.md#selectweightedholder)
* [setCommunityTx](_community_.community.md#setcommunitytx)
* [setState](_community_.community.md#setstate)
* [setWallet](_community_.community.md#setwallet)
* [transfer](_community_.community.md#transfer)
* [unlockVault](_community_.community.md#unlockvault)
* [vote](_community_.community.md#vote)

## Constructors

###  constructor

\+ **new Community**(`arweave`: Arweave, `wallet?`: JWKInterface, `cacheRefreshInterval`: number): *[Community](_community_.community.md)*

*Defined in [community.ts:23](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L23)*

Before interacting with Community you need to have at least Arweave initialized.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`arweave` | Arweave | - | Arweave instance |
`wallet?` | JWKInterface | - | JWK wallet file data |
`cacheRefreshInterval` | number | 1000 * 60 * 2 | Refresh interval in milliseconds for the cached state  |

**Returns:** *[Community](_community_.community.md)*

## Methods

###  create

▸ **create**(): *Promise‹string›*

*Defined in [community.ts:194](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L194)*

Create a new Community with the current, previously saved (with `setState`) state.

**Returns:** *Promise‹string›*

The created community transaction ID.

___

###  finalize

▸ **finalize**(`id`: number): *Promise‹string›*

*Defined in [community.ts:438](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L438)*

Finalize a vote, to run the desired vote details if approved, or reject it and close.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | number | The vote ID, this is the index of the vote in votes |

**Returns:** *Promise‹string›*

The transaction ID for this action

___

###  get

▸ **get**(`params`: [InputInterface](../interfaces/_faces_.inputinterface.md)): *Promise‹[ResultInterface](../interfaces/_faces_.resultinterface.md)›*

*Defined in [community.ts:256](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L256)*

Do a GET call to any function on the contract.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`params` | [InputInterface](../interfaces/_faces_.inputinterface.md) | { function: 'balance' } | InputInterface |

**Returns:** *Promise‹[ResultInterface](../interfaces/_faces_.resultinterface.md)›*

ResultInterface

___

###  getActionCost

▸ **getActionCost**(`inAr`: boolean, `options?`: object): *Promise‹string›*

*Defined in [community.ts:229](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L229)*

Get the current action (post interaction) cost of a community.

**Parameters:**

▪`Default value`  **inAr**: *boolean*= false

Return in winston or AR

▪`Optional`  **options**: *object*

If return inAr is set to true, these options are used to format the returned AR value.

Name | Type |
------ | ------ |
`decimals` | number |
`formatted` | boolean |
`trim` | boolean |

**Returns:** *Promise‹string›*

___

###  getBalance

▸ **getBalance**(`target`: string): *Promise‹number›*

*Defined in [community.ts:266](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L266)*

Get the target or current wallet token balance

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | string | this.walletAddress | The target wallet address |

**Returns:** *Promise‹number›*

Current target token balance

___

###  getCreateCost

▸ **getCreateCost**(`inAr`: boolean, `options?`: object): *Promise‹string›*

*Defined in [community.ts:213](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L213)*

Get the current create cost of a community.

**Parameters:**

▪`Default value`  **inAr**: *boolean*= false

Return in winston or AR

▪`Optional`  **options**: *object*

If return inAr is set to true, these options are used to format the returned AR value.

Name | Type |
------ | ------ |
`decimals` | number |
`formatted` | boolean |
`trim` | boolean |

**Returns:** *Promise‹string›*

___

###  getRole

▸ **getRole**(`target`: string): *Promise‹string›*

*Defined in [community.ts:296](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L296)*

Get the target or current wallet role

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | string | this.walletAddress | The target wallet address |

**Returns:** *Promise‹string›*

Current target role

___

###  getState

▸ **getState**(`cached`: boolean): *Promise‹[StateInterface](../interfaces/_faces_.stateinterface.md)›*

*Defined in [community.ts:52](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L52)*

Get the current Community state.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`cached` | boolean | true | Wether to return the cached version or reload |

**Returns:** *Promise‹[StateInterface](../interfaces/_faces_.stateinterface.md)›*

- The current state and sync afterwards if needed.

___

###  getUnlockedBalance

▸ **getUnlockedBalance**(`target`: string): *Promise‹number›*

*Defined in [community.ts:276](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L276)*

Get the target or current wallet unlocked token balance

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | string | this.walletAddress | The target wallet address |

**Returns:** *Promise‹number›*

Current target token balance

___

###  getVaultBalance

▸ **getVaultBalance**(`target`: string): *Promise‹number›*

*Defined in [community.ts:286](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L286)*

Get the target or current wallet vault balance

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | string | this.walletAddress | The target wallet address |

**Returns:** *Promise‹number›*

Current target token balance

___

###  increaseVault

▸ **increaseVault**(`vaultId`: number, `lockLength`: number): *Promise‹string›*

*Defined in [community.ts:382](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L382)*

Increase the lock time (in blocks) of a vault.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`vaultId` | number | The vault index position to increase |
`lockLength` | number | Length of the lock, in blocks |

**Returns:** *Promise‹string›*

The transaction ID for this action

___

###  lockBalance

▸ **lockBalance**(`qty`: number, `lockLength`: number): *Promise‹string›*

*Defined in [community.ts:362](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L362)*

Lock your balances in a vault to earn voting weight.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`qty` | number | Positive integer for the quantity to lock |
`lockLength` | number | Length of the lock, in blocks |

**Returns:** *Promise‹string›*

The transaction ID for this action

___

###  proposeVote

▸ **proposeVote**(`params`: [VoteInterface](../interfaces/_faces_.voteinterface.md)): *Promise‹string›*

*Defined in [community.ts:392](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L392)*

Create a new vote

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | [VoteInterface](../interfaces/_faces_.voteinterface.md) | VoteInterface without the "function" |

**Returns:** *Promise‹string›*

The transaction ID for this action

___

###  selectWeightedHolder

▸ **selectWeightedHolder**(`balances`: [BalancesInterface](../interfaces/_faces_.balancesinterface.md), `vault`: [VaultInterface](../interfaces/_faces_.vaultinterface.md)): *Promise‹string›*

*Defined in [community.ts:306](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L306)*

Select one of your community holders based on their weighted total balance.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`balances` | [BalancesInterface](../interfaces/_faces_.balancesinterface.md) | this.state.balances | State balances, optional. |
`vault` | [VaultInterface](../interfaces/_faces_.vaultinterface.md) | this.state.vault | State vault, optional.  |

**Returns:** *Promise‹string›*

___

###  setCommunityTx

▸ **setCommunityTx**(`txId`: string): *Promise‹void›*

*Defined in [community.ts:243](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L243)*

Set the Community interactions to this transaction ID.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`txId` | string | Community's Transaction ID  |

**Returns:** *Promise‹void›*

___

###  setState

▸ **setState**(`name`: string, `ticker`: string, `balances`: [BalancesInterface](../interfaces/_faces_.balancesinterface.md), `quorum`: number, `support`: number, `voteLength`: number, `lockMinLength`: number, `lockMaxLength`: number, `vault`: [VaultInterface](../interfaces/_faces_.vaultinterface.md), `votes`: [VoteInterface](../interfaces/_faces_.voteinterface.md)[], `roles`: [RoleInterface](../interfaces/_faces_.roleinterface.md)): *Promise‹[StateInterface](../interfaces/_faces_.stateinterface.md)›*

*Defined in [community.ts:97](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L97)*

Set the states for a new Community using the Community contract.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | string | - | The Community name |
`ticker` | string | - | Currency ticker, ex: TICK |
`balances` | [BalancesInterface](../interfaces/_faces_.balancesinterface.md) | - | an object of wallet addresses and their token balances |
`quorum` | number | 50 | % of votes weight, for a proposal to be valid |
`support` | number | 50 | = % of votes as "yes", for a vote to be valid |
`voteLength` | number | 2000 | For how long (in blocks) should the vote be active |
`lockMinLength` | number | 720 | What is the minimum lock time (in blocks) |
`lockMaxLength` | number | 10000 | What is the maximum lock time (in blocks) |
`vault` | [VaultInterface](../interfaces/_faces_.vaultinterface.md) | {} | Vault object, optional |
`votes` | [VoteInterface](../interfaces/_faces_.voteinterface.md)[] | [] | Votes, optional |
`roles` | [RoleInterface](../interfaces/_faces_.roleinterface.md) | {} | Roles, optional  |

**Returns:** *Promise‹[StateInterface](../interfaces/_faces_.stateinterface.md)›*

- The created state

___

###  setWallet

▸ **setWallet**(`wallet`: JWKInterface): *Promise‹string›*

*Defined in [community.ts:74](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L74)*

Set the user wallet data.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`wallet` | JWKInterface | JWK wallet file data |

**Returns:** *Promise‹string›*

The wallet address

___

###  transfer

▸ **transfer**(`target`: string, `qty`: number): *Promise‹string›*

*Defined in [community.ts:351](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L351)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | string | Target Wallet Address |
`qty` | number | Amount of the token to send |

**Returns:** *Promise‹string›*

The transaction ID for this action

___

###  unlockVault

▸ **unlockVault**(): *Promise‹string›*

*Defined in [community.ts:371](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L371)*

Unlock all your locked balances that are over the lock period.

**Returns:** *Promise‹string›*

The transaction ID for this action

___

###  vote

▸ **vote**(`id`: number, `cast`: "yay" | "nay"): *Promise‹string›*

*Defined in [community.ts:428](https://github.com/CommunityXYZ/community-js/blob/17e7f95/src/community.ts#L428)*

Cast a vote on an existing, and active, vote proposal.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | number | The vote ID, this is the index of the vote in votes |
`cast` | "yay" &#124; "nay" | Cast your vote with 'yay' (for yes) or 'nay' (for no) |

**Returns:** *Promise‹string›*

The transaction ID for this action
