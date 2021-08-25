[community-js](../README.md) / faces

# Module: faces

## Table of contents

### Interfaces

- [ActionInterface](../interfaces/faces.ActionInterface.md)
- [BalancesInterface](../interfaces/faces.BalancesInterface.md)
- [InputInterface](../interfaces/faces.InputInterface.md)
- [ResultInterface](../interfaces/faces.ResultInterface.md)
- [RoleInterface](../interfaces/faces.RoleInterface.md)
- [StateInterface](../interfaces/faces.StateInterface.md)
- [TagInterface](../interfaces/faces.TagInterface.md)
- [VaultInterface](../interfaces/faces.VaultInterface.md)
- [VaultParamsInterface](../interfaces/faces.VaultParamsInterface.md)
- [VoteInterface](../interfaces/faces.VoteInterface.md)

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
