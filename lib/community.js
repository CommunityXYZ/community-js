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
const axios_1 = __importDefault(require("axios"));
const redstone_smartweave_1 = require("redstone-smartweave");
const ardb_1 = __importDefault(require("ardb"));
const utils_1 = __importDefault(require("./utils"));
class Community {
    /**
     * Before interacting with Community you need to have at least Arweave initialized.
     * @param arweave - Arweave instance
     * @param wallet - JWK wallet file data
     * @param cacheTTL - Refresh interval in milliseconds for the cached state
     */
    constructor(arweave, wallet, cacheTTL = 1000 * 60 * 2) {
        this.cacheServer = 'https://cache.community.xyz/';
        this.contractSrcTxId = 'ngMml4jmlxu0umpiQCsHgPX2pb_Yz6YDB8f7G6j-tpI';
        this.mainContractTxId = 'mzvUgNc8YFk0w5K5H7c8pyT-FC5Y_ba0r7_8766Kx74';
        this.txFeeUsd = 0.5;
        this.createFeeUsd = 3;
        this.createFee = 0.83;
        this.txFee = 0.21;
        this.isWalletConnect = false;
        // Community specific variables
        this.communityContract = '';
        this.cacheTTL = 1000 * 60 * 2; // 2 minutes
        this.stateCallInProgress = false;
        this.stateUpdatedAt = 0;
        this.warnAfter = 60 * 60 * 24 * 1000; // 24 hours
        this.feesUpdatedAt = 0;
        this.feesCallInProgress = false;
        this.arweave = arweave;
        this.ardb = new ardb_1.default(arweave, 2);
        this.smartweave = redstone_smartweave_1.SmartWeaveNodeFactory.memCached(arweave);
        this.mainContract = this.smartweave.contract(this.mainContractTxId);
        if (wallet) {
            this.wallet = wallet;
            this.mainContract.connect(wallet);
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
    getMainContractId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mainContractTxId;
        });
    }
    /**
     * Get the contract source txid used for new PSCs.
     * @returns {Promise<string>} The contract source ID.
     */
    getContractSourceId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contractSrcTxId;
        });
    }
    /**
     * Get the current Community contract ID
     */
    getCommunityContract() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.communityContract;
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
            // Check if cacheTTL has expired. If yes, return this.update() if not, return the previously saved state.
            if (cached && this.state && this.stateUpdatedAt && this.stateUpdatedAt + this.cacheTTL > Date.now()) {
                return this.state;
            }
            else {
                return this.update();
            }
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
            this.mainContract.connect(wallet);
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
     * @param extraSettings - Any custom extra settings can be sent here. @since v1.1.0
     *
     * @returns - The created state
     */
    setState(name, ticker, balances, quorum = 50, support = 50, voteLength = 2000, lockMinLength = 720, lockMaxLength = 10000, vault = {}, votes = [], roles = {}, extraSettings = []) {
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure the wallet exists.
            yield this.checkWallet();
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
            const settings = [
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
        });
    }
    /**
     * Update the used contract source transaction ID.
     * @param id New contract source ID.
     * @returns boolean that validates if the update was done.
     */
    setContractSourceId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utils_1.default.isTxId(id)) {
                return false;
            }
            this.contractSrcTxId = id;
            return true;
        });
    }
    /**
     * Create a new Community with the current, previously saved (with `setState`) state.
     * @param tags - optional: tags to be added to this transaction
     * @returns The created community transaction ID.
     */
    create(tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the new Community.
            const { target, winstonQty } = yield this.chargeFee(this.createFee);
            const toSubmit = this.state;
            toSubmit.settings = Array.from(this.state.settings);
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'CreateCommunity' },
                    { name: 'Message', value: `Created Community ${this.state.name}, ticker: ${this.state.ticker}.` },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            const communityID = yield this.createContractFromTx(this.arweave, this.wallet, this.contractSrcTxId, JSON.stringify(toSubmit), tags, target, winstonQty);
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
            if (!this.feesUpdatedAt) {
                yield new Promise((resolve) => setTimeout(() => resolve(true), 100));
                return this.getCreateCost(inAr, options);
            }
            const fee = this.createFee.toString();
            if (inAr) {
                return fee;
            }
            return this.arweave.ar.arToWinston(fee);
        });
    }
    /**
     * Get the current action (post interaction) cost of a community.
     * @param inAr - Return in winston or AR
     * @param options - If return inAr is set to true, these options are used to format the returned AR value.
     */
    getActionCost(inAr = false, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.feesUpdatedAt) {
                yield new Promise((resolve) => setTimeout(() => resolve(true), 100));
                return this.getActionCost(inAr, options);
            }
            const fee = this.txFee.toString();
            if (inAr) {
                return fee;
            }
            return this.arweave.ar.arToWinston(fee);
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
                console.log(e);
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
            return this.contract.connect(this.wallet || this.dummyWallet).viewState(params);
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
    /**
     * Get the current fee charged for actions on Community.
     * @return {object} - The txFee and the createFee, both are numbers.
     */
    getFees() {
        return __awaiter(this, void 0, void 0, function* () {
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
                const res = (yield this.ardb
                    .search('transactions')
                    .tags([
                    { name: 'app', values: 'Redstone' },
                    { name: 'type', values: 'data' },
                ])
                    .findOne());
                let createdAt;
                let arPrice;
                for (const tag of res.tags) {
                    if (tag.name === 'timestamp') {
                        createdAt = +tag.value;
                    }
                    else if (tag.name === 'AR') {
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
            }
            catch (_a) { }
            this.feesUpdatedAt = Date.now();
            this.feesCallInProgress = false;
            return {
                createFee: this.createFee,
                txFee: this.txFee,
            };
        });
    }
    // Setters
    /**
     * Transfer token balances to another account.
     * @param target - Target Wallet Address
     * @param qty - Amount of the token to send
     * @param tags - optional: tags to be added to this transaction
     * @returns The transaction ID for this action
     */
    transfer(target, qty, tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'transfer' },
                    { name: 'Message', value: `Transfer to ${target} of ${utils_1.default.formatNumber(qty)}.` },
                    { name: 'Community-ID', value: this.communityContract },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            return this.interact({ function: 'transfer', target, qty }, tags);
        });
    }
    /**
     * Transfer tokens to an account's vault.
     * @param target - Target Wallet Address
     * @param qty - Amount of the token to send
     * @param lockLength - For how many blocks to lock the tokens
     * @param tags - optional: tags to be added to this transaction
     * @returns The transaction ID for this action
     */
    transferLocked(target, qty, lockLength, tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'transferLocked' },
                    {
                        name: 'Message',
                        value: `Transfer locked to ${target} of ${utils_1.default.formatNumber(qty)} for ${utils_1.default.formatNumber(lockLength)} blocks.`,
                    },
                    { name: 'Community-ID', value: this.communityContract },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            return this.interact({ function: 'transferLocked', target, qty, lockLength }, tags);
        });
    }
    /**
     * Lock your balances in a vault to earn voting weight.
     * @param qty - Positive integer for the quantity to lock
     * @param lockLength - Length of the lock, in blocks
     * @param tags - optional: tags to be added to this transaction
     * @returns The transaction ID for this action
     */
    lockBalance(qty, lockLength, tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'lock' },
                    {
                        name: 'Message',
                        value: `Locked ${utils_1.default.formatNumber(qty)} for ${utils_1.default.formatNumber(lockLength)} blocks (${utils_1.default.formatBlocks(lockLength)}).`,
                    },
                    { name: 'Community-ID', value: this.communityContract },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            return this.interact({ function: 'lock', qty, lockLength }, tags);
        });
    }
    /**
     * Unlock all your locked balances that are over the lock period.
     * @param tags - optional: tags to be added to this transaction
     * @returns The transaction ID for this action
     */
    unlockVault(tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'unlock' },
                    { name: 'Message', value: `Unlocked vaults.` },
                    { name: 'Community-ID', value: this.communityContract },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            return this.interact({ function: 'unlock' }, tags);
        });
    }
    /**
     * Increase the lock time (in blocks) of a vault.
     * @param vaultId - The vault index position to increase
     * @param lockLength - Length of the lock, in blocks
     * @param tags - optional: tags to be added to this transaction
     * @returns The transaction ID for this action
     */
    increaseVault(vaultId, lockLength, tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'increase' },
                    {
                        name: 'Message',
                        value: `Increased vault ID ${vaultId} for ${lockLength} blocks (${utils_1.default.formatBlocks(lockLength)}).`,
                    },
                    { name: 'Community-ID', value: this.communityContract },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            return this.interact({ function: 'increaseVault', id: vaultId, lockLength }, tags);
        });
    }
    /**
     * Create a new vote
     * @param params VoteInterface without the "function"
     * @param tags - optional: tags to be added to this transaction
     * @returns The transaction ID for this action
     */
    proposeVote(params, tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const pCopy = JSON.parse(JSON.stringify(params));
            console.log(pCopy);
            if (pCopy.type === 'set') {
                if (pCopy.key === 'quorum' ||
                    pCopy.key === 'support' ||
                    pCopy.key === 'lockMinLength' ||
                    pCopy.key === 'lockMaxLength') {
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
                if (pCopy.key === 'lockMinLength' &&
                    (pCopy.value < 1 || pCopy.value > this.state.settings.get('lockMaxLength'))) {
                    throw new Error('Invalid minimum lock length.');
                }
                if (pCopy.key === 'lockMaxLength' &&
                    (pCopy.value < 1 || pCopy.value < this.state.settings.get('lockMinLength'))) {
                    throw new Error('Invalid maximum lock length.');
                }
            }
            const input = Object.assign(Object.assign({}, pCopy), { function: 'propose' });
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'propose' },
                    {
                        name: 'Message',
                        value: `Proposed ${pCopy.type === 'indicative' || pCopy.key === 'other' ? 'an' : 'a'} ${pCopy.key || pCopy.type} vote, value: ${pCopy.value}.`,
                    },
                    { name: 'Community-ID', value: this.communityContract },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            return this.interact(input, tags);
        });
    }
    /**
     * Cast a vote on an existing, and active, vote proposal.
     * @param id - The vote ID, this is the index of the vote in votes
     * @param cast - Cast your vote with 'yay' (for yes) or 'nay' (for no)
     * @param tags - optional: tags to be added to this transaction
     * @returns The transaction ID for this action
     */
    vote(id, cast, tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'vote' },
                    { name: 'Message', value: `Voted on vote ID ${id}: ${cast}.` },
                    { name: 'Community-ID', value: this.communityContract },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            return this.interact({ function: 'vote', id, cast }, tags);
        });
    }
    /**
     * Finalize a vote, to run the desired vote details if approved, or reject it and close.
     * @param id - The vote ID, this is the index of the vote in votes
     * @param tags - optional: tags to be added to this transaction
     * @returns The transaction ID for this action
     */
    finalize(id, tags = []) {
        return __awaiter(this, void 0, void 0, function* () {
            tags = [
                ...(yield this.cleanTags(tags)),
                ...[
                    { name: 'Action', value: 'finalize' },
                    { name: 'Message', value: `Finalize completed votes.` },
                    { name: 'Community-ID', value: this.communityContract },
                    { name: 'Service', value: 'CommunityXYZ' },
                ],
            ];
            return this.interact({ function: 'finalize', id }, tags);
        });
    }
    /**
     * Charge a fee for each Community's interactions.
     * @param fee - which fee to charge
     */
    chargeFee(fee = this.txFee) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.arweave.wallets.getBalance(this.walletAddress);
            if (+balance < +fee) {
                throw new Error('Not enough balance.');
            }
            let state;
            try {
                state = (yield (0, axios_1.default)(`${this.cacheServer}contract/${this.mainContractTxId}`)).data;
            }
            catch (e) {
                try {
                    state = (yield (yield this.mainContract.readState()).state);
                }
                catch (e) {
                    console.log(e);
                    return {
                        target: '',
                        winstonQty: '0',
                    };
                }
            }
            const target = yield this.selectWeightedHolder(state.balances, state.vault);
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
        });
    }
    /**
     * Function used to check if the user is already logged in
     */
    checkWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wallet && !this.isWalletConnect) {
                throw new Error('You first need to set the user wallet, you can do this while on new Community(..., wallet) or using setWallet(wallet).');
            }
        });
    }
    /**
     * Stringify and remove tags that are defined by CommunityJS
     * @returns An array of the TagInterface object `{name: string, value: string}`
     */
    cleanTags(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tags || !tags.length) {
                return [];
            }
            const blacklist = ['action', 'message', 'community-id', 'service', 'type'];
            const res = [];
            for (const tag of tags) {
                if (!tag.name || !tag.value)
                    continue;
                if (!blacklist.includes(tag.name.toLowerCase())) {
                    res.push({
                        name: tag.name.toString(),
                        value: tag.value.toString(),
                    });
                }
            }
            return res;
        });
    }
    /**
     * Updates the current state used for a Community instance
     * @param recall Auto recall this function each cacheRefreshInterval ms
     */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
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
            let state;
            try {
                state = (yield (0, axios_1.default)(`${this.cacheServer}contract/${this.communityContract}`)).data;
            }
            catch (e) {
                try {
                    state = (yield (yield this.contract.readState()).state);
                }
                catch (e) {
                    console.log(e);
                    return;
                }
            }
            state.settings = new Map(state.settings);
            this.state = state;
            this.stateUpdatedAt = Date.now();
            this.stateCallInProgress = false;
            return this.state;
        });
    }
    /**
     * The most important function, it writes to the contract.
     * @param input - InputInterface
     * @param tags - Array of tags as an object with name and value as strings
     * @param fee - Transaction fee
     */
    interact(input, tags, fee = this.txFee) {
        return __awaiter(this, void 0, void 0, function* () {
            const { target, winstonQty } = yield this.chargeFee(fee);
            tags.push({ name: 'Type', value: 'ArweaveActivity' });
            // TODO: No way to use this with redstone-smartweave, for now.
            // const res = await interactWriteDryRun(
            //   this.arweave,
            //   this.wallet || 'use_wallet',
            //   this.communityContract,
            //   input,
            //   tags,
            //   target,
            //   winstonQty,
            // );
            // if (res.type === 'error') {
            //   //  || res.type === 'exception'
            //   throw new Error(res.result);
            // }
            return this.contract.connect(this.wallet).writeInteraction(input, tags, {
                target,
                winstonQty,
            });
        });
    }
    /**
     * Create events to handle the wallet connect feature
     */
    events() {
        const win = typeof window !== 'undefined'
            ? window
            : {
                removeEventListener: (evName) => { },
                addEventListener: (evName, callback) => { },
            };
        function walletConnect() {
            return __awaiter(this, void 0, void 0, function* () {
                this.walletAddress = yield this.arweave.wallets.getAddress();
                this.isWalletConnect = true;
            });
        }
        function walletSwitch(e) {
            return __awaiter(this, void 0, void 0, function* () {
                this.walletAddress = yield e.detail.address;
                this.isWalletConnect = true;
            });
        }
        win.removeEventListener('arweaveWalletLoaded', () => walletConnect());
        win.removeEventListener('walletSwitch', (e) => walletSwitch(e));
        win.addEventListener('arweaveWalletLoaded', () => walletConnect());
        win.addEventListener('walletSwitch', (e) => walletSwitch(e));
    }
    /**
     * Create a new contract from an existing contract source tx, with an initial state.
     * Returns the contract id.
     *
     * @param arweave   an Arweave client instance
     * @param wallet    a wallet private or public key
     * @param srcTxId   the contract source Tx id.
     * @param state     the initial state, as a JSON string.
     * @param tags          an array of tags with name/value as objects.
     * @param target        if needed to send AR to an address, this is the target.
     * @param winstonQty    amount of winston to send to the target, if needed.
     */
    createContractFromTx(arweave, wallet, srcTxId, state, tags = [], target = '', winstonQty = '', reward) {
        return __awaiter(this, void 0, void 0, function* () {
            let contractTX = yield arweave.createTransaction({ data: state, reward }, wallet);
            if (target && winstonQty && target.length && +winstonQty > 0) {
                contractTX = yield arweave.createTransaction({
                    data: state,
                    target: target.toString(),
                    quantity: winstonQty.toString(),
                    reward,
                }, wallet);
            }
            if (tags && tags.length) {
                for (const tag of tags) {
                    contractTX.addTag(tag.name.toString(), tag.value.toString());
                }
            }
            contractTX.addTag('App-Name', 'SmartWeaveContract');
            contractTX.addTag('App-Version', '0.3.0');
            contractTX.addTag('Contract-Src', srcTxId);
            contractTX.addTag('Content-Type', 'application/json');
            yield arweave.transactions.sign(contractTX, wallet);
            const response = yield arweave.transactions.post(contractTX);
            if (response.status === 200 || response.status === 208) {
                return contractTX.id;
            }
            else {
                throw new Error('Unable to write Contract Initial State');
            }
        });
    }
}
exports.default = Community;
