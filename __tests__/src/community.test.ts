import Community from "../../src/community";
import Arweave from 'arweave';
import { JWKInterface } from "arweave/node/lib/wallet";
// @ponicode
describe("inst.getFees", () => {
    jest.setTimeout(60000);

    let inst: Community;
    let wallet: JWKInterface;
    let address: string;
    let arweave: Arweave;
    let communityContract: string = "o1scF6NcdClxGzeivpAieSyUtc3me6QhK1H97YsAuns";

    beforeEach(async () => {
        arweave = Arweave.init({
            host: 'arweave.net',
            protocol: 'https',
            port: 443
        });
        wallet = await arweave.wallets.generate();
        address = await arweave.wallets.jwkToAddress(wallet);
        inst = new Community(arweave);
        await inst.setWallet(wallet);
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

    test("get", async () => {
        inst.setCommunityTx(await inst.getMainContractId());
        const res = await inst.get();
        expect(res.balance).toBeDefined();
        expect(res.target).toBeDefined();
    });

    test("create", async () => {
        await inst.setState(
            "xxtestxx",
            "xtx",
            {
                [address]: 100
            },
        );
        const txid = await inst.create();
        expect(txid).toBeDefined();
        expect(typeof txid).toBe("string");
    }, 1000 * 60 * 30);

    test("transfer", async () => {
        let target = await arweave.wallets.generate()
        let address = await arweave.wallets.jwkToAddress(target);

        await inst.setCommunityTx(communityContract);
        await inst.getState(); // this would call the private update() method, to update the community state
        let txid = await inst.transfer(
            address,
            10
        );

        expect(txid).toBeDefined();
        expect(typeof txid).toBe("string");
    });
})
