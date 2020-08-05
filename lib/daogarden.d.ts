import Arweave from 'arweave/web';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { BalancesInterface, VaultInterface, VoteInterface, RoleInterface, StateInterface, InputInterface, ResultInterface } from './faces';
export default class DAOGarden {
    private readonly contractSrc;
    private readonly mainContract;
    private readonly txFee;
    private readonly createFee;
    private arweave;
    private wallet;
    private walletAddress;
    private daoContract;
    private state;
    private lastStateCall;
    private cacheRefreshInterval;
    private stateCallInProgress;
    /**
     * Before interacting with DAOGarden you need to have at least Arweave initialized.
     * @param arweave - Arweave instance
     * @param wallet - JWK wallet file data
     * @param cacheRefreshInterval - Refresh interval in milliseconds for the cached state
     */
    constructor(arweave: Arweave, wallet?: JWKInterface, cacheRefreshInterval?: number);
    /**
     * Get the current DAO state.
     * @param cached - Wether to return the cached version or reload
     */
    getState(cached?: boolean): Promise<StateInterface>;
    /**
     * Set the user wallet data.
     * @param wallet - JWK wallet file data
     * @returns The wallet address
     */
    setWallet(wallet: JWKInterface): Promise<string>;
    /**
     * Set the states for a new DAO using the DAOGarden contract.
     * @param name - The DAO name
     * @param ticker - Currency ticker, ex: TICK
     * @param balances - an object of wallet addresses and their token balances
     * @param quorum - % of votes weight, for a proposal to be valid
     * @param support = % of votes as "yes", for a vote to be valid
     * @param voteLength - For how long (in blocks) should the vote be active
     * @param lockMinLength - What is the minimum lock time (in blocks)
     * @param lockMaxLength - What is the maximum lock time (in blocks)
     * @param vault - Vault object, optional
     * @param votes - Votes, optional
     * @param roles - Roles, optional
     */
    setState(name: string, ticker: string, balances: BalancesInterface, quorum?: number, support?: number, voteLength?: number, lockMinLength?: number, lockMaxLength?: number, vault?: VaultInterface, votes?: VoteInterface[], roles?: RoleInterface): Promise<StateInterface>;
    /**
     * Create a new DAO with the current, previously saved using `setState`, state.
     */
    create(): Promise<string>;
    /**
     * Returns the current create cost as a winston string.
     */
    getCreateCost(inAr?: boolean, options?: {
        formatted: boolean;
        decimals: number;
        trim: boolean;
    }): Promise<string>;
    getActionCost(inAr?: boolean, options?: {
        formatted: boolean;
        decimals: number;
        trim: boolean;
    }): Promise<string>;
    /**
     * Set the DAO interactions to this transaction ID.
     * @param txId DAO's Transaction ID
     */
    setDAOTx(txId: string): Promise<void>;
    /**
     * Do a GET call to any function on the contract.
     * @param params - InputInterface
     * @returns ResultInterface
     */
    get(params?: InputInterface): Promise<ResultInterface>;
    /**
     * Get the target or current wallet balance
     * @param target
     * @returns - Current target token balance
     */
    getBalance(target?: string): Promise<number>;
    getUnlockedBalance(target?: string): Promise<number>;
    getVaultBalance(target?: string): Promise<number>;
    getRole(target?: string): Promise<string>;
    /** Setters **/
    /**
     *
     * @param target - Target Wallet Address
     * @param qty - Amount of the token to send
     * @returns The transaction ID for this action
     */
    transfer(target: string, qty: number): Promise<string>;
    /**
     * Lock your balances in a vault to earn voting weight.
     * @param qty - Positive integer for the quantity to lock
     * @param lockLength - Length of the lock, in blocks
     * @returns The transaction ID for this action
     */
    lockBalance(qty: number, lockLength: number): Promise<string>;
    /**
     * Unlock all your locked balances that are over the lock period.
     * @returns The transaction ID for this action
     */
    unlockVault(): Promise<string>;
    /**
     * Increase the lock time (in blocks) of a vault.
     * @param lockLength - Length of the lock, in blocks
     */
    increaseVault(vaultId: number, lockLength: number): Promise<string>;
    /**
     * Create a new vote
     * @param params VoteInterface without the "function"
     */
    proposeVote(params: VoteInterface): Promise<string>;
    /**
     * Cast a vote on an existing, and active, vote proposal.
     * @param id - The vote ID, this is the index of the vote in votes
     * @param cast - Cast your vote with 'yay' (for yes) or 'nay' (for no)
     */
    vote(id: number, cast: 'yay' | 'nay'): Promise<string>;
    /**
     * Finalize a vote, to run the desired vote details if approved, or reject it and close.
     * @param id - The vote ID, this is the index of the vote in votes
     */
    finalize(id: number): Promise<string>;
    /**
     * Charge a fee for each DAOGarden's interactions.
     * @param action - Current action name. Usually the same as the method name.
     * @param fee - Fee to charge
     */
    private chargeFee;
    private setDefaultTags;
    private checkWallet;
    private interact;
}
