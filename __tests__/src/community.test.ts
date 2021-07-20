import Arweave from 'arweave';
import Community from "../../src/community";

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
        await inst.setState('asdf', 'asdf', {'asdf': 0, 'asdf2': 1}, 20, 50, 2000, 720, 720*5, {'asdf': [{balance: 0, start: 423, end: 554}], 'asdf2': [{balance: 1, start: 123, end: 4565}, {balance: 5, start: 9282, end: 9999}]}, [], {});
    })

    test("0", async () => {
        const fees = await inst.getFees();
        expect(fees).toBeInstanceOf(Object);
        expect(fees.txFee).toBeGreaterThan(0);
        expect(fees.createFee).toBeGreaterThan(0);
        expect(fees.createFee).toBeGreaterThan(fees.txFee);
    })

    test('getActionCost', async () => {
        const cost = await inst.getActionCost();
        expect(cost).toMatch(/\d+/);
    })
})
