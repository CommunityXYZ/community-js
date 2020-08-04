/**
 * These tests are under development,
 * if you're able to help on finding possibly a better way
 * or want to contribute to this file, please do!
 */

import Arweave from 'arweave/node';
import DAOGarden from '../daogarden';
import wallet from './testwallet';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

const pause = async (timeout = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
  });
};

// @ts-ignore
const daoGarden = new DAOGarden(arweave, wallet);
const testDAOTx = 'RRvgew0V1aQzlgY3olVi9WPLojBGNR_jrwDkfyXHtyI';
let addy = '';

beforeAll(async () => {
  addy = await arweave.wallets.jwkToAddress(wallet);
});

beforeEach(async () => {
  await daoGarden.setDAOTx(testDAOTx);
});

// it('should create a new DAO', async () => {
//   const daoName = Math.random().toString().split('.')[1];
  
//   const balances: any = {};
//   balances[addy] = +daoName;

//   const daoId = await daoGarden.createDAO(
//     daoName, 
//     daoName.substring(0, 3), 
//     balances,
//     50,
//     50,
//     2000,
//     720,
//     720,
//     {},
//     [],
//     {}
//     );

//     expect(daoId).toEqual(expect.stringMatching(/^[a-z0-9-_]{43}$/i));

//     await pause();

//     const res = await arweave.api.get(`/${daoId}`);
//     expect(res.data).toEqual({
//       name: daoName,
//       ticker: daoName.substring(0, 3),
//       balances,
//       quorum: 0.5,
//       support: 0.5,
//       voteLength: 2000,
//       lockMinLength: 720,
//       lockMaxLength: 720,
//       vault: {},
//       votes: [],
//       roles: {}
//     });
// });

describe('transfer', () => {
  it('should transfer balance between DAO members', async () => {
    const txId = await daoGarden.transfer(testDAOTx, 10000);
    expect(txId).toEqual(expect.stringMatching(/^[a-z0-9-_]{43}$/i));
  });

  it('should NOT transfer balance between the same account.', async () => {
    expect(async () => await daoGarden.transfer(addy, 10000)).toThrow('Invalid token transfer.');
  });
});
