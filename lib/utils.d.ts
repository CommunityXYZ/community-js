export default class Utils {
    /**
     * Trims object keys and values.
     * @param obj - Object to trim key/values
     */
    static trimObj(obj: any): any;
    /**
     * Checks if a string is a valid Arweave transaction ID.
     * @param id Transaction id.
     * @returns
     */
    static isTxId(id: string): boolean;
    /**
     * Formats the currency
     * @param amount balance to be formatted
     * @param decimalCount how many decimals to add
     * @param decimal string to separate decimals
     * @param thousands string to separate thousands
     */
    static formatNumber(amount: number, decimalCount?: number, decimal?: string, thousands?: string): string;
    /**
     * Formats a block number into human readable hours, days, months, years.
     * @param len block length
     */
    static formatBlocks(len?: number): string;
}
