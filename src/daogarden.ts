import Arweave from 'arweave/web';
import { interactWrite, createContractFromTx, selectWeightedPstHolder, readContract, interactWriteDryRun, interactRead } from 'smartweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import Transaction from 'arweave/web/lib/transaction';
import { BalancesInterface, VaultInterface, VoteInterface, RoleInterface, StateInterface, InputInterface, GetFunctionType, ResultInterface, VoteType } from './faces';
import Utils from './utils';

export default class DAOGarden {
  private readonly srcTxId: string = '3JnnzXKiWctcu4_5OJoUZ21fn21MTqbESwX6cixhpb4';
  private readonly mainContract: string = 'BAfcKVhykkup_onxxgzj3T0fMhp33bY82OK23Rruy-Q';
  private readonly txFee: number = 400000000;
  private readonly createFee: number = 9500000000;

  private arweave: Arweave;
  private wallet!: JWKInterface;
  private walletAddress!: string;

  // DAO specific variables
  private daoContract = '';
  private state!: StateInterface;
  private lastStateCall: number = 0;
  private cacheRefreshInterval: number = 1000 * 60 * 2; // 2 minutes

  /**
   * Before interacting with DAOGarden you need to have at least Arweave initialized.
   * @param arweave - Arweave instance
   * @param wallet - JWK wallet file data
   * @param cacheRefreshInterval - Refresh interval in milliseconds for the cached state
   */
  constructor(arweave: Arweave, wallet?: JWKInterface, cacheRefreshInterval = (1000 * 60 * 2)) {
    this.arweave = arweave;

    if (wallet) {
      this.wallet = wallet;
      arweave.wallets.jwkToAddress(wallet).then(addy => this.walletAddress = addy).catch(console.error);
    }

    if(cacheRefreshInterval) {
      this.cacheRefreshInterval = cacheRefreshInterval;
    }
  }

  /**
   * Get the current DAO state.
   * @param cached - Wether to return the cached version or reload
   */
  public async getState(cached = true): Promise<StateInterface> {
    if(!cached || ((new Date()).getTime() - this.lastStateCall) > this.cacheRefreshInterval) {
      // @ts-ignore
      this.state = await readContract(this.arweave, this.daoContract);
      this.lastStateCall = (new Date()).getTime();
    }

    return this.state;
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
  public async setState(name: string, ticker: string, balances: BalancesInterface, quorum: number = 50, support: number = 50, voteLength: number = 2000, lockMinLength: number = 720, lockMaxLength: number = 10000, vault: VaultInterface = {}, votes: VoteInterface[] = [], roles: RoleInterface = {}): Promise<StateInterface> {
    // Make sure the wallet exists.
    await this.checkWallet();

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
    if(name.length < 3) {
      throw new Error('DAO Name must be at least 3 characters.');
    }
    if(ticker.length < 3) {
      throw new Error('Ticker must be at least 3 characters.');
    }
    if(!Object.keys(balances).length) {
      throw new Error('At least one account need to be specified.');
    }
    for(let bal in balances) {
      if(isNaN(balances[bal]) || !Number.isInteger(balances[bal]) || balances[bal] < 1) {
        throw new Error('Address balances must be a positive integer.');
      }
    }
    if(isNaN(quorum) || quorum < 1 || quorum > 99 || !Number.isInteger(quorum)) {
      throw new Error('Quorum must be an integer between 1-99.');
    }
    quorum = quorum / 100;
    if(isNaN(support) || support < 1 || support > 99 || !Number.isInteger(support)) {
      throw new Error('Support must be an integer between 1-99.');
    }
    support = support / 100;
    if(isNaN(voteLength) || !Number.isInteger(voteLength) || voteLength < 1) {
      throw new Error('Vote Length must be a positive integer.');
    }
    if(isNaN(lockMinLength) || lockMinLength < 1 || !Number.isInteger(lockMinLength)) {
      throw new Error('Lock Min Length must be a positive integer.');
    }
    if(isNaN(lockMaxLength) || lockMaxLength < lockMinLength || !Number.isInteger(lockMaxLength)) {
      throw new Error('Lock Max Length must be a positive integer, greater than lockMinLength.');
    }
    if(Object.keys(vault).length) {
      for(let key in vault) {
        for(let k in vault[key]) {
          if(isNaN(vault[key][k].balance) || !Number.isInteger(vault[key][k]) || vault[key][k].balance < 1) {
            throw new Error('Vault balance must be a positive integer.');
          }
        }
      }
    }

    // Set the state
    this.state = {
      name,
      ticker,
      balances,
      quorum,
      support,
      voteLength,
      lockMinLength,
      lockMaxLength,
      vault,
      votes,
      roles
    };

    return this.state;
  }

  /**
   * Create a new DAO with the current, previously saved using `setState`, state.
   */
  public async create(): Promise<string> {
    // Create the new DAO.
    await this.chargeFee('CreateDAO', this.createFee);
    // @ts-ignore
    const daoID = await createContractFromTx(this.arweave, this.wallet, this.srcTxId, JSON.stringify(this.state));
    this.daoContract = daoID;

    return daoID;
  }

  /**
   * Returns the current create cost as a winston string.
   */
  public async getCreateCost(inAr = false, options?: {formatted: boolean, decimals: number, trim: boolean}): Promise<string> {
    const byteSize = new Blob([JSON.stringify(this.state)]).size;
    const res = await this.arweave.api.get(`/price/${(byteSize+this.createFee)}`);

    if(inAr) {
      return this.arweave.ar.winstonToAr(res.data, options);
    }

    return res.data;
  }

  public async getActionCost(inAr = false, options?: {formatted: boolean, decimals: number, trim: boolean}): Promise<string> {
    const res = await this.arweave.api.get(`/price/${this.txFee}`);

    if(inAr) {
      return this.arweave.ar.winstonToAr(res.data, options);
    }

    return res.data;
  }

  /**
   * Set the DAO interactions to this transaction ID.
   * @param txId DAO's Transaction ID
   */
  public async setDAOTx(txId: string): Promise<void> {
    this.daoContract = txId;
  }

  /**
   * Do a GET call to any function on the contract.
   * @param params - InputInterface
   * @returns ResultInterface
   */
  public async get(params: InputInterface = {function: 'balance'}): Promise<ResultInterface> {
    // @ts-ignore
    return interactRead(this.arweave, this.wallet, this.daoContract, params);
  }

  /**
   * Get the target or current wallet balance
   * @param target 
   * @returns - Current target token balance
   */
  public async getBalance(target: string = this.walletAddress): Promise<number> {
    const res = await this.get({ function: 'balance', target });
    return res.balance;
  }

  public async getUnlockedBalance(target: string = this.walletAddress): Promise<number> {
    const res = await this.get({ function: 'unlockedBalance', target});
    return res.balance;
  }

  public async getVaultBalance(target: string = this.walletAddress): Promise<number> {
    const res = await this.get({ function: 'vaultBalance', target});
    return res.balance;
  }

  public async getRole(target: string = this.walletAddress): Promise<string> {
    const res = await this.get({ function: 'role', target});
    return res.role;
  }

  /** Setters **/

  /**
   * 
   * @param target - Target Wallet Address
   * @param qty - Amount of the token to send
   * @returns The transaction ID for this action
   */
  public async transfer(target: string, qty: number): Promise<string> {
    await this.chargeFee('transfer');
    return this.interact({function: 'transfer', target, qty});
  }

  /**
   * Lock your balances in a vault to earn voting weight.
   * @param qty - Positive integer for the quantity to lock
   * @param lockLength - Length of the lock, in blocks
   * @returns The transaction ID for this action
   */
  public async lockBalance(qty: number, lockLength: number): Promise<string> {
    await this.chargeFee('lockBalance');
    return this.interact({function: 'lock', qty, lockLength});
  }

  /**
   * Unlock all your locked balances that are over the lock period.
   * @returns The transaction ID for this action
   */
  public async unlockVault(): Promise<string> {
    await this.chargeFee('unlockVault');
    return this.interact({function: 'unlock'});
  }

  /**
   * Increase the lock time (in blocks) of a vault.
   * @param lockLength - Length of the lock, in blocks
   */
  public async increaseVault(vaultId: number, lockLength: number): Promise<string> {
    await this.chargeFee('increaseVault');
    return this.interact({function: 'increaseVault', id: vaultId, lockLength });
  }

  public async proposeVote(params: VoteInterface) {
    await this.chargeFee('proposeVote');

    const input: InputInterface = {function: 'propose', ...params};
    return this.interact(input);
  }

  /**
   * Charge a fee for each DAOGarden's interactions.
   * @param action - Current action name. Usually the same as the method name.
   * @param fee - Fee to charge
   */
  private async chargeFee(action: string, bytes: number = this.txFee): Promise<void> {
    // @ts-ignore
    const target = await readContract(this.arweave, this.mainContract).then((state: StateInterface) => {
        const balances = state.balances;
        for(let addy in state.vault) {
          if(addy in balances) {
            if(balances[addy]) {
              balances[addy] += state.vault[addy].map(a => a.balance).reduce((a, b) => {
                return a + b;
              });
            } else {
              balances[addy] = state.vault[addy].map(a => a.balance).reduce((a, b) => {
                return a + b;
              });
            }
          }
        }
        return selectWeightedPstHolder(balances);
    });

    const fee = (await this.arweave.api.get(`/price/${bytes}`)).data;

    const tx = await this.arweave.createTransaction(
      {
        target,
        quantity: fee.toString()
      },
      this.wallet
    );

    await this.setDefaultTags(tx);
    tx.addTag('Action', action);

    await this.arweave.transactions.sign(tx, this.wallet);
    const txId = tx.id;

    const res = await this.arweave.transactions.post(tx);
    if (res.status !== 200 && res.status !== 202) {
      throw new Error('Error while submiting a transaction.');
    }
  }

  private async setDefaultTags(tx: Transaction): Promise<void> {
    tx.addTag('App-Name', 'DAOGarden');
    tx.addTag('App-Version', '0.0.1');
    tx.addTag('Dao-Contract', this.daoContract);
    tx.addTag('Dao-Ticker', this.state.ticker);
  }

  private async checkWallet(): Promise<void> {
    if (!this.wallet) {
      throw new Error('You first need to set the user wallet, you can do this while on new DAOGarden(..., wallet) or using setWallet(wallet).');
    }
  }

  private async interact(input: InputInterface): Promise<string> {
    // @ts-ignore
    const res = await interactWriteDryRun(this.arweave, this.wallet, this.daoContract, input);
    if(res.type === 'error') { //  || res.type === 'exception'
      throw new Error(res.result);
    }

    // @ts-ignore
    return interactWrite(this.arweave, this.wallet, this.daoContract, input);
  }
}