import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { BalancesInterface, VaultInterface, VoteInterface, RoleInterface, StateInterface, InputInterface, ResultInterface } from './faces';
export default class Community {
    private readonly contractSrc;
    private readonly mainContract;
    private readonly txFee;
    private readonly createFee;
    private arweave;
    private wallet;
    private walletAddress;
    private dummyWallet;
    private communityContract;
    private state;
    private firstCall;
    private cacheRefreshInterval;
    private stateCallInProgress;
    /**
     * Before interacting with Community you need to have at least Arweave initialized.
     * @param arweave - Arweave instance
     * @param wallet - JWK wallet file data
     * @param cacheRefreshInterval - Refresh interval in milliseconds for the cached state
     */
    constructor(arweave: Arweave, wallet?: JWKInterface, cacheRefreshInterval?: number);
    /**
     * Get the Community contract ID
     * @returns {Promise<string>} The main contract ID.
     */
    getMainContractId(): Promise<string>;
    /**
     * Get the current Community state.
     * @param cached - Wether to return the cached version or reload
     * @returns - The current state and sync afterwards if needed.
     */
    getState(cached?: boolean): Promise<StateInterface>;
    /**
     * Set the user wallet data.
     * @param wallet - JWK wallet file data
     * @returns The wallet address
     */
    setWallet(wallet: JWKInterface): Promise<string>;
    /**
     * Set the states for a new Community using the Community contract.
     * @param name - The Community name
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
     * @param extraSettings - Any custom extra settings can be sent here. @since v1.1.0
     *
     * @returns - The created state
     */
    setState(name: string, ticker: string, balances: BalancesInterface, quorum?: number, support?: number, voteLength?: number, lockMinLength?: number, lockMaxLength?: number, vault?: VaultInterface, votes?: VoteInterface[], roles?: RoleInterface, extraSettings?: [string, any][]): Promise<StateInterface>;
    /**
     * Create a new Community with the current, previously saved (with `setState`) state.
     * @returns The created community transaction ID.
     */
    create(): Promise<string>;
    /**
     * Get the current create cost of a community.
     * @param inAr - Return in winston or AR
     * @param options - If return inAr is set to true, these options are used to format the returned AR value.
     */
    getCreateCost(inAr?: boolean, options?: {
        formatted: boolean;
        decimals: number;
        trim: boolean;
    }): Promise<string>;
    /**
     * Get the current action (post interaction) cost of a community.
     * @param inAr - Return in winston or AR
     * @param options - If return inAr is set to true, these options are used to format the returned AR value.
     */
    getActionCost(inAr?: boolean, options?: {
        formatted: boolean;
        decimals: number;
        trim: boolean;
    }): Promise<string>;
    /**
     * Set the Community interactions to this transaction ID.
     * @param txId Community's Transaction ID
     * @returns boolean - True if successful, false if error.
     */
    setCommunityTx(txId: string): Promise<boolean>;
    /**
     * Do a GET call to any function on the contract.
     * @param params - InputInterface
     * @returns ResultInterface
     */
    get(params?: InputInterface): Promise<ResultInterface>;
    /**
     * Get the target or current wallet token balance
     * @param target The target wallet address
     * @returns Current target token balance
     */
    getBalance(target?: string): Promise<number>;
    /**
     * Get the target or current wallet unlocked token balance
     * @param target The target wallet address
     * @returns Current target token balance
     */
    getUnlockedBalance(target?: string): Promise<number>;
    /**
     * Get the target or current wallet vault balance
     * @param target The target wallet address
     * @returns Current target token balance
     */
    getVaultBalance(target?: string): Promise<number>;
    /**
     * Get the target or current wallet role
     * @param target The target wallet address
     * @returns Current target role
     */
    getRole(target?: string): Promise<string>;
    /**
     * Select one of your community holders based on their weighted total balance.
     * @param balances  - State balances, optional.
     * @param vault - State vault, optional.
     */
    selectWeightedHolder(balances?: BalancesInterface, vault?: VaultInterface): Promise<string>;
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
     * @param vaultId - The vault index position to increase
     * @param lockLength - Length of the lock, in blocks
     * @returns The transaction ID for this action
     */
    increaseVault(vaultId: number, lockLength: number): Promise<string>;
    /**
     * Create a new vote
     * @param params VoteInterface without the "function"
     * @returns The transaction ID for this action
     */
    proposeVote(params: VoteInterface): Promise<string>;
    /**
     * Cast a vote on an existing, and active, vote proposal.
     * @param id - The vote ID, this is the index of the vote in votes
     * @param cast - Cast your vote with 'yay' (for yes) or 'nay' (for no)
     * @returns The transaction ID for this action
     */
    vote(id: number, cast: 'yay' | 'nay'): Promise<string>;
    /**
     * Finalize a vote, to run the desired vote details if approved, or reject it and close.
     * @param id - The vote ID, this is the index of the vote in votes
     * @returns The transaction ID for this action
     */
    finalize(id: number): Promise<string>;
    /**
     * Charge a fee for each Community's interactions.
     * @param action - Current action name. Usually the same as the method name
     * @param bytes - Bytes to get it's price to charge
     */
    private chargeFee;
    /**
     * Set default tags to each transaction sent from CommunityJS.
     * @param tx - Transaction to set the defaults.
     */
    private setDefaultTags;
    /**
     * Function used to check if the user is already logged in
     */
    private checkWallet;
    private update;
    /**
     * The most important function, it writes to the contract.
     * @param input - InputInterface
     */
    private interact;
}
