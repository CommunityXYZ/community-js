import Arweave from 'arweave';
import axios from 'axios';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { readContract, interactWriteDryRun, interactWrite, createContractFromTx, interactRead } from 'smartweave';
import ArDB from 'ardb';
import {
  BalancesInterface,
  VaultInterface,
  VoteInterface,
  RoleInterface,
  StateInterface,
  InputInterface,
  ResultInterface,
  TagInterface,
} from './faces';
import Utils from './utils';
import ArdbTransaction from 'ardb/lib/models/transaction';

export default class Community {
  private readonly cacheServer: string = 'https://cache.community.xyz/';
  private contractSrc: string = 'ngMml4jmlxu0umpiQCsHgPX2pb_Yz6YDB8f7G6j-tpI';
  private readonly mainContract: string = 'mzvUgNc8YFk0w5K5H7c8pyT-FC5Y_ba0r7_8766Kx74';
  private readonly txFeeUsd: number = 0.5;
  private readonly createFeeUsd: number = 3;

  private createFee: number = 0.83;
  private txFee: number = 0.21;

  private arweave: Arweave;
  private wallet!: JWKInterface;
  private walletAddress!: string;
  private dummyWallet: JWKInterface;
  private isWalletConnect: boolean = false;

  // Community specific variables
  private communityContract = '';
  private state!: StateInterface;
  private cacheTTL: number = 1000 * 60 * 2; // 2 minutes
  private stateCallInProgress: boolean = false;
  private stateUpdatedAt: number = 0;

  private readonly warnAfter: number = 60 * 60 * 24 * 1000; // 24 hours
  private feesUpdatedAt: number = 0;
  private feesCallInProgress: boolean = false;
  private ardb: ArDB;

  /**
   * Before interacting with Community you need to have at least Arweave initialized.
   * @param arweave - Arweave instance
   * @param wallet - JWK wallet file data
   * @param cacheTTL - Refresh interval in milliseconds for the cached state
   */
  constructor(arweave: Arweave, wallet?: JWKInterface, cacheTTL = 1000 * 60 * 2) {
    this.arweave = arweave;
    this.ardb = new ArDB(arweave, 2);

    if (wallet) {
      this.wallet = wallet;
      arweave.wallets
        .jwkToAddress(wallet)
        .then((addy) => (this.walletAddress = addy))
        .catch(console.log);
    }

    if (cacheTTL) {
      this.cacheTTL = cacheTTL;
    }

    this.getFees();
    this.events();
  }

  /**
   * Get the Main Community contract ID
   * @returns {Promise<string>} The main contract ID.
   */
  public async getMainContractId(): Promise<string> {
    return this.mainContract;
  }

  /**
   * Get the contract source txid used for new PSCs.
   * @returns {Promise<string>} The contract source ID.
   */
  public async getContractSourceId(): Promise<string> {
    return this.contractSrc;
  }

  /**
   * Get the current Community contract ID
   */
  public async getCommunityContract(): Promise<string> {
    return this.communityContract;
  }

  /**
   * Get the current Community state.
   * @param cached - Wether to return the cached version or reload
   * @returns - The current state and sync afterwards if needed.
   */
  public async getState(cached = true): Promise<StateInterface> {
    if (!this.communityContract.length) {
      throw new Error('No community set. Use setCommunityTx to get your current state.');
    }

    // Check if cacheTTL has expired. If yes, return this.update() if not, return the previously saved state.
    if (cached && this.state && this.stateUpdatedAt && this.stateUpdatedAt + this.cacheTTL > Date.now()) {
      return this.state;
    } else {
      return this.update();
    }
  }

  /**
   * Set the user wallet data.
   * @param wallet - JWK wallet file data
   * @returns The wallet address
   */
  public async setWallet(wallet: JWKInterface): Promise<string> {
    this.wallet = wallet;
    this.walletAddress = await this.arweave.wallets.jwkToAddress(this.wallet);

    return this.walletAddress;
  }

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
  public async setState(
    name: string,
    ticker: string,
    balances: BalancesInterface,
    quorum: number = 50,
    support: number = 50,
    voteLength: number = 2000,
    lockMinLength: number = 720,
    lockMaxLength: number = 10000,
    vault: VaultInterface = {},
    votes: VoteInterface[] = [],
    roles: RoleInterface = {},
    extraSettings: [string, any][] = [],
  ): Promise<StateInterface> {
    // Make sure the wallet exists.
    await this.checkWallet();

    // Make sure data isn't null
    if (!name) {
      name = '';
    }
    if (!ticker) {
      ticker = '';
    }
    if (!balances) {
      balances = {};
    }
    if (!quorum) {
      quorum = 0;
    }
    if (!support) {
      support = 0;
    }
    if (!voteLength) {
      voteLength = 0;
    }
    if (!lockMinLength) {
      lockMinLength = 0;
    }
    if (!lockMaxLength) {
      lockMaxLength = 0;
    }
    if (!vault) {
      vault = {};
    }
    if (!votes) {
      votes = [];
    }
    if (!roles) {
      roles = {};
    }
    if (!extraSettings) {
      extraSettings = [];
    }

    // Clean data
    name = name.trim();
    ticker = ticker.trim();
    balances = Utils.trimObj(balances);
    quorum = +quorum;
    support = +support;
    voteLength = +voteLength;
    lockMinLength = +lockMinLength;
    lockMaxLength = +lockMaxLength;
    vault = Utils.trimObj(vault);
    votes = Utils.trimObj(votes);
    roles = Utils.trimObj(roles);

    // Validations
    if (name.length < 3) {
      throw new Error('Community Name must be at least 3 characters.');
    }
    if (ticker.length < 3) {
      throw new Error('Ticker must be at least 3 characters.');
    }
    if (!Object.keys(balances).length) {
      throw new Error('At least one account need to be specified.');
    }
    for (const bal in balances) {
      if (isNaN(balances[bal]) || !Number.isInteger(balances[bal]) || balances[bal] < 0) {
        throw new Error('Address balances must be a positive integer.');
      }
    }
    if (isNaN(quorum) || quorum < 1 || quorum > 99 || !Number.isInteger(quorum)) {
      throw new Error('Quorum must be an integer between 1-99.');
    }
    quorum = quorum / 100;
    if (isNaN(support) || support < 1 || support > 99 || !Number.isInteger(support)) {
      throw new Error('Support must be an integer between 1-99.');
    }
    support = support / 100;
    if (isNaN(voteLength) || !Number.isInteger(voteLength) || voteLength < 1) {
      throw new Error('Vote Length must be a positive integer.');
    }
    if (isNaN(lockMinLength) || lockMinLength < 1 || !Number.isInteger(lockMinLength)) {
      throw new Error('Lock Min Length must be a positive integer.');
    }
    if (isNaN(lockMaxLength) || lockMaxLength < lockMinLength || !Number.isInteger(lockMaxLength)) {
      throw new Error('Lock Max Length must be a positive integer, greater than lockMinLength.');
    }
    if (Object.keys(vault).length) {
      for (const key of Object.keys(vault)) {
        for (const k in vault[key]) {
          if (isNaN(vault[key][k].balance) || !Number.isInteger(vault[key][k].balance) || vault[key][k].balance < 0) {
            throw new Error('Vault balance must be a positive integer.');
          }
        }
      }
    }

    const settings: [string, any][] = [
      ['quorum', quorum],
      ['support', support],
      ['voteLength', voteLength],
      ['lockMinLength', lockMinLength],
      ['lockMaxLength', lockMaxLength],
    ];

    for (let i = 0, j = extraSettings.length; i < j; i++) {
      const s = extraSettings[i];
      if (typeof s[0] === 'string' && typeof s[1] !== 'undefined') {
        settings.push(s);
      }
    }

    // Set the state
    this.state = {
      name,
      ticker,
      balances,
      vault,
      votes,
      roles,
      settings: new Map(settings),
    };

    return this.state;
  }

  /**
   * Update the used contract source transaction ID.
   * @param id New contract source ID.
   * @returns boolean that validates if the update was done.
   */
  public async setContractSourceId(id: string): Promise<boolean> {
    if (!Utils.isTxId(id)) {
      return false;
    }
    this.contractSrc = id;
    return true;
  }

  /**
   * Create a new Community with the current, previously saved (with `setState`) state.
   * @param tags - optional: tags to be added to this transaction
   * @returns The created community transaction ID.
   */
  public async create(tags: TagInterface[] = []): Promise<string> {
    // Create the new Community.
    const { target, winstonQty } = await this.chargeFee(this.createFee);

    const toSubmit: any = this.state;
    toSubmit.settings = Array.from(this.state.settings);

    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'CreateCommunity' },
        { name: 'Message', value: `Created Community ${this.state.name}, ticker: ${this.state.ticker}.` },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];

    const communityID = await createContractFromTx(
      this.arweave,
      this.wallet,
      this.contractSrc,
      JSON.stringify(toSubmit),
      tags,
      target,
      winstonQty,
    );
    this.communityContract = communityID;
    return communityID;
  }

  /**
   * Get the current create cost of a community.
   * @param inAr - Return in winston or AR
   * @param options - If return inAr is set to true, these options are used to format the returned AR value.
   */
  public async getCreateCost(
    inAr = false,
    options?: { formatted: boolean; decimals: number; trim: boolean },
  ): Promise<string> {
    if (!this.feesUpdatedAt) {
      await new Promise((resolve) => setTimeout(() => resolve(true), 100));
      return this.getCreateCost(inAr, options);
    }

    const fee = this.createFee.toString();
    if (inAr) {
      return fee;
    }

    return this.arweave.ar.arToWinston(fee);
  }

  /**
   * Get the current action (post interaction) cost of a community.
   * @param inAr - Return in winston or AR
   * @param options - If return inAr is set to true, these options are used to format the returned AR value.
   */
  public async getActionCost(
    inAr = false,
    options?: { formatted: boolean; decimals: number; trim: boolean },
  ): Promise<string> {
    if (!this.feesUpdatedAt) {
      await new Promise((resolve) => setTimeout(() => resolve(true), 100));
      return this.getActionCost(inAr, options);
    }

    const fee = this.txFee.toString();
    if (inAr) {
      return fee;
    }

    return this.arweave.ar.arToWinston(fee);
  }

  /**
   * Set the Community interactions to this transaction ID.
   * @param txId Community's Transaction ID
   * @returns boolean - True if successful, false if error.
   */
  public async setCommunityTx(txId: string): Promise<boolean> {
    // reset state
    this.state = null;
    this.communityContract = txId;

    try {
      await this.getState(false);
    } catch (e) {
      this.state = null;
      this.communityContract = null;
      console.log(e);
      return false;
    }

    return true;
  }

  /**
   * Do a GET call to any function on the contract.
   * @param params - InputInterface
   * @returns ResultInterface
   */
  public async get(params: InputInterface = { function: 'balance' }): Promise<ResultInterface> {
    if (!this.wallet && !this.dummyWallet) {
      this.dummyWallet = await this.arweave.wallets.generate();
    }

    return interactRead(this.arweave, this.wallet || this.dummyWallet, this.communityContract, params);
  }

  /**
   * Get the target or current wallet token balance
   * @param target The target wallet address
   * @returns Current target token balance
   */
  public async getBalance(target: string = this.walletAddress): Promise<number> {
    const res = await this.get({ function: 'balance', target });
    return res.balance;
  }

  /**
   * Get the target or current wallet unlocked token balance
   * @param target The target wallet address
   * @returns Current target token balance
   */
  public async getUnlockedBalance(target: string = this.walletAddress): Promise<number> {
    const res = await this.get({ function: 'unlockedBalance', target });
    return res.balance;
  }

  /**
   * Get the target or current wallet vault balance
   * @param target The target wallet address
   * @returns Current target token balance
   */
  public async getVaultBalance(target: string = this.walletAddress): Promise<number> {
    const res = await this.get({ function: 'vaultBalance', target });
    return res.balance;
  }

  /**
   * Get the target or current wallet role
   * @param target The target wallet address
   * @returns Current target role
   */
  public async getRole(target: string = this.walletAddress): Promise<string> {
    const res = await this.get({ function: 'role', target });
    return res.role;
  }

  /**
   * Select one of your community holders based on their weighted total balance.
   * @param balances  - State balances, optional.
   * @param vault - State vault, optional.
   */
  public async selectWeightedHolder(
    balances: BalancesInterface = this.state.balances,
    vault: VaultInterface = this.state.vault,
  ) {
    if (!this.state) {
      throw new Error('Need to initilate the state and worker.');
    }

    let totalTokens = 0;
    for (const addy of Object.keys(balances)) {
      totalTokens += balances[addy];
    }
    for (const addy of Object.keys(vault)) {
      if (!vault[addy].length) continue;
      const vaultBalance = vault[addy].map((a) => a.balance).reduce((a, b) => a + b, 0);
      totalTokens += vaultBalance;
      if (addy in balances) {
        balances[addy] += vaultBalance;
      } else {
        balances[addy] = vaultBalance;
      }
    }

    const weighted: BalancesInterface = {};
    for (const addy of Object.keys(balances)) {
      weighted[addy] = balances[addy] / totalTokens;
    }

    let sum = 0;
    const r = Math.random();
    for (const addy of Object.keys(weighted)) {
      sum += weighted[addy];
      if (r <= sum && weighted[addy] > 0) {
        return addy;
      }
    }

    return null;
  }

  /**
   * Get the current fee charged for actions on Community.
   * @return {object} - The txFee and the createFee, both are numbers.
   */
  public async getFees(): Promise<{ txFee: number; createFee: number }> {
    if (this.feesCallInProgress) {
      return new Promise((resolve) => setTimeout(() => resolve(this.getFees()), 100));
    }
    this.feesCallInProgress = true;

    // Check if cacheTTL has expired. If yes, return the cached fees.
    if (this.feesUpdatedAt && this.feesUpdatedAt + this.cacheTTL > Date.now()) {
      return {
        createFee: this.createFee,
        txFee: this.txFee,
      };
    }

    try {
      const res = (await this.ardb
        .search('transactions')
        .tags([
          { name: 'app', values: 'Redstone' },
          { name: 'type', values: 'data' },
        ])
        .findOne()) as ArdbTransaction;

      let createdAt: number;
      let arPrice: number;

      for (const tag of res.tags) {
        if (tag.name === 'timestamp') {
          createdAt = +tag.value;
        } else if (tag.name === 'AR') {
          arPrice = +tag.value;
        }

        if (createdAt && arPrice) {
          break;
        }
      }

      if (createdAt && arPrice) {
        const deployTime = new Date().getTime() - createdAt;
        if (deployTime > this.warnAfter) {
          console.warn("Price hasn't been updated over a day ago!");
        }

        this.createFee = +(this.createFeeUsd / arPrice).toFixed(5);
        this.txFee = +(this.txFeeUsd / arPrice).toFixed(5);
      }
    } catch {}

    this.feesUpdatedAt = Date.now();
    this.feesCallInProgress = false;

    return {
      createFee: this.createFee,
      txFee: this.txFee,
    };
  }

  // Setters

  /**
   * Transfer token balances to another account.
   * @param target - Target Wallet Address
   * @param qty - Amount of the token to send
   * @param tags - optional: tags to be added to this transaction
   * @returns The transaction ID for this action
   */
  public async transfer(target: string, qty: number, tags: TagInterface[] = []): Promise<string> {
    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'transfer' },
        { name: 'Message', value: `Transfer to ${target} of ${Utils.formatNumber(qty)}.` },
        { name: 'Community-ID', value: this.communityContract },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];

    return this.interact({ function: 'transfer', target, qty }, tags);
  }

  /**
   * Transfer tokens to an account's vault.
   * @param target - Target Wallet Address
   * @param qty - Amount of the token to send
   * @param lockLength - For how many blocks to lock the tokens
   * @param tags - optional: tags to be added to this transaction
   * @returns The transaction ID for this action
   */
  public async transferLocked(
    target: string,
    qty: number,
    lockLength: number,
    tags: TagInterface[] = [],
  ): Promise<string> {
    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'transferLocked' },
        {
          name: 'Message',
          value: `Transfer locked to ${target} of ${Utils.formatNumber(qty)} for ${Utils.formatNumber(
            lockLength,
          )} blocks.`,
        },
        { name: 'Community-ID', value: this.communityContract },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];

    return this.interact({ function: 'transferLocked', target, qty, lockLength }, tags);
  }

  /**
   * Lock your balances in a vault to earn voting weight.
   * @param qty - Positive integer for the quantity to lock
   * @param lockLength - Length of the lock, in blocks
   * @param tags - optional: tags to be added to this transaction
   * @returns The transaction ID for this action
   */
  public async lockBalance(qty: number, lockLength: number, tags: TagInterface[] = []): Promise<string> {
    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'lock' },
        {
          name: 'Message',
          value: `Locked ${Utils.formatNumber(qty)} for ${Utils.formatNumber(lockLength)} blocks (${Utils.formatBlocks(
            lockLength,
          )}).`,
        },
        { name: 'Community-ID', value: this.communityContract },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];

    return this.interact({ function: 'lock', qty, lockLength }, tags);
  }

  /**
   * Unlock all your locked balances that are over the lock period.
   * @param tags - optional: tags to be added to this transaction
   * @returns The transaction ID for this action
   */
  public async unlockVault(tags: TagInterface[] = []): Promise<string> {
    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'unlock' },
        { name: 'Message', value: `Unlocked vaults.` },
        { name: 'Community-ID', value: this.communityContract },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];
    return this.interact({ function: 'unlock' }, tags);
  }

  /**
   * Increase the lock time (in blocks) of a vault.
   * @param vaultId - The vault index position to increase
   * @param lockLength - Length of the lock, in blocks
   * @param tags - optional: tags to be added to this transaction
   * @returns The transaction ID for this action
   */
  public async increaseVault(vaultId: number, lockLength: number, tags: TagInterface[] = []): Promise<string> {
    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'increase' },
        {
          name: 'Message',
          value: `Increased vault ID ${vaultId} for ${lockLength} blocks (${Utils.formatBlocks(lockLength)}).`,
        },
        { name: 'Community-ID', value: this.communityContract },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];
    return this.interact({ function: 'increaseVault', id: vaultId, lockLength }, tags);
  }

  /**
   * Create a new vote
   * @param params VoteInterface without the "function"
   * @param tags - optional: tags to be added to this transaction
   * @returns The transaction ID for this action
   */
  public async proposeVote(params: VoteInterface, tags: TagInterface[] = []): Promise<string> {
    const pCopy: VoteInterface = JSON.parse(JSON.stringify(params));
    console.log(pCopy);

    if (pCopy.type === 'set') {
      if (
        pCopy.key === 'quorum' ||
        pCopy.key === 'support' ||
        pCopy.key === 'lockMinLength' ||
        pCopy.key === 'lockMaxLength'
      ) {
        pCopy.value = +pCopy.value;
      }

      if (pCopy.key === 'quorum' || pCopy.key === 'support') {
        if (pCopy.value > 0 && pCopy.value < 100) {
          pCopy.value = pCopy.value / 100;
        } else if (pCopy.value <= 0 || pCopy.value >= 100) {
          throw new Error('Invalid value.');
        }
      }

      if (
        pCopy.key === 'lockMinLength' &&
        (pCopy.value < 1 || pCopy.value > this.state.settings.get('lockMaxLength'))
      ) {
        throw new Error('Invalid minimum lock length.');
      }
      if (
        pCopy.key === 'lockMaxLength' &&
        (pCopy.value < 1 || pCopy.value < this.state.settings.get('lockMinLength'))
      ) {
        throw new Error('Invalid maximum lock length.');
      }
    }

    const input: InputInterface = { ...pCopy, function: 'propose' };

    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'propose' },
        {
          name: 'Message',
          value: `Proposed ${pCopy.type === 'indicative' || pCopy.key === 'other' ? 'an' : 'a'} ${
            pCopy.key || pCopy.type
          } vote, value: ${pCopy.value}.`,
        },
        { name: 'Community-ID', value: this.communityContract },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];
    return this.interact(input, tags);
  }

  /**
   * Cast a vote on an existing, and active, vote proposal.
   * @param id - The vote ID, this is the index of the vote in votes
   * @param cast - Cast your vote with 'yay' (for yes) or 'nay' (for no)
   * @param tags - optional: tags to be added to this transaction
   * @returns The transaction ID for this action
   */
  public async vote(id: number, cast: 'yay' | 'nay', tags: TagInterface[] = []): Promise<string> {
    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'vote' },
        { name: 'Message', value: `Voted on vote ID ${id}: ${cast}.` },
        { name: 'Community-ID', value: this.communityContract },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];
    return this.interact({ function: 'vote', id, cast }, tags);
  }

  /**
   * Finalize a vote, to run the desired vote details if approved, or reject it and close.
   * @param id - The vote ID, this is the index of the vote in votes
   * @param tags - optional: tags to be added to this transaction
   * @returns The transaction ID for this action
   */
  public async finalize(id: number, tags: TagInterface[] = []): Promise<string> {
    tags = [
      ...(await this.cleanTags(tags)),
      ...[
        { name: 'Action', value: 'finalize' },
        { name: 'Message', value: `Finalize completed votes.` },
        { name: 'Community-ID', value: this.communityContract },
        { name: 'Service', value: 'CommunityXYZ' },
      ],
    ];
    return this.interact({ function: 'finalize', id }, tags);
  }

  /**
   * Charge a fee for each Community's interactions.
   * @param fee - which fee to charge
   */
  private async chargeFee(fee: number = this.txFee): Promise<{ target: string; winstonQty: string }> {
    const balance = await this.arweave.wallets.getBalance(this.walletAddress);

    if (+balance < +fee) {
      throw new Error('Not enough balance.');
    }

    let state: StateInterface;
    try {
      state = (await axios(`${this.cacheServer}contract/${this.mainContract}`)).data;
    } catch (e) {
      try {
        state = await readContract(this.arweave, this.mainContract);
      } catch (e) {
        console.log(e);
        return {
          target: '',
          winstonQty: '0',
        };
      }
    }

    const target = await this.selectWeightedHolder(state.balances, state.vault);
    if (target === this.walletAddress) {
      return {
        target: '',
        winstonQty: '0',
      };
    }

    return {
      target,
      winstonQty: this.arweave.ar.arToWinston(fee.toString()),
    };
  }

  /**
   * Function used to check if the user is already logged in
   */
  private async checkWallet(): Promise<void> {
    if (!this.wallet && !this.isWalletConnect) {
      throw new Error(
        'You first need to set the user wallet, you can do this while on new Community(..., wallet) or using setWallet(wallet).',
      );
    }
  }

  /**
   * Stringify and remove tags that are defined by CommunityJS
   * @returns An array of the TagInterface object `{name: string, value: string}`
   */
  private async cleanTags(tags: TagInterface[]): Promise<TagInterface[]> {
    if (!tags || !tags.length) {
      return [];
    }

    const blacklist: string[] = ['action', 'message', 'community-id', 'service', 'type'];
    const res: TagInterface[] = [];

    for (const tag of tags) {
      if (!tag.name || !tag.value) continue;

      if (!blacklist.includes(tag.name.toLowerCase())) {
        res.push({
          name: tag.name.toString(),
          value: tag.value.toString(),
        });
      }
    }

    return res;
  }

  /**
   * Updates the current state used for a Community instance
   * @param recall Auto recall this function each cacheRefreshInterval ms
   */
  private async update(): Promise<StateInterface> {
    if (this.stateCallInProgress) {
      const getLastState = async (): Promise<StateInterface> => {
        if (this.stateCallInProgress) {
          return new Promise((resolve) => setTimeout(() => resolve(getLastState()), 1000));
        }

        return this.state;
      };
      return getLastState();
    }

    this.stateCallInProgress = true;

    let state: StateInterface;
    try {
      state = (await axios(`${this.cacheServer}contract/${this.communityContract}`)).data;
    } catch (e) {
      try {
        state = await readContract(this.arweave, this.communityContract);
      } catch (e) {
        console.log(e);
        return;
      }
    }

    state.settings = new Map(state.settings);
    this.state = state;
    this.stateUpdatedAt = Date.now();

    this.stateCallInProgress = false;
    return this.state;
  }

  /**
   * The most important function, it writes to the contract.
   * @param input - InputInterface
   * @param tags - Array of tags as an object with name and value as strings
   * @param fee - Transaction fee
   */
  private async interact(
    input: InputInterface,
    tags: { name: string; value: string }[],
    fee: number = this.txFee,
  ): Promise<string> {
    const { target, winstonQty } = await this.chargeFee(fee);

    tags.push({ name: 'Type', value: 'ArweaveActivity' });

    const res = await interactWriteDryRun(
      this.arweave,
      this.wallet || 'use_wallet',
      this.communityContract,
      input,
      tags,
      target,
      winstonQty,
    );
    if (res.type === 'error') {
      //  || res.type === 'exception'
      throw new Error(res.result);
    }

    return interactWrite(
      this.arweave,
      this.wallet || 'use_wallet',
      this.communityContract,
      input,
      tags,
      target,
      winstonQty,
    );
  }

  /**
   * Create events to handle the wallet connect feature
   */
  private events() {
    const win: any =
      typeof window !== 'undefined'
        ? window
        : {
            removeEventListener: (evName: string) => {},
            addEventListener: (evName: string, callback: (e: any) => {}) => {},
          };

    async function walletConnect() {
      this.walletAddress = await this.arweave.wallets.getAddress();
      this.isWalletConnect = true;
    }
    async function walletSwitch(e: any) {
      this.walletAddress = await e.detail.address;
      this.isWalletConnect = true;
    }

    win.removeEventListener('arweaveWalletLoaded', () => walletConnect());
    win.removeEventListener('walletSwitch', (e) => walletSwitch(e));
    win.addEventListener('arweaveWalletLoaded', () => walletConnect());
    win.addEventListener('walletSwitch', (e) => walletSwitch(e));
  }
}
