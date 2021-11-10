import Community from "../../src/community";
import Arweave from 'arweave';
// @ponicode
describe("inst.getFees", () => {
    jest.setTimeout(60000);

    let inst: Community;
    let arweave: Arweave;

    beforeEach(async () => {
        arweave = Arweave.init({
            host: 'arweave.net',
            protocol: 'https',
            port: 443
        });
        inst = new Community(arweave);
        await inst.setWallet(await arweave.wallets.generate());
        await inst.setState('asdf', 'asdf', { 'asdf': 0, 'asdf2': 1 }, 20, 50, 2000, 720, 720 * 5, { 'asdf': [{ balance: 0, start: 423, end: 554 }], 'asdf2': [{ balance: 1, start: 123, end: 4565 }, { balance: 5, start: 9282, end: 9999 }] }, [], {});
    })

    test("0", async () => {
        const fee = await inst.getFee();
        expect(typeof fee).toBe('string');
        expect(+fee).toBeGreaterThan(0);
    })

    test('getActionCost', async () => {
        const cost = await inst.getActionCost();
        expect(cost).toMatch(/\d+/);
    })
})
