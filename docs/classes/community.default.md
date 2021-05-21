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
- [getFees](community.default.md#getfees)
- [getMainContractId](community.default.md#getmaincontractid)
- [getRole](community.default.md#getrole)
- [getState](community.default.md#getstate)
- [getUnlockedBalance](community.default.md#getunlockedbalance)
- [getVaultBalance](community.default.md#getvaultbalance)
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

\+ **new default**(`arweave`: *default*, `wallet?`: JWKInterface, `cacheRefreshInterval?`: *number*): [*default*](community.default.md)

Before interacting with Community you need to have at least Arweave initialized.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`arweave` | *default* | Arweave instance   |
`wallet?` | JWKInterface | JWK wallet file data   |
`cacheRefreshInterval` | *number* | Refresh interval in milliseconds for the cached state    |

**Returns:** [*default*](community.default.md)

## Methods

### create

▸ **create**(`tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Create a new Community with the current, previously saved (with `setState`) state.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The created community transaction ID.

___

### finalize

▸ **finalize**(`id`: *number*, `tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Finalize a vote, to run the desired vote details if approved, or reject it and close.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *number* | The vote ID, this is the index of the vote in votes   |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The transaction ID for this action

___

### get

▸ **get**(`params?`: [*InputInterface*](../interfaces/faces.inputinterface.md)): *Promise*<[*ResultInterface*](../interfaces/faces.resultinterface.md)\>

Do a GET call to any function on the contract.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`params` | [*InputInterface*](../interfaces/faces.inputinterface.md) | InputInterface   |

**Returns:** *Promise*<[*ResultInterface*](../interfaces/faces.resultinterface.md)\>

ResultInterface

___

### getActionCost

▸ **getActionCost**(`inAr?`: *boolean*, `options?`: { `decimals`: *number* ; `formatted`: *boolean* ; `trim`: *boolean*  }): *Promise*<string\>

Get the current action (post interaction) cost of a community.

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`inAr` | *boolean* | false | Return in winston or AR   |
`options?` | *object* | - | If return inAr is set to true, these options are used to format the returned AR value.    |
`options.decimals` | *number* | - | - |
`options.formatted` | *boolean* | - | - |
`options.trim` | *boolean* | - | - |

**Returns:** *Promise*<string\>

___

### getBalance

▸ **getBalance**(`target?`: *string*): *Promise*<number\>

Get the target or current wallet token balance

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`target` | *string* | The target wallet address   |

**Returns:** *Promise*<number\>

Current target token balance

___

### getCommunityContract

▸ **getCommunityContract**(): *Promise*<string\>

Get the current Community contract ID

**Returns:** *Promise*<string\>

___

### getContractSourceId

▸ **getContractSourceId**(): *Promise*<string\>

Get the contract source txid used for new PSCs.

**Returns:** *Promise*<string\>

The contract source ID.

___

### getCreateCost

▸ **getCreateCost**(`inAr?`: *boolean*, `options?`: { `decimals`: *number* ; `formatted`: *boolean* ; `trim`: *boolean*  }): *Promise*<string\>

Get the current create cost of a community.

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`inAr` | *boolean* | false | Return in winston or AR   |
`options?` | *object* | - | If return inAr is set to true, these options are used to format the returned AR value.    |
`options.decimals` | *number* | - | - |
`options.formatted` | *boolean* | - | - |
`options.trim` | *boolean* | - | - |

**Returns:** *Promise*<string\>

___

### getFees

▸ **getFees**(): *Promise*<{ `createFee`: *number* ; `txFee`: *number*  }\>

Get the current fee charged for actions on Community.

**Returns:** *Promise*<{ `createFee`: *number* ; `txFee`: *number*  }\>

- The txFee and the createFee, both are numbers.

___

### getMainContractId

▸ **getMainContractId**(): *Promise*<string\>

Get the Main Community contract ID

**Returns:** *Promise*<string\>

The main contract ID.

___

### getRole

▸ **getRole**(`target?`: *string*): *Promise*<string\>

Get the target or current wallet role

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`target` | *string* | The target wallet address   |

**Returns:** *Promise*<string\>

Current target role

___

### getState

▸ **getState**(`cached?`: *boolean*): *Promise*<[*StateInterface*](../interfaces/faces.stateinterface.md)\>

Get the current Community state.

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`cached` | *boolean* | true | Wether to return the cached version or reload   |

**Returns:** *Promise*<[*StateInterface*](../interfaces/faces.stateinterface.md)\>

- The current state and sync afterwards if needed.

___

### getUnlockedBalance

▸ **getUnlockedBalance**(`target?`: *string*): *Promise*<number\>

Get the target or current wallet unlocked token balance

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`target` | *string* | The target wallet address   |

**Returns:** *Promise*<number\>

Current target token balance

___

### getVaultBalance

▸ **getVaultBalance**(`target?`: *string*): *Promise*<number\>

Get the target or current wallet vault balance

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`target` | *string* | The target wallet address   |

**Returns:** *Promise*<number\>

Current target token balance

___

### increaseVault

▸ **increaseVault**(`vaultId`: *number*, `lockLength`: *number*, `tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Increase the lock time (in blocks) of a vault.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`vaultId` | *number* | The vault index position to increase   |
`lockLength` | *number* | Length of the lock, in blocks   |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The transaction ID for this action

___

### lockBalance

▸ **lockBalance**(`qty`: *number*, `lockLength`: *number*, `tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Lock your balances in a vault to earn voting weight.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`qty` | *number* | Positive integer for the quantity to lock   |
`lockLength` | *number* | Length of the lock, in blocks   |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The transaction ID for this action

___

### proposeVote

▸ **proposeVote**(`params`: [*VoteInterface*](../interfaces/faces.voteinterface.md), `tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Create a new vote

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`params` | [*VoteInterface*](../interfaces/faces.voteinterface.md) | VoteInterface without the "function"   |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The transaction ID for this action

___

### selectWeightedHolder

▸ **selectWeightedHolder**(`balances?`: [*BalancesInterface*](../interfaces/faces.balancesinterface.md), `vault?`: [*VaultInterface*](../interfaces/faces.vaultinterface.md)): *Promise*<string\>

Select one of your community holders based on their weighted total balance.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`balances` | [*BalancesInterface*](../interfaces/faces.balancesinterface.md) | State balances, optional.   |
`vault` | [*VaultInterface*](../interfaces/faces.vaultinterface.md) | State vault, optional.    |

**Returns:** *Promise*<string\>

___

### setCommunityTx

▸ **setCommunityTx**(`txId`: *string*): *Promise*<boolean\>

Set the Community interactions to this transaction ID.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`txId` | *string* | Community's Transaction ID   |

**Returns:** *Promise*<boolean\>

boolean - True if successful, false if error.

___

### setContractSourceId

▸ **setContractSourceId**(`id`: *string*): *Promise*<boolean\>

Update the used contract source transaction ID.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *string* | New contract source ID.   |

**Returns:** *Promise*<boolean\>

boolean that validates if the update was done.

___

### setState

▸ **setState**(`name`: *string*, `ticker`: *string*, `balances`: [*BalancesInterface*](../interfaces/faces.balancesinterface.md), `quorum?`: *number*, `support?`: *number*, `voteLength?`: *number*, `lockMinLength?`: *number*, `lockMaxLength?`: *number*, `vault?`: [*VaultInterface*](../interfaces/faces.vaultinterface.md), `votes?`: [*VoteInterface*](../interfaces/faces.voteinterface.md)[], `roles?`: [*RoleInterface*](../interfaces/faces.roleinterface.md), `extraSettings?`: [*string*, *any*][]): *Promise*<[*StateInterface*](../interfaces/faces.stateinterface.md)\>

Set the states for a new Community using the Community contract.

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`name` | *string* | - | The Community name   |
`ticker` | *string* | - | Currency ticker, ex: TICK   |
`balances` | [*BalancesInterface*](../interfaces/faces.balancesinterface.md) | - | an object of wallet addresses and their token balances   |
`quorum` | *number* | 50 | % of votes weight, for a proposal to be valid   |
`support` | *number* | 50 | = % of votes as "yes", for a vote to be valid   |
`voteLength` | *number* | 2000 | For how long (in blocks) should the vote be active   |
`lockMinLength` | *number* | 720 | What is the minimum lock time (in blocks)   |
`lockMaxLength` | *number* | 10000 | What is the maximum lock time (in blocks)   |
`vault` | [*VaultInterface*](../interfaces/faces.vaultinterface.md) | - | Vault object, optional   |
`votes` | [*VoteInterface*](../interfaces/faces.voteinterface.md)[] | - | Votes, optional   |
`roles` | [*RoleInterface*](../interfaces/faces.roleinterface.md) | - | Roles, optional   |
`extraSettings` | [*string*, *any*][] | - | Any custom extra settings can be sent here. @since v1.1.0    |

**Returns:** *Promise*<[*StateInterface*](../interfaces/faces.stateinterface.md)\>

- The created state

___

### setWallet

▸ **setWallet**(`wallet`: JWKInterface): *Promise*<string\>

Set the user wallet data.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`wallet` | JWKInterface | JWK wallet file data   |

**Returns:** *Promise*<string\>

The wallet address

___

### transfer

▸ **transfer**(`target`: *string*, `qty`: *number*, `tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Transfer token balances to another account.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`target` | *string* | Target Wallet Address   |
`qty` | *number* | Amount of the token to send   |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The transaction ID for this action

___

### transferLocked

▸ **transferLocked**(`target`: *string*, `qty`: *number*, `lockLength`: *number*, `tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Transfer tokens to an account's vault.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`target` | *string* | Target Wallet Address   |
`qty` | *number* | Amount of the token to send   |
`lockLength` | *number* | For how many blocks to lock the tokens   |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The transaction ID for this action

___

### unlockVault

▸ **unlockVault**(`tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Unlock all your locked balances that are over the lock period.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The transaction ID for this action

___

### vote

▸ **vote**(`id`: *number*, `cast`: *yay* \| *nay*, `tags?`: [*TagInterface*](../interfaces/faces.taginterface.md)[]): *Promise*<string\>

Cast a vote on an existing, and active, vote proposal.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *number* | The vote ID, this is the index of the vote in votes   |
`cast` | *yay* \| *nay* | Cast your vote with 'yay' (for yes) or 'nay' (for no)   |
`tags` | [*TagInterface*](../interfaces/faces.taginterface.md)[] | optional: tags to be added to this transaction   |

**Returns:** *Promise*<string\>

The transaction ID for this action
