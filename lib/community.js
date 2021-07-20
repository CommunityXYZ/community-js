(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios'), require('smartweave'), require('redstone-api')) :
    typeof define === 'function' && define.amd ? define(['axios', 'smartweave', 'redstone-api'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.community = factory(global.axios, global.smartweave, global.redstone));
}(this, (function (axios, smartweave, redstone) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
    var redstone__default = /*#__PURE__*/_interopDefaultLegacy(redstone);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || from);
    }

    var Utils = /** @class */ (function () {
        function Utils() {
        }
        /**
         * Trims object keys and values.
         * @param obj - Object to trim key/values
         */
        Utils.trimObj = function (obj) {
            if (obj === null || (!Array.isArray(obj) && typeof obj !== 'object'))
                return obj;
            return Object.keys(obj).reduce(function (acc, key) {
                acc[key.trim()] = typeof obj[key] === 'string' ? obj[key].trim() : Utils.trimObj(obj[key]);
                return acc;
            }, Array.isArray(obj) ? [] : {});
        };
        /**
         * Checks if a string is a valid Arweave transaction ID.
         * @param id Transaction id.
         * @returns
         */
        Utils.isTxId = function (id) {
            return /[a-z0-9_-]{43}/i.test(id);
        };
        /**
         * Formats the currency
         * @param amount balance to be formatted
         * @param decimalCount how many decimals to add
         * @param decimal string to separate decimals
         * @param thousands string to separate thousands
         */
        Utils.formatNumber = function (amount, decimalCount, decimal, thousands) {
            if (decimalCount === void 0) { decimalCount = 0; }
            if (decimal === void 0) { decimal = '.'; }
            if (thousands === void 0) { thousands = ','; }
            try {
                decimalCount = Math.abs(decimalCount);
                decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
                var negativeSign = amount < 0 ? '-' : '';
                var i = parseInt(Math.abs(Number(amount) || 0).toFixed(decimalCount), 10).toString();
                var j = i.length > 3 ? i.length % 3 : 0;
                return (negativeSign +
                    (j ? i.substr(0, j) + thousands : '') +
                    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
                    (decimalCount
                        ? decimal +
                            Math.abs(amount - +i)
                                .toFixed(decimalCount)
                                .slice(2)
                        : ''));
            }
            catch (e) {
                console.log(e);
            }
        };
        /**
         * Formats a block number into human readable hours, days, months, years.
         * @param len block length
         */
        Utils.formatBlocks = function (len) {
            if (len === void 0) { len = 720; }
            var hour = 30;
            var day = 720;
            var week = 720 * 7;
            var month = week * 4;
            var year = month * 12;
            var res = '';
            if (len >= year) {
                var years = Math.round(len / year);
                res = "~" + years + " " + (years === 1 ? 'year' : 'years');
            }
            else if (len >= month) {
                var months = Math.round(len / month);
                res = "~" + months + " " + (months === 1 ? 'month' : 'months');
            }
            else if (len >= day) {
                var days = Math.round(len / day);
                res = "~" + days + " " + (days === 1 ? 'day' : 'days');
            }
            else if (len >= hour) {
                var hours = Math.round(len / hour);
                res = "~" + hours + " " + (hours === 1 ? 'hour' : 'hours');
            }
            else {
                res = '<1 hour';
            }
            return res;
        };
        return Utils;
    }());

    var Community = /** @class */ (function () {
        /**
         * Before interacting with Community you need to have at least Arweave initialized.
         * @param arweave - Arweave instance
         * @param wallet - JWK wallet file data
         * @param cacheRefreshInterval - Refresh interval in milliseconds for the cached state
         */
        function Community(arweave, wallet, cacheRefreshInterval) {
            var _this = this;
            if (cacheRefreshInterval === void 0) { cacheRefreshInterval = 1000 * 60 * 2; }
            this.cacheServer = 'https://cache.community.xyz/';
            this.contractSrc = 'ngMml4jmlxu0umpiQCsHgPX2pb_Yz6YDB8f7G6j-tpI';
            this.mainContract = 'mzvUgNc8YFk0w5K5H7c8pyT-FC5Y_ba0r7_8766Kx74';
            this.txFeeUsd = 0.5;
            this.createFeeUsd = 3;
            this.createFee = 0.83;
            this.txFee = 0.21;
            this.isWalletConnect = false;
            // Community specific variables
            this.communityContract = '';
            this.firstCall = true;
            this.cacheRefreshInterval = 1000 * 60 * 2; // 2 minutes
            this.stateCallInProgress = false;
            this.warnAfter = 60 * 60 * 24 * 1000; // 24 hours
            this.updatedFees = false;
            this.arweave = arweave;
            if (wallet) {
                this.wallet = wallet;
                arweave.wallets
                    .jwkToAddress(wallet)
                    .then(function (addy) { return (_this.walletAddress = addy); })
                    .catch(console.log);
            }
            if (cacheRefreshInterval) {
                this.cacheRefreshInterval = cacheRefreshInterval;
            }
            this.getFees();
            this.events();
        }
        /**
         * Get the Main Community contract ID
         * @returns {Promise<string>} The main contract ID.
         */
        Community.prototype.getMainContractId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mainContract];
                });
            });
        };
        /**
         * Get the contract source txid used for new PSCs.
         * @returns {Promise<string>} The contract source ID.
         */
        Community.prototype.getContractSourceId = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.contractSrc];
                });
            });
        };
        /**
         * Get the current Community contract ID
         */
        Community.prototype.getCommunityContract = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.communityContract];
                });
            });
        };
        /**
         * Get the current Community state.
         * @param cached - Wether to return the cached version or reload
         * @returns - The current state and sync afterwards if needed.
         */
        Community.prototype.getState = function (cached) {
            if (cached === void 0) { cached = true; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.communityContract.length) {
                        throw new Error('No community set. Use setCommunityTx to get your current state.');
                    }
                    if (this.firstCall) {
                        this.firstCall = false;
                        return [2 /*return*/, this.update(true)];
                    }
                    if (!cached || !this.state) {
                        return [2 /*return*/, this.update(false)];
                    }
                    return [2 /*return*/, this.state];
                });
            });
        };
        /**
         * Set the user wallet data.
         * @param wallet - JWK wallet file data
         * @returns The wallet address
         */
        Community.prototype.setWallet = function (wallet) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.wallet = wallet;
                            _a = this;
                            return [4 /*yield*/, this.arweave.wallets.jwkToAddress(this.wallet)];
                        case 1:
                            _a.walletAddress = _b.sent();
                            return [2 /*return*/, this.walletAddress];
                    }
                });
            });
        };
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
        Community.prototype.setState = function (name, ticker, balances, quorum, support, voteLength, lockMinLength, lockMaxLength, vault, votes, roles, extraSettings) {
            if (quorum === void 0) { quorum = 50; }
            if (support === void 0) { support = 50; }
            if (voteLength === void 0) { voteLength = 2000; }
            if (lockMinLength === void 0) { lockMinLength = 720; }
            if (lockMaxLength === void 0) { lockMaxLength = 10000; }
            if (vault === void 0) { vault = {}; }
            if (votes === void 0) { votes = []; }
            if (roles === void 0) { roles = {}; }
            if (extraSettings === void 0) { extraSettings = []; }
            return __awaiter(this, void 0, void 0, function () {
                var bal, _i, _a, key, k, settings, i, j, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: 
                        // Make sure the wallet exists.
                        return [4 /*yield*/, this.checkWallet()];
                        case 1:
                            // Make sure the wallet exists.
                            _b.sent();
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
                            for (bal in balances) {
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
                                for (_i = 0, _a = Object.keys(vault); _i < _a.length; _i++) {
                                    key = _a[_i];
                                    for (k in vault[key]) {
                                        if (isNaN(vault[key][k].balance) || !Number.isInteger(vault[key][k].balance) || vault[key][k].balance < 0) {
                                            throw new Error('Vault balance must be a positive integer.');
                                        }
                                    }
                                }
                            }
                            settings = [
                                ['quorum', quorum],
                                ['support', support],
                                ['voteLength', voteLength],
                                ['lockMinLength', lockMinLength],
                                ['lockMaxLength', lockMaxLength],
                            ];
                            for (i = 0, j = extraSettings.length; i < j; i++) {
                                s = extraSettings[i];
                                if (typeof s[0] === 'string' && typeof s[1] !== 'undefined') {
                                    settings.push(s);
                                }
                            }
                            // Set the state
                            this.state = {
                                name: name,
                                ticker: ticker,
                                balances: balances,
                                vault: vault,
                                votes: votes,
                                roles: roles,
                                settings: new Map(settings),
                            };
                            return [2 /*return*/, this.state];
                    }
                });
            });
        };
        /**
         * Update the used contract source transaction ID.
         * @param id New contract source ID.
         * @returns boolean that validates if the update was done.
         */
        Community.prototype.setContractSourceId = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!Utils.isTxId(id)) {
                        return [2 /*return*/, false];
                    }
                    this.contractSrc = id;
                    return [2 /*return*/, true];
                });
            });
        };
        /**
         * Create a new Community with the current, previously saved (with `setState`) state.
         * @param tags - optional: tags to be added to this transaction
         * @returns The created community transaction ID.
         */
        Community.prototype.create = function (tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _a, target, winstonQty, toSubmit, _b, communityID;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.chargeFee(this.createFee)];
                        case 1:
                            _a = _c.sent(), target = _a.target, winstonQty = _a.winstonQty;
                            toSubmit = this.state;
                            toSubmit.settings = Array.from(this.state.settings);
                            _b = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 2:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _b.concat([(_c.sent())])), [
                                    { name: 'Action', value: 'CreateCommunity' },
                                    { name: 'Message', value: "Created Community " + this.state.name + ", ticker: " + this.state.ticker + "." },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [4 /*yield*/, smartweave.createContractFromTx(this.arweave, this.wallet, this.contractSrc, JSON.stringify(toSubmit), tags, target, winstonQty)];
                        case 3:
                            communityID = _c.sent();
                            this.communityContract = communityID;
                            return [2 /*return*/, communityID];
                    }
                });
            });
        };
        /**
         * Get the current create cost of a community.
         * @param inAr - Return in winston or AR
         * @param options - If return inAr is set to true, these options are used to format the returned AR value.
         */
        Community.prototype.getCreateCost = function (inAr, options) {
            if (inAr === void 0) { inAr = false; }
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.updatedFees) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(true); }, 100); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.getCreateCost(inAr, options)];
                        case 2:
                            res = this.arweave.ar.arToWinston(this.createFee.toString());
                            if (inAr) {
                                return [2 /*return*/, this.arweave.ar.winstonToAr(res, options)];
                            }
                            return [2 /*return*/, res];
                    }
                });
            });
        };
        /**
         * Get the current action (post interaction) cost of a community.
         * @param inAr - Return in winston or AR
         * @param options - If return inAr is set to true, these options are used to format the returned AR value.
         */
        Community.prototype.getActionCost = function (inAr, options) {
            if (inAr === void 0) { inAr = false; }
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.updatedFees) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(true); }, 100); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.getActionCost(inAr, options)];
                        case 2:
                            res = this.arweave.ar.arToWinston(this.txFee.toString());
                            if (inAr) {
                                return [2 /*return*/, this.arweave.ar.winstonToAr(res, options)];
                            }
                            return [2 /*return*/, res];
                    }
                });
            });
        };
        /**
         * Set the Community interactions to this transaction ID.
         * @param txId Community's Transaction ID
         * @returns boolean - True if successful, false if error.
         */
        Community.prototype.setCommunityTx = function (txId) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // reset state
                            this.state = null;
                            this.communityContract = txId;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.getState(false)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            this.state = null;
                            this.communityContract = null;
                            console.log(e_1);
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Do a GET call to any function on the contract.
         * @param params - InputInterface
         * @returns ResultInterface
         */
        Community.prototype.get = function (params) {
            if (params === void 0) { params = { function: 'balance' }; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(!this.wallet && !this.dummyWallet)) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this.arweave.wallets.generate()];
                        case 1:
                            _a.dummyWallet = _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/, smartweave.interactRead(this.arweave, this.wallet || this.dummyWallet, this.communityContract, params)];
                    }
                });
            });
        };
        /**
         * Get the target or current wallet token balance
         * @param target The target wallet address
         * @returns Current target token balance
         */
        Community.prototype.getBalance = function (target) {
            if (target === void 0) { target = this.walletAddress; }
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.get({ function: 'balance', target: target })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.balance];
                    }
                });
            });
        };
        /**
         * Get the target or current wallet unlocked token balance
         * @param target The target wallet address
         * @returns Current target token balance
         */
        Community.prototype.getUnlockedBalance = function (target) {
            if (target === void 0) { target = this.walletAddress; }
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.get({ function: 'unlockedBalance', target: target })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.balance];
                    }
                });
            });
        };
        /**
         * Get the target or current wallet vault balance
         * @param target The target wallet address
         * @returns Current target token balance
         */
        Community.prototype.getVaultBalance = function (target) {
            if (target === void 0) { target = this.walletAddress; }
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.get({ function: 'vaultBalance', target: target })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.balance];
                    }
                });
            });
        };
        /**
         * Get the target or current wallet role
         * @param target The target wallet address
         * @returns Current target role
         */
        Community.prototype.getRole = function (target) {
            if (target === void 0) { target = this.walletAddress; }
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.get({ function: 'role', target: target })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.role];
                    }
                });
            });
        };
        /**
         * Select one of your community holders based on their weighted total balance.
         * @param balances  - State balances, optional.
         * @param vault - State vault, optional.
         */
        Community.prototype.selectWeightedHolder = function (balances, vault) {
            if (balances === void 0) { balances = this.state.balances; }
            if (vault === void 0) { vault = this.state.vault; }
            return __awaiter(this, void 0, void 0, function () {
                var totalTokens, _i, _a, addy, _b, _c, addy, vaultBalance, weighted, _d, _e, addy, sum, r, _f, _g, addy;
                return __generator(this, function (_h) {
                    if (!this.state) {
                        throw new Error('Need to initilate the state and worker.');
                    }
                    totalTokens = 0;
                    for (_i = 0, _a = Object.keys(balances); _i < _a.length; _i++) {
                        addy = _a[_i];
                        totalTokens += balances[addy];
                    }
                    for (_b = 0, _c = Object.keys(vault); _b < _c.length; _b++) {
                        addy = _c[_b];
                        if (!vault[addy].length)
                            continue;
                        vaultBalance = vault[addy].map(function (a) { return a.balance; }).reduce(function (a, b) { return a + b; }, 0);
                        totalTokens += vaultBalance;
                        if (addy in balances) {
                            balances[addy] += vaultBalance;
                        }
                        else {
                            balances[addy] = vaultBalance;
                        }
                    }
                    weighted = {};
                    for (_d = 0, _e = Object.keys(balances); _d < _e.length; _d++) {
                        addy = _e[_d];
                        weighted[addy] = balances[addy] / totalTokens;
                    }
                    sum = 0;
                    r = Math.random();
                    for (_f = 0, _g = Object.keys(weighted); _f < _g.length; _f++) {
                        addy = _g[_f];
                        sum += weighted[addy];
                        if (r <= sum && weighted[addy] > 0) {
                            return [2 /*return*/, addy];
                        }
                    }
                    return [2 /*return*/, null];
                });
            });
        };
        /**
         * Get the current fee charged for actions on Community.
         * @return {object} - The txFee and the createFee, both are numbers.
         */
        Community.prototype.getFees = function () {
            return __awaiter(this, void 0, void 0, function () {
                var price, createdAt, arPrice, deployTime, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, redstone__default['default'].getPrice('AR')];
                        case 1:
                            price = _a.sent();
                            createdAt = price.timestamp;
                            arPrice = price.value;
                            if (createdAt && arPrice) {
                                deployTime = new Date().getTime() - createdAt;
                                if (deployTime > this.warnAfter) {
                                    console.warn("Price hasn't been updated over a day ago!");
                                }
                                this.createFee = +(this.createFeeUsd / arPrice).toFixed(5);
                                this.txFee = +(this.txFeeUsd / arPrice).toFixed(5);
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_2 = _a.sent();
                            console.log(e_2);
                            console.warn('Was not able to update the fees, please try again later');
                            return [3 /*break*/, 3];
                        case 3:
                            this.updatedFees = true;
                            return [2 /*return*/, {
                                    createFee: this.createFee,
                                    txFee: this.txFee,
                                }];
                    }
                });
            });
        };
        // Setters
        /**
         * Transfer token balances to another account.
         * @param target - Target Wallet Address
         * @param qty - Amount of the token to send
         * @param tags - optional: tags to be added to this transaction
         * @returns The transaction ID for this action
         */
        Community.prototype.transfer = function (target, qty, tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 1:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _a.concat([(_b.sent())])), [
                                    { name: 'Action', value: 'transfer' },
                                    { name: 'Message', value: "Transfer to " + target + " of " + Utils.formatNumber(qty) + "." },
                                    { name: 'Community-ID', value: this.communityContract },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [2 /*return*/, this.interact({ function: 'transfer', target: target, qty: qty }, tags)];
                    }
                });
            });
        };
        /**
         * Transfer tokens to an account's vault.
         * @param target - Target Wallet Address
         * @param qty - Amount of the token to send
         * @param lockLength - For how many blocks to lock the tokens
         * @param tags - optional: tags to be added to this transaction
         * @returns The transaction ID for this action
         */
        Community.prototype.transferLocked = function (target, qty, lockLength, tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 1:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _a.concat([(_b.sent())])), [
                                    { name: 'Action', value: 'transferLocked' },
                                    {
                                        name: 'Message',
                                        value: "Transfer locked to " + target + " of " + Utils.formatNumber(qty) + " for " + Utils.formatNumber(lockLength) + " blocks.",
                                    },
                                    { name: 'Community-ID', value: this.communityContract },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [2 /*return*/, this.interact({ function: 'transferLocked', target: target, qty: qty, lockLength: lockLength }, tags)];
                    }
                });
            });
        };
        /**
         * Lock your balances in a vault to earn voting weight.
         * @param qty - Positive integer for the quantity to lock
         * @param lockLength - Length of the lock, in blocks
         * @param tags - optional: tags to be added to this transaction
         * @returns The transaction ID for this action
         */
        Community.prototype.lockBalance = function (qty, lockLength, tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 1:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _a.concat([(_b.sent())])), [
                                    { name: 'Action', value: 'lock' },
                                    {
                                        name: 'Message',
                                        value: "Locked " + Utils.formatNumber(qty) + " for " + Utils.formatNumber(lockLength) + " blocks (" + Utils.formatBlocks(lockLength) + ").",
                                    },
                                    { name: 'Community-ID', value: this.communityContract },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [2 /*return*/, this.interact({ function: 'lock', qty: qty, lockLength: lockLength }, tags)];
                    }
                });
            });
        };
        /**
         * Unlock all your locked balances that are over the lock period.
         * @param tags - optional: tags to be added to this transaction
         * @returns The transaction ID for this action
         */
        Community.prototype.unlockVault = function (tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 1:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _a.concat([(_b.sent())])), [
                                    { name: 'Action', value: 'unlock' },
                                    { name: 'Message', value: "Unlocked vaults." },
                                    { name: 'Community-ID', value: this.communityContract },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [2 /*return*/, this.interact({ function: 'unlock' }, tags)];
                    }
                });
            });
        };
        /**
         * Increase the lock time (in blocks) of a vault.
         * @param vaultId - The vault index position to increase
         * @param lockLength - Length of the lock, in blocks
         * @param tags - optional: tags to be added to this transaction
         * @returns The transaction ID for this action
         */
        Community.prototype.increaseVault = function (vaultId, lockLength, tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 1:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _a.concat([(_b.sent())])), [
                                    { name: 'Action', value: 'increase' },
                                    {
                                        name: 'Message',
                                        value: "Increased vault ID " + vaultId + " for " + lockLength + " blocks (" + Utils.formatBlocks(lockLength) + ").",
                                    },
                                    { name: 'Community-ID', value: this.communityContract },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [2 /*return*/, this.interact({ function: 'increaseVault', id: vaultId, lockLength: lockLength }, tags)];
                    }
                });
            });
        };
        /**
         * Create a new vote
         * @param params VoteInterface without the "function"
         * @param tags - optional: tags to be added to this transaction
         * @returns The transaction ID for this action
         */
        Community.prototype.proposeVote = function (params, tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var pCopy, input, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            pCopy = JSON.parse(JSON.stringify(params));
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
                            input = __assign(__assign({}, pCopy), { function: 'propose' });
                            _a = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 1:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _a.concat([(_b.sent())])), [
                                    { name: 'Action', value: 'propose' },
                                    {
                                        name: 'Message',
                                        value: "Proposed " + (pCopy.type === 'indicative' || pCopy.key === 'other' ? 'an' : 'a') + " " + (pCopy.key || pCopy.type) + " vote, value: " + pCopy.value + ".",
                                    },
                                    { name: 'Community-ID', value: this.communityContract },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [2 /*return*/, this.interact(input, tags)];
                    }
                });
            });
        };
        /**
         * Cast a vote on an existing, and active, vote proposal.
         * @param id - The vote ID, this is the index of the vote in votes
         * @param cast - Cast your vote with 'yay' (for yes) or 'nay' (for no)
         * @param tags - optional: tags to be added to this transaction
         * @returns The transaction ID for this action
         */
        Community.prototype.vote = function (id, cast, tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 1:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _a.concat([(_b.sent())])), [
                                    { name: 'Action', value: 'vote' },
                                    { name: 'Message', value: "Voted on vote ID " + id + ": " + cast + "." },
                                    { name: 'Community-ID', value: this.communityContract },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [2 /*return*/, this.interact({ function: 'vote', id: id, cast: cast }, tags)];
                    }
                });
            });
        };
        /**
         * Finalize a vote, to run the desired vote details if approved, or reject it and close.
         * @param id - The vote ID, this is the index of the vote in votes
         * @param tags - optional: tags to be added to this transaction
         * @returns The transaction ID for this action
         */
        Community.prototype.finalize = function (id, tags) {
            if (tags === void 0) { tags = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, this.cleanTags(tags)];
                        case 1:
                            tags = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _a.concat([(_b.sent())])), [
                                    { name: 'Action', value: 'finalize' },
                                    { name: 'Message', value: "Finalize completed votes." },
                                    { name: 'Community-ID', value: this.communityContract },
                                    { name: 'Service', value: 'CommunityXYZ' },
                                ]]);
                            return [2 /*return*/, this.interact({ function: 'finalize', id: id }, tags)];
                    }
                });
            });
        };
        /**
         * Charge a fee for each Community's interactions.
         * @param fee - which fee to charge
         */
        Community.prototype.chargeFee = function (fee) {
            if (fee === void 0) { fee = this.txFee; }
            return __awaiter(this, void 0, void 0, function () {
                var balance, state, target;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.arweave.wallets.getBalance(this.walletAddress)];
                        case 1:
                            balance = _a.sent();
                            if (+balance < +fee) {
                                throw new Error('Not enough balance.');
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 6]);
                            return [4 /*yield*/, axios__default['default'](this.cacheServer + "contract/" + this.mainContract)];
                        case 3:
                            state = (_a.sent()).data;
                            return [3 /*break*/, 6];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, smartweave.readContract(this.arweave, this.mainContract)];
                        case 5:
                            state = _a.sent();
                            return [3 /*break*/, 6];
                        case 6: return [4 /*yield*/, this.selectWeightedHolder(state.balances, state.vault)];
                        case 7:
                            target = _a.sent();
                            if (target === this.walletAddress) {
                                return [2 /*return*/, {
                                        target: '',
                                        winstonQty: '0',
                                    }];
                            }
                            return [2 /*return*/, {
                                    target: target,
                                    winstonQty: this.arweave.ar.arToWinston(fee.toString()),
                                }];
                    }
                });
            });
        };
        /**
         * Function used to check if the user is already logged in
         */
        Community.prototype.checkWallet = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.wallet && !this.isWalletConnect) {
                        throw new Error('You first need to set the user wallet, you can do this while on new Community(..., wallet) or using setWallet(wallet).');
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Stringify and remove tags that are defined by CommunityJS
         * @returns An array of the TagInterface object `{name: string, value: string}`
         */
        Community.prototype.cleanTags = function (tags) {
            return __awaiter(this, void 0, void 0, function () {
                var blacklist, res, _i, tags_1, tag;
                return __generator(this, function (_a) {
                    if (!tags || !tags.length) {
                        return [2 /*return*/, []];
                    }
                    blacklist = ['action', 'message', 'community-id', 'service', 'type'];
                    res = [];
                    for (_i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
                        tag = tags_1[_i];
                        if (!tag.name || !tag.value)
                            continue;
                        if (!blacklist.includes(tag.name.toLowerCase())) {
                            res.push({
                                name: tag.name.toString(),
                                value: tag.value.toString(),
                            });
                        }
                    }
                    return [2 /*return*/, res];
                });
            });
        };
        /**
         * Updates the current state used for a Community instance
         * @param recall Auto recall this function each cacheRefreshInterval ms
         */
        Community.prototype.update = function (recall) {
            if (recall === void 0) { recall = false; }
            return __awaiter(this, void 0, void 0, function () {
                var getLastState_1, state;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.communityContract.length) {
                                setTimeout(function () { return _this.update(); }, this.cacheRefreshInterval);
                                return [2 /*return*/];
                            }
                            if (this.stateCallInProgress) {
                                getLastState_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (this.stateCallInProgress) {
                                            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(getLastState_1()); }, 1000); })];
                                        }
                                        return [2 /*return*/, this.state];
                                    });
                                }); };
                                return [2 /*return*/, getLastState_1()];
                            }
                            this.stateCallInProgress = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 5]);
                            return [4 /*yield*/, axios__default['default'](this.cacheServer + "contract/" + this.communityContract)];
                        case 2:
                            state = (_a.sent()).data;
                            return [3 /*break*/, 5];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, smartweave.readContract(this.arweave, this.communityContract)];
                        case 4:
                            state = _a.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            state.settings = new Map(state.settings);
                            this.state = state;
                            this.stateCallInProgress = false;
                            if (recall) {
                                setTimeout(function () { return _this.update(true); }, this.cacheRefreshInterval);
                            }
                            return [2 /*return*/, this.state];
                    }
                });
            });
        };
        /**
         * The most important function, it writes to the contract.
         * @param input - InputInterface
         * @param tags - Array of tags as an object with name and value as strings
         * @param fee - Transaction fee
         */
        Community.prototype.interact = function (input, tags, fee) {
            if (fee === void 0) { fee = this.txFee; }
            return __awaiter(this, void 0, void 0, function () {
                var _a, target, winstonQty, res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.chargeFee(fee)];
                        case 1:
                            _a = _b.sent(), target = _a.target, winstonQty = _a.winstonQty;
                            tags.push({ name: 'Type', value: 'ArweaveActivity' });
                            return [4 /*yield*/, smartweave.interactWriteDryRun(this.arweave, this.wallet || 'use_wallet', this.communityContract, input, tags, target, winstonQty)];
                        case 2:
                            res = _b.sent();
                            if (res.type === 'error') {
                                //  || res.type === 'exception'
                                throw new Error(res.result);
                            }
                            return [2 /*return*/, smartweave.interactWrite(this.arweave, this.wallet || 'use_wallet', this.communityContract, input, tags, target, winstonQty)];
                    }
                });
            });
        };
        /**
         * Create events to handle the wallet connect feature
         */
        Community.prototype.events = function () {
            var win = typeof window !== 'undefined'
                ? window
                : {
                    removeEventListener: function (evName) { },
                    addEventListener: function (evName, callback) { },
                };
            function walletConnect() {
                return __awaiter(this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this;
                                return [4 /*yield*/, this.arweave.wallets.getAddress()];
                            case 1:
                                _a.walletAddress = _b.sent();
                                this.isWalletConnect = true;
                                return [2 /*return*/];
                        }
                    });
                });
            }
            function walletSwitch(e) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this;
                                return [4 /*yield*/, e.detail.address];
                            case 1:
                                _a.walletAddress = _b.sent();
                                this.isWalletConnect = true;
                                return [2 /*return*/];
                        }
                    });
                });
            }
            win.removeEventListener('arweaveWalletLoaded', function () { return walletConnect(); });
            win.removeEventListener('walletSwitch', function (e) { return walletSwitch(e); });
            win.addEventListener('arweaveWalletLoaded', function () { return walletConnect(); });
            win.addEventListener('walletSwitch', function (e) { return walletSwitch(e); });
        };
        return Community;
    }());

    return Community;

})));
