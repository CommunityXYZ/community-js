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
class Community {
    /**
     * Before interacting with Community you need to have at least Arweave initialized.
     * @param arweave - Arweave instance
     * @param wallet - JWK wallet file data
     * @param cacheRefreshInterval - Refresh interval in milliseconds for the cached state
     */
    constructor(arweave, wallet, cacheRefreshInterval = 1000 * 60 * 2) {
        this.contractSrc = 'g9aDt3dVz62PN2_0ahwep8x8u1sNgybauSlvQuXL6u8';
        this.mainContract = 'Lr08-VeqSEb74fsj-gplPdQz1Cw64G-xknFqUnas-pY';
        this.txFee = 400000000;
        this.createFee = 9500000000;
        // Community specific variables
        this.communityContract = '';
        this.firstCall = true;
        this.cacheRefreshInterval = 1000 * 60 * 2; // 2 minutes
        this.stateCallInProgress = false;
        this.arweave = arweave;
        if (wallet) {
            this.wallet = wallet;
            arweave.wallets
                .jwkToAddress(wallet)
                .then((addy) => (this.walletAddress = addy))
                .catch(console.log);
        }
        if (cacheRefreshInterval) {
            this.cacheRefreshInterval = cacheRefreshInterval;
        }
    }
    /**
     * Get the Community contract ID
     * @returns {Promise<string>} The main contract ID.
     */
    getMainContractId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mainContract;
        });
    }
    /**
     * Get the current Community state.
     * @param cached - Wether to return the cached version or reload
     * @returns - The current state and sync afterwards if needed.
     */
    getState(cached = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.communityContract.length) {
                throw new Error('No community set. Use setCommunityTx to get your current state.');
            }
            if (this.firstCall) {
                this.firstCall = false;
                return this.update(true);
            }
            if (!cached || !this.state) {
                return this.update(false);
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
     *
     * @returns - The created state
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
                throw new Error('Community Name must be at least 3 characters.');
            }
            if (ticker.length < 3) {
                throw new Error('Ticker must be at least 3 characters.');
            }
            if (!Object.keys(balances).length) {
                throw new Error('At least one account need to be specified.');
            }
            for (const bal in balances) {
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
                for (const key of Object.keys(vault)) {
                    for (const k in vault[key]) {
                        if (isNaN(vault[key][k].balance) || !Number.isInteger(vault[key][k]) || vault[key][k].balance < 1) {
                            throw new Error('Vault balance must be a positive integer.');
                        }
                    }
                }
            }
            const settings = [
                ['quorum', quorum],
                ['support', support],
                ['voteLength', voteLength],
                ['lockMinLength', lockMinLength],
                ['lockMaxLength', lockMaxLength],
            ];
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
        });
    }
    /**
     * Create a new Community with the current, previously saved (with `setState`) state.
     * @returns The created community transaction ID.
     */
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the new Community.
            yield this.chargeFee('CreateCommunity', this.createFee);
            const toSubmit = this.state;
            toSubmit.settings = Array.from(this.state.settings);
            // @ts-ignore
            const communityID = yield smartweave_1.createContractFromTx(this.arweave, this.wallet, this.contractSrc, JSON.stringify(toSubmit));
            this.communityContract = communityID;
            return communityID;
        });
    }
    /**
     * Get the current create cost of a community.
     * @param inAr - Return in winston or AR
     * @param options - If return inAr is set to true, these options are used to format the returned AR value.
     */
    getCreateCost(inAr = false, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const byteSize = new Blob([JSON.stringify(this.state)]).size;
            const res = yield this.arweave.api.get(`/price/${byteSize + this.createFee}`);
            if (inAr) {
                return this.arweave.ar.winstonToAr(res.data, options);
            }
            return res.data;
        });
    }
    /**
     * Get the current action (post interaction) cost of a community.
     * @param inAr - Return in winston or AR
     * @param options - If return inAr is set to true, these options are used to format the returned AR value.
     */
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
     * Set the Community interactions to this transaction ID.
     * @param txId Community's Transaction ID
     * @returns boolean - True if successful, false if error.
     */
    setCommunityTx(txId) {
        return __awaiter(this, void 0, void 0, function* () {
            // reset state
            this.state = null;
            this.communityContract = txId;
            try {
                yield this.getState(false);
            }
            catch (e) {
                this.state = null;
                this.communityContract = null;
                return false;
            }
            return true;
        });
    }
    /**
     * Do a GET call to any function on the contract.
     * @param params - InputInterface
     * @returns ResultInterface
     */
    get(params = { function: 'balance' }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wallet && !this.dummyWallet) {
                this.dummyWallet = yield this.arweave.wallets.generate();
            }
            // @ts-ignore
            return smartweave_1.interactRead(this.arweave, this.wallet || this.dummyWallet, this.communityContract, params);
        });
    }
    /**
     * Get the target or current wallet token balance
     * @param target The target wallet address
     * @returns Current target token balance
     */
    getBalance(target = this.walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get({ function: 'balance', target });
            return res.balance;
        });
    }
    /**
     * Get the target or current wallet unlocked token balance
     * @param target The target wallet address
     * @returns Current target token balance
     */
    getUnlockedBalance(target = this.walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get({ function: 'unlockedBalance', target });
            return res.balance;
        });
    }
    /**
     * Get the target or current wallet vault balance
     * @param target The target wallet address
     * @returns Current target token balance
     */
    getVaultBalance(target = this.walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get({ function: 'vaultBalance', target });
            return res.balance;
        });
    }
    /**
     * Get the target or current wallet role
     * @param target The target wallet address
     * @returns Current target role
     */
    getRole(target = this.walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get({ function: 'role', target });
            return res.role;
        });
    }
    /**
     * Select one of your community holders based on their weighted total balance.
     * @param balances  - State balances, optional.
     * @param vault - State vault, optional.
     */
    selectWeightedHolder(balances = this.state.balances, vault = this.state.vault) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state) {
                throw new Error('Need to initilate the state and worker.');
            }
            let totalTokens = 0;
            for (const addy of Object.keys(balances)) {
                totalTokens += balances[addy];
            }
            for (const addy of Object.keys(vault)) {
                if (!vault[addy].length)
                    continue;
                const vaultBalance = vault[addy].map((a) => a.balance).reduce((a, b) => a + b, 0);
                totalTokens += vaultBalance;
                if (addy in balances) {
                    balances[addy] += vaultBalance;
                }
                else {
                    balances[addy] = vaultBalance;
                }
            }
            const weighted = {};
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
        });
    }
    // Setters
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
     * @param vaultId - The vault index position to increase
     * @param lockLength - Length of the lock, in blocks
     * @returns The transaction ID for this action
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
     * @returns The transaction ID for this action
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
                if (pCopy.key === 'lockMinLength' && (pCopy.value < 1 || pCopy.value > this.state.settings.get('lockMaxLength'))) {
                    throw new Error('Invalid minimum lock length.');
                }
                if (pCopy.key === 'lockMaxLength' && (pCopy.value < 1 || pCopy.value < this.state.settings.get('lockMinLength'))) {
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
     * @returns The transaction ID for this action
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
     * @returns The transaction ID for this action
     */
    finalize(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chargeFee('finalize');
            return this.interact({ function: 'finalize', id });
        });
    }
    /**
     * Charge a fee for each Community's interactions.
     * @param action - Current action name. Usually the same as the method name
     * @param bytes - Bytes to get it's price to charge
     */
    chargeFee(action, bytes = this.txFee) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Check if the user has enough balance for this action
            const fee = (yield this.arweave.api.get(`/price/${bytes}`)).data;
            const balance = yield this.arweave.wallets.getBalance(this.walletAddress);
            console.log(balance, fee);
            if (+balance < +fee) {
                throw new Error('Not enough balance.');
            }
            // @ts-ignore
            const target = yield smartweave_1.readContract(this.arweave, this.mainContract).then((state) => {
                return this.selectWeightedHolder(state.balances, state.vault);
            });
            const tx = yield this.arweave.createTransaction({
                target,
                quantity: fee.toString(),
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
    /**
     * Set default tags to each transaction sent from CommunityJS.
     * @param tx - Transaction to set the defaults.
     */
    setDefaultTags(tx, communityId = this.communityContract) {
        return __awaiter(this, void 0, void 0, function* () {
            tx.addTag('App-Name', 'CommunityJS');
            tx.addTag('App-Version', '1.0.7');
            tx.addTag('Community-Contract', communityId);
            tx.addTag('Community-Ticker', this.state.ticker);
        });
    }
    /**
     * Function used to check if the user is already logged in
     */
    checkWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wallet) {
                throw new Error('You first need to set the user wallet, you can do this while on new Community(..., wallet) or using setWallet(wallet).');
            }
        });
    }
    update(recall = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.communityContract.length) {
                setTimeout(() => this.update(), this.cacheRefreshInterval);
                return;
            }
            if (this.stateCallInProgress) {
                const getLastState = () => __awaiter(this, void 0, void 0, function* () {
                    if (this.stateCallInProgress) {
                        return new Promise((resolve) => setTimeout(() => resolve(getLastState()), 1000));
                    }
                    return this.state;
                });
                return getLastState();
            }
            this.stateCallInProgress = true;
            // @ts-ignore
            const res = yield smartweave_1.readContract(this.arweave, this.communityContract);
            res.settings = new Map(res.settings);
            this.state = res;
            this.stateCallInProgress = false;
            if (recall) {
                setTimeout(() => this.update(true), this.cacheRefreshInterval);
            }
            return this.state;
        });
    }
    /**
     * The most important function, it writes to the contract.
     * @param input - InputInterface
     */
    interact(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const res = yield smartweave_1.interactWriteDryRun(this.arweave, this.wallet, this.communityContract, input);
            if (res.type === 'error') {
                //  || res.type === 'exception'
                throw new Error(res.result);
            }
            // @ts-ignore
            return smartweave_1.interactWrite(this.arweave, this.wallet, this.communityContract, input);
        });
    }
}
exports.default = Community;
