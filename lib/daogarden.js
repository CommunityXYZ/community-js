"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smartweave_1 = require("smartweave");
const utils_1 = __importDefault(require("./utils"));
class DAOGarden {
    /**
     * Before interacting with DAOGarden you need to have at least Arweave initialized.
     * @param arweave - Arweave instance
     * @param wallet - JWK wallet file data
     * @param cacheRefreshInterval - Refresh interval in milliseconds for the cached state
     */
    constructor(arweave, wallet, cacheRefreshInterval = (1000 * 60 * 2)) {
        this.contractSrc = 'CR8a4s4VuhCV__tDAzzjc5d_UgL-dlgtVdWXp7L5Aic';
        this.mainContract = 'dlKReXkvj7Af-mc_0DiY_2OQIVot_mUcc6YAzH9vo3s';
        this.txFee = 400000000;
        this.createFee = 9500000000;
        // DAO specific variables
        this.daoContract = '';
        this.lastStateCall = 0;
        this.cacheRefreshInterval = 1000 * 60 * 2; // 2 minutes
        this.stateCallInProgress = false;
        this.arweave = arweave;
        if (wallet) {
            this.wallet = wallet;
            arweave.wallets.jwkToAddress(wallet).then(addy => this.walletAddress = addy).catch(console.error);
        }
        if (cacheRefreshInterval) {
            this.cacheRefreshInterval = cacheRefreshInterval;
        }
    }
    /**
     * Get the current DAO state.
     * @param cached - Wether to return the cached version or reload
     */
    getState(cached = true) {
        return __awaiter(this, void 0, void 0, function* () {
            // Only call the state from server once even if multiple calls at once.
            if (this.stateCallInProgress) {
                console.log('Waiting on state...');
                return new Promise(resolve => setTimeout(() => resolve(this.getState(cached)), 1000));
            }
            if (!cached || ((new Date()).getTime() - this.lastStateCall) > this.cacheRefreshInterval) {
                this.stateCallInProgress = true;
                this.state = yield smartweave_1.readContract(this.arweave, this.daoContract);
                this.lastStateCall = (new Date()).getTime();
                this.stateCallInProgress = false;
            }
            return this.state;
        });
    }
    /**
     * Set the user wallet data.
     * @param wallet - JWK wallet file data
     * @returns The wallet address
     */
    setWallet(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            this.wallet = wallet;
            this.walletAddress = yield this.arweave.wallets.jwkToAddress(this.wallet);
            return this.walletAddress;
        });
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
    setState(name, ticker, balances, quorum = 50, support = 50, voteLength = 2000, lockMinLength = 720, lockMaxLength = 10000, vault = {}, votes = [], roles = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure the wallet exists.
            yield this.checkWallet();
            // Clean data
            name = name.trim();
            ticker = ticker.trim();
            balances = utils_1.default.trimObj(balances);
            quorum = +quorum;
            support = +support;
            voteLength = +voteLength;
            lockMinLength = +lockMinLength;
            lockMaxLength = +lockMaxLength;
            vault = utils_1.default.trimObj(vault);
            votes = utils_1.default.trimObj(votes);
            roles = utils_1.default.trimObj(roles);
            // Validations
            if (name.length < 3) {
                throw new Error('DAO Name must be at least 3 characters.');
            }
            if (ticker.length < 3) {
                throw new Error('Ticker must be at least 3 characters.');
            }
            if (!Object.keys(balances).length) {
                throw new Error('At least one account need to be specified.');
            }
            for (let bal in balances) {
                if (isNaN(balances[bal]) || !Number.isInteger(balances[bal]) || balances[bal] < 1) {
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
                for (let key in vault) {
                    for (let k in vault[key]) {
                        if (isNaN(vault[key][k].balance) || !Number.isInteger(vault[key][k]) || vault[key][k].balance < 1) {
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
        });
    }
    /**
     * Create a new DAO with the current, previously saved using `setState`, state.
     */
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the new DAO.
            yield this.chargeFee('CreateDAO', this.createFee);
            const daoID = yield smartweave_1.createContractFromTx(this.arweave, this.wallet, this.contractSrc, JSON.stringify(this.state));
            this.daoContract = daoID;
            return daoID;
        });
    }
    /**
     * Returns the current create cost as a winston string.
     */
    getCreateCost(inAr = false, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const byteSize = new Blob([JSON.stringify(this.state)]).size;
            const res = yield this.arweave.api.get(`/price/${(byteSize + this.createFee)}`);
            if (inAr) {
                return this.arweave.ar.winstonToAr(res.data, options);
            }
            return res.data;
        });
    }
    getActionCost(inAr = false, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.arweave.api.get(`/price/${this.txFee}`);
            if (inAr) {
                return this.arweave.ar.winstonToAr(res.data, options);
            }
            return res.data;
        });
    }
    /**
     * Set the DAO interactions to this transaction ID.
     * @param txId DAO's Transaction ID
     */
    setDAOTx(txId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.daoContract = txId;
        });
    }
    /**
     * Do a GET call to any function on the contract.
     * @param params - InputInterface
     * @returns ResultInterface
     */
    get(params = { function: 'balance' }) {
        return __awaiter(this, void 0, void 0, function* () {
            return smartweave_1.interactRead(this.arweave, this.wallet, this.daoContract, params);
        });
    }
    /**
     * Get the target or current wallet balance
     * @param target
     * @returns - Current target token balance
     */
    getBalance(target = this.walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get({ function: 'balance', target });
            return res.balance;
        });
    }
    getUnlockedBalance(target = this.walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get({ function: 'unlockedBalance', target });
            return res.balance;
        });
    }
    getVaultBalance(target = this.walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get({ function: 'vaultBalance', target });
            return res.balance;
        });
    }
    getRole(target = this.walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get({ function: 'role', target });
            return res.role;
        });
    }
    /** Setters **/
    /**
     *
     * @param target - Target Wallet Address
     * @param qty - Amount of the token to send
     * @returns The transaction ID for this action
     */
    transfer(target, qty) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chargeFee('transfer');
            return this.interact({ function: 'transfer', target, qty });
        });
    }
    /**
     * Lock your balances in a vault to earn voting weight.
     * @param qty - Positive integer for the quantity to lock
     * @param lockLength - Length of the lock, in blocks
     * @returns The transaction ID for this action
     */
    lockBalance(qty, lockLength) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chargeFee('lockBalance');
            return this.interact({ function: 'lock', qty, lockLength });
        });
    }
    /**
     * Unlock all your locked balances that are over the lock period.
     * @returns The transaction ID for this action
     */
    unlockVault() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chargeFee('unlockVault');
            return this.interact({ function: 'unlock' });
        });
    }
    /**
     * Increase the lock time (in blocks) of a vault.
     * @param lockLength - Length of the lock, in blocks
     */
    increaseVault(vaultId, lockLength) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chargeFee('increaseVault');
            return this.interact({ function: 'increaseVault', id: vaultId, lockLength });
        });
    }
    /**
     * Create a new vote
     * @param params VoteInterface without the "function"
     */
    proposeVote(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const pCopy = JSON.parse(JSON.stringify(params));
            if (pCopy.type === 'set') {
                if (pCopy.key === 'quorum' || pCopy.key === 'support' || pCopy.key === 'lockMinLength' || pCopy.key === 'lockMaxLength') {
                    pCopy.value = +pCopy.value;
                }
                if (pCopy.key === 'quorum' || pCopy.key === 'support') {
                    if (pCopy.value > 0 && pCopy.value < 100) {
                        pCopy.value = pCopy.value / 100;
                    }
                    else if (pCopy.value <= 0 || pCopy.value >= 100) {
                        throw new Error('Invalid value.');
                    }
                }
                if (pCopy.key === 'lockMinLength' && (pCopy.value < 1 || pCopy.value > this.state.lockMaxLength)) {
                    throw new Error('Invalid minimum lock length.');
                }
                if (pCopy.key === 'lockMaxLength' && (pCopy.value < 1 || pCopy.value < this.state.lockMinLength)) {
                    throw new Error('Invalid maximum lock length.');
                }
            }
            yield this.chargeFee('proposeVote');
            const input = Object.assign(Object.assign({}, pCopy), { function: 'propose' });
            return this.interact(input);
        });
    }
    /**
     * Cast a vote on an existing, and active, vote proposal.
     * @param id - The vote ID, this is the index of the vote in votes
     * @param cast - Cast your vote with 'yay' (for yes) or 'nay' (for no)
     */
    vote(id, cast) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chargeFee('vote');
            return this.interact({ function: 'vote', id, cast });
        });
    }
    /**
     * Finalize a vote, to run the desired vote details if approved, or reject it and close.
     * @param id - The vote ID, this is the index of the vote in votes
     */
    finalize(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chargeFee('finalize');
            return this.interact({ function: 'finalize', id });
        });
    }
    /**
     * Charge a fee for each DAOGarden's interactions.
     * @param action - Current action name. Usually the same as the method name.
     * @param fee - Fee to charge
     */
    chargeFee(action, bytes = this.txFee) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = yield smartweave_1.readContract(this.arweave, this.mainContract).then((state) => {
                const balances = state.balances;
                for (let addy in state.vault) {
                    if (addy in balances) {
                        if (balances[addy]) {
                            balances[addy] += state.vault[addy].map(a => a.balance).reduce((a, b) => {
                                return a + b;
                            });
                        }
                        else {
                            balances[addy] = state.vault[addy].map(a => a.balance).reduce((a, b) => {
                                return a + b;
                            });
                        }
                    }
                }
                return smartweave_1.selectWeightedPstHolder(balances);
            });
            const fee = (yield this.arweave.api.get(`/price/${bytes}`)).data;
            const tx = yield this.arweave.createTransaction({
                target,
                quantity: fee.toString()
            }, this.wallet);
            yield this.setDefaultTags(tx);
            tx.addTag('Action', action);
            yield this.arweave.transactions.sign(tx, this.wallet);
            const txId = tx.id;
            const res = yield this.arweave.transactions.post(tx);
            if (res.status !== 200 && res.status !== 202) {
                throw new Error('Error while submiting a transaction.');
            }
        });
    }
    setDefaultTags(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            tx.addTag('App-Name', 'DAOGarden');
            tx.addTag('App-Version', '0.0.1');
            tx.addTag('Dao-Contract', this.daoContract);
            tx.addTag('Dao-Ticker', this.state.ticker);
        });
    }
    checkWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wallet) {
                throw new Error('You first need to set the user wallet, you can do this while on new DAOGarden(..., wallet) or using setWallet(wallet).');
            }
        });
    }
    interact(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield smartweave_1.interactWriteDryRun(this.arweave, this.wallet, this.daoContract, input);
            if (res.type === 'error') { //  || res.type === 'exception'
                throw new Error(res.result);
            }
            // @ts-ignore
            return smartweave_1.interactWrite(this.arweave, this.wallet, this.daoContract, input);
        });
    }
}
exports.default = DAOGarden;
