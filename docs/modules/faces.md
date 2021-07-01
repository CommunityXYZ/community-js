[community-js](../README.md) / faces

# Module: faces

## Table of contents

### Interfaces

- [ActionInterface](../interfaces/faces.actioninterface.md)
- [BalancesInterface](../interfaces/faces.balancesinterface.md)
- [InputInterface](../interfaces/faces.inputinterface.md)
- [ResultInterface](../interfaces/faces.resultinterface.md)
- [RoleInterface](../interfaces/faces.roleinterface.md)
- [StateInterface](../interfaces/faces.stateinterface.md)
- [TagInterface](../interfaces/faces.taginterface.md)
- [VaultInterface](../interfaces/faces.vaultinterface.md)
- [VaultParamsInterface](../interfaces/faces.vaultparamsinterface.md)
- [VoteInterface](../interfaces/faces.voteinterface.md)

### Type aliases

- [GetFunctionType](faces.md#getfunctiontype)
- [SetFunctionType](faces.md#setfunctiontype)
- [VoteStatus](faces.md#votestatus)
- [VoteType](faces.md#votetype)

## Type aliases

### GetFunctionType

Ƭ **GetFunctionType**: ``"balance"`` \| ``"unlockedBalance"`` \| ``"vaultBalance"`` \| ``"role"``

___

### SetFunctionType

Ƭ **SetFunctionType**: ``"transfer"`` \| ``"transferLocked"`` \| ``"vote"`` \| ``"propose"`` \| ``"finalize"`` \| ``"lock"`` \| ``"increaseVault"`` \| ``"unlock"``

___

### VoteStatus

Ƭ **VoteStatus**: ``"active"`` \| ``"quorumFailed"`` \| ``"passed"`` \| ``"failed"``

___

### VoteType

Ƭ **VoteType**: ``"mint"`` \| ``"mintLocked"`` \| ``"burnVault"`` \| ``"indicative"`` \| ``"set"``
