import Arweave from "arweave";
import Arlocal from "arlocal"; // must be version 1.1.42 - it doesn't have /tx validation meaning sweets.clone would work
import Sweets from "arlocal-sweets";
import Community from "../../src/community";
import { JWKInterface } from "arweave/node/lib/wallet";
import Utils from "../../src/utils";

let arweave: Arweave;
let wallet: JWKInterface;
let address: string;
let community: Community;
let arlocal: Arlocal;
let port: number;
let sweets: Sweets;
let communityContract: string;

// mainnet contracts
let contractSrc: string = "ngMml4jmlxu0umpiQCsHgPX2pb_Yz6YDB8f7G6j-tpI";
let mainContract: string = "mzvUgNc8YFk0w5K5H7c8pyT-FC5Y_ba0r7_8766Kx74"; // mainnet community.xyz contract

jest.setTimeout(60000);
beforeAll(async () => {
    port = Math.floor(1000 + (Math.random() * 9000));
    arlocal = new Arlocal(port, false);
    await arlocal.start();

    arweave = Arweave.init({
        host: "localhost",
        port,
        protocol: "http"
    });
    wallet = await arweave.wallets.generate();
    address = await arweave.wallets.jwkToAddress(wallet);

    // @ts-ignore
    sweets = new Sweets(arweave, wallet);
    await sweets.fundWallet(1e58);
    await sweets.cloneTransaction(contractSrc);
    await sweets.cloneTransaction(mainContract);
    await sweets.mine();

    community = new Community(arweave, wallet, true);
    await community.setState(
        "xxxtestxxx",
        "xtx",
        {
            [address]: 100000
        }
    );
    communityContract = await community.create();
});

afterAll(async () => {
    // stop server
    await arlocal.stop();

    // garbage collector
    // @ts-ignore
    arlocal = undefined;
    // @ts-ignore
    wallet = undefined;
    // @ts-ignore
    address = undefined;
    // @ts-ignore
    community = undefined;
    // @ts-ignore
    port = undefined;
    // @ts-ignore
    sweets = undefined;
    // @ts-ignore
    communityContract = undefined;
    // @ts-ignore
    contractSrc = undefined;
    // @ts-ignore
    mainContract = undefined;
});

describe("community-js", () => {
    test("getState", async () => {
        const state = await community.getState();
        expect(state.name).toBeDefined();
        expect(state.ticker).toBeDefined();
        expect(state.balances).toBeDefined();
        expect(typeof state.name).toBe("string");
        expect(typeof state.ticker).toBe("string");
        expect(state.name).toEqual("xxxtestxxx");
        expect(state.ticker).toEqual("xtx");
        expect(state.balances[address]).toEqual(100000);
    });

    test("create", () => {
        expect(communityContract).toBeDefined();
        expect(typeof communityContract).toBe("string");
        expect(Utils.isTxId(communityContract)).toBeTruthy();
    });

    test("get", async () => {
        const state = await community.get({
            function: "balance"
        });

        expect(state).toBeDefined();
        expect(typeof state).toBe("object");
        expect(Object.keys(state)).toEqual([
            "target",
            "balance"
        ]);
        expect(typeof state.balance).toBe("number")
        expect(state.target).toEqual(await community.getWalletAddress());
    });

    test("getFee", async () => {
        const fee = await community.getFee();
        expect(fee).toBeDefined();
        expect(typeof fee).toBe("string");
        expect(parseFloat(fee)).not.toBeNaN();
    });

    test("getBalance", async () => {
        const balance = await community.getBalance();
        expect(balance).toBeDefined();
        expect(typeof balance).toBe("number");
        expect(balance).toEqual(100000);
    });

    test("getRole", async () => {
        try {
            // user has no role
            // role has to be set on this.setState
            await community.getRole();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test("transfer", async () => {
        const $wallet = await arweave.wallets.generate();
        const recipient = await arweave.wallets.jwkToAddress($wallet);
        const txid = await community.transfer(
            recipient,
            1000
        );
        expect(txid).toBeDefined();
        expect(typeof txid).toBe("string");
        expect(Utils.isTxId(txid)).toBeTruthy();

        await sweets.mine();
        const state = await community.getState();
        expect(state.balances[recipient]).toBe(1000);
        expect(state.balances[address]).toBe(100000 - 1000);
    });
});
