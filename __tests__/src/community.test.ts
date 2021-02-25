import Community from "../../src/community";
import Arweave from 'arweave';
// @ponicode
describe("inst.getFees", () => {
    let inst: Community;
    let arweave: Arweave;

    beforeEach(() => {
        arweave = Arweave.init({
            host: 'arweave.net',
            protocol: 'https',
            port: 443
        });
        inst = new Community(arweave);
    })

    test("0", async () => {
        jest.setTimeout(60000)
        const fees = await inst.getFees();
        expect(fees).toBeInstanceOf(Object);
        expect(fees.txFee).toBeGreaterThan(0);
        expect(fees.createFee).toBeGreaterThan(0);
        expect(fees.createFee).toBeGreaterThan(fees.txFee);
    })
})
