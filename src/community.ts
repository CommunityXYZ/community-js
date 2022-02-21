import Arweave from 'arweave';
import nodeFetch from 'node-fetch';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { readContract, interactWriteDryRun, interactWrite, createContractFromTx, interactRead } from 'smartweave';
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

export default class Community {
  private readonly cacheServer: string = 'https://arweave.cloud/';
  private contractSrc: string = 'ngMml4jmlxu0umpiQCsHgPX2pb_Yz6YDB8f7G6j-tpI';
  private readonly mainContract: string = 'mzvUgNc8YFk0w5K5H7c8pyT-FC5Y_ba0r7_8766Kx74';

  private feeBytes: number = 600000;
  private feeWinston: string = '249005088';
  private feeAr: string = '0.000249005088';

  private arweave: Arweave;
  private wallet!: JWKInterface | 'use_wallet';
  private walletAddress!: string;
  private dummyWallet: JWKInterface;

  // Community specific variables
  private communityContract = '';
  private state!: StateInterface;

  /**
   * Before interacting with Community you need to have at least Arweave initialized.
   * @param arweave - Arweave instance
   * @param wallet - JWK wallet file data
   */
  constructor(arweave: Arweave, wallet?: JWKInterface | 'use_wallet') {
    this.arweave = arweave;

    this.wallet = wallet;
    if (wallet && wallet !== 'use_wallet') {
      arweave.wallets
        .jwkToAddress(wallet)
        .then((addy) => (this.walletAddress = addy))
        .catch(console.log);
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
  public async getState(): Promise<StateInterface> {
    if (!this.communityContract.length) {
      throw new Error('No community set. Use setCommunityTx to get your current state.');
    }

    return this.update();
  }

  /**
   * Set the user wallet data.
   * @param wallet - JWK wallet file data
   * @returns The wallet address
   */
  public async setWallet(wallet: JWKInterface | 'use_wallet', address?: string): Promise<string> {
    if ((!wallet || wallet === 'use_wallet') && address) {
      this.walletAddress = address;
      return this.walletAddress;
    } else if (!wallet) {
      return;
    }

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
    const { target, winstonQty } = await this.chargeFee();

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
      this.wallet || 'use_wallet',
      this.contractSrc,
      JSON.stringify(toSubmit),
      tags,
      target,
      winstonQty,
    );
    this.communityContract = communityID;
    return communityID;
  }

  public async getFee(inAr: boolean = false, options?: { formatted: boolean; decimal?: boolean; trim?: boolean }) {
    if (inAr) {
      return this.arweave.ar.winstonToAr(this.feeWinston, options);
    }

    return this.arweave.ar.arToWinston(this.feeAr, options);
  }

  /**
   * Get the current create cost of a community.
   * @param inAr - Return in winston or AR
   * @param options - If return inAr is set to true, these options are used to format the returned AR value.
   * @deprecated use getFee() instead.
   */
  public async getCreateCost(
    inAr = false,
    options?: { formatted: boolean; decimals: number; trim: boolean },
  ): Promise<string> {
    return this.getFee(inAr, options);
  }

  /**
   * Get the current action (post interaction) cost of a community.
   * @param inAr - Return in winston or AR
   * @param options - If return inAr is set to true, these options are used to format the returned AR value.
   * @deprecated use getFee() instead.
   */
  public async getActionCost(
    inAr = false,
    options?: { formatted: boolean; decimals: number; trim: boolean },
  ): Promise<string> {
    return this.getFee(inAr, options);
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
      await this.getState();
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
    if (!target) {
      target = await this.getWalletAddress();
    }
    const res = await this.get({ function: 'balance', target });
    return res.balance;
  }

  /**
   * Get the target or current wallet unlocked token balance
   * @param target The target wallet address
   * @returns Current target token balance
   */
  public async getUnlockedBalance(target: string = this.walletAddress): Promise<number> {
    if (!target) {
      target = await this.getWalletAddress();
    }
    const res = await this.get({ function: 'unlockedBalance', target });
    return res.balance;
  }

  /**
   * Get the target or current wallet vault balance
   * @param target The target wallet address
   * @returns Current target token balance
   */
  public async getVaultBalance(target: string = this.walletAddress): Promise<number> {
    if (!target) {
      target = await this.getWalletAddress();
    }
    const res = await this.get({ function: 'vaultBalance', target });
    return res.balance;
  }

  /**
   * Get the target or current wallet role
   * @param target The target wallet address
   * @returns Current target role
   */
  public async getRole(target: string = this.walletAddress): Promise<string> {
    if (!target) {
      target = await this.getWalletAddress();
    }
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
   * Get the current wallet address.
   * @returns Promise<string> Wallet address
   */
  public async getWalletAddress(): Promise<string> {
    if (!this.wallet || this.wallet === 'use_wallet') {
      this.walletAddress = await window.arweaveWallet.getActiveAddress();
    } else {
      this.walletAddress = await this.arweave.wallets.jwkToAddress(this.wallet);
    }

    return this.walletAddress;
  }

  /**
   * Get the current fee charged for actions on Community.
   * @return {object} - The feeWinston and the feeAr are both strings.
   */
  private async getFees(): Promise<{ feeWinston: string; feeAr: string }> {
    const res = await this.arweave.api.get(`price/${this.feeBytes}`);
    this.feeWinston = res.data;
    this.feeAr = this.arweave.ar.winstonToAr(this.feeWinston);

    return {
      feeWinston: this.feeWinston,
      feeAr: this.feeAr,
    };
  }

  /**
   * Charge a fee for each Community's interactions.
   * @param fee - which fee to charge
   */
  private async chargeFee(): Promise<{ target: string; winstonQty: string }> {
    await this.getWalletAddress();
    const balance = await this.arweave.wallets.getBalance(this.walletAddress);

    if (+balance < +this.feeWinston) {
      throw new Error('Not enough balance.');
    }

    let state: StateInterface;
    try {
      const res = await nodeFetch(`${this.cacheServer}contract/${this.mainContract}`);
      state = (await res.json()) as StateInterface;
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
      winstonQty: this.feeWinston,
    };
  }

  /**
   * Function used to check if the user is already logged in
   */
  private async checkWallet(): Promise<void> {
    if (!this.wallet) {
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
    let state: StateInterface;
    try {
      const res = await nodeFetch(`${this.cacheServer}contract/${this.communityContract}`);
      state = (await res.json()) as StateInterface;
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

    return this.state;
  }

  /**
   * The most important function, it writes to the contract.
   * @param input - InputInterface
   * @param tags - Array of tags as an object with name and value as strings
   * @param fee - Transaction fee
   */
  private async interact(input: InputInterface, tags: { name: string; value: string }[] = []): Promise<string> {
    const { target, winstonQty } = await this.chargeFee();

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

    async function walletSwitch(e: any, _this: Community) {
      _this.walletAddress = await e.detail.address;
    }

    win.removeEventListener('walletSwitch', (e) => walletSwitch(e, this));
    win.addEventListener('walletSwitch', (e) => walletSwitch(e, this));
  }
}
