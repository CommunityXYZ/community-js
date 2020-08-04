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
}
exports.default = Utils;
