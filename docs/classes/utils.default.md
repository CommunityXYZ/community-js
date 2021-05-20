[community-js](../README.md) / [utils](../modules/utils.md) / default

# Class: default

[utils](../modules/utils.md).default

## Table of contents

### Constructors

- [constructor](utils.default.md#constructor)

### Methods

- [formatBlocks](utils.default.md#formatblocks)
- [formatNumber](utils.default.md#formatnumber)
- [isTxId](utils.default.md#istxid)
- [trimObj](utils.default.md#trimobj)

## Constructors

### constructor

\+ **new default**(): [*default*](utils.default.md)

**Returns:** [*default*](utils.default.md)

## Methods

### formatBlocks

▸ `Static`**formatBlocks**(`len?`: *number*): *string*

Formats a block number into human readable hours, days, months, years.

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`len` | *number* | 720 | block length    |

**Returns:** *string*

___

### formatNumber

▸ `Static`**formatNumber**(`amount`: *number*, `decimalCount?`: *number*, `decimal?`: *string*, `thousands?`: *string*): *string*

Formats the currency

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`amount` | *number* | - | balance to be formatted   |
`decimalCount` | *number* | 0 | how many decimals to add   |
`decimal` | *string* | '.' | string to separate decimals   |
`thousands` | *string* | ',' | string to separate thousands    |

**Returns:** *string*

___

### isTxId

▸ `Static`**isTxId**(`id`: *string*): *boolean*

Checks if a string is a valid Arweave transaction ID.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *string* | Transaction id.   |

**Returns:** *boolean*

___

### trimObj

▸ `Static`**trimObj**(`obj`: *any*): *any*

Trims object keys and values.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`obj` | *any* | Object to trim key/values    |

**Returns:** *any*
