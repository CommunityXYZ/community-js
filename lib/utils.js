"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    /**
     * Trims object keys and values.
     * @param obj - Object to trim key/values
     */
    static trimObj(obj) {
        if (obj === null || (!Array.isArray(obj) && typeof obj !== 'object'))
            return obj;
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.trim()] = typeof obj[key] === 'string' ? obj[key].trim() : Utils.trimObj(obj[key]);
            return acc;
        }, Array.isArray(obj) ? [] : {});
    }
    /**
     * Checks if a string is a valid Arweave transaction ID.
     * @param id Transaction id.
     * @returns
     */
    static isTxId(id) {
        return /[a-z0-9_-]{43}/i.test(id);
    }
    /**
     * Formats the currency
     * @param amount balance to be formatted
     * @param decimalCount how many decimals to add
     * @param decimal string to separate decimals
     * @param thousands string to separate thousands
     */
    static formatNumber(amount, decimalCount = 0, decimal = '.', thousands = ',') {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
            const negativeSign = amount < 0 ? '-' : '';
            const i = parseInt(Math.abs(Number(amount) || 0).toFixed(decimalCount), 10).toString();
            const j = i.length > 3 ? i.length % 3 : 0;
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
    }
    /**
     * Formats a block number into human readable hours, days, months, years.
     * @param len block length
     */
    static formatBlocks(len = 720) {
        const hour = 30;
        const day = 720;
        const week = 720 * 7;
        const month = week * 4;
        const year = month * 12;
        let res = '';
        if (len >= year) {
            const years = Math.round(len / year);
            res = `~${years} ${years === 1 ? 'year' : 'years'}`;
        }
        else if (len >= month) {
            const months = Math.round(len / month);
            res = `~${months} ${months === 1 ? 'month' : 'months'}`;
        }
        else if (len >= day) {
            const days = Math.round(len / day);
            res = `~${days} ${days === 1 ? 'day' : 'days'}`;
        }
        else if (len >= hour) {
            const hours = Math.round(len / hour);
            res = `~${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        }
        else {
            res = '<1 hour';
        }
        return res;
    }
}
exports.default = Utils;
