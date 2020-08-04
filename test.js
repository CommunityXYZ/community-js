const fs = require('fs');
const path = require('path');
const Arweave = require('arweave/node');

const wallet = {"kty":"RSA","ext":true,"e":"AQAB","n":"9K1BztCGQzmeaQMEBPG8Ky_L1sTJ4dX0cCcJNQTizp3VNsmdzGY5TIfBwXPqhvtqag-oRE8p_DmIXIFc_I05UUDxoVNMjDMQqacw2PL7Kdnsq2VJSZsW1Eczs4WIt8kSeJ2hWdWnIbolDGWyr9Oj2FGnEf_57ISkNBiFTsF2UZqBxXlq-XYDyhA2N94AS4m-FkEAobUmshfqub6pVhdR9KEfWgFx7c44IfuVd6lar4CmREqdLSLlC0NJii3bst1qRK-Hyy2vd2YDonTDjLD8AvVLW43E6vpkjvQ_N20z5iW4i6ii7sRC0glFHhTNjEnN1SzhxQTpPLvu0nPMLcgwu_bhf2GGZlH-XdBsdveyAXdlhPsjIGhlc7xjcFsB7juGs8wGzN64jRR9qnqOf4Mp3ifodbVG2GJhSXNb8S30wneOKJCBJKUSDmSZRnmK17q3BMcUvZzGaeB6FnqrGc-YMaTupxFNsMWCWKiK-R1Ism3py-XNJZhwCuYnJh4EkHi_gy0B2kgCsj6ALLnJ82HHse2qwxEkhjf9A8ZwxoL7RCUVa4utDOoUY3Xe9P9l6OnJ9mEb6jmgCF6LdkYKpmvPf_1xl16PU5ThA_KkQwsIMVJ9aITVokj1qGEWBwbo7QwT92KJTP3yYrfVDPkBMUUGLV7Ud4OThRqERqOsmNb6Y2E","d":"hSYDudggOFUSr3LErSwfiiDofGd6tTsJWj7j88ZE5stdTANLq_-1DsCR4ASEjBAlSLJcj0_FOUzVuAFt6MGxf1YoJ_J8pY7kcm5ZVrZjl9LPyDXGPBf5xGs652azj9AMDTc6pvhtix0RLD3rj2NMtls438K87sj_0pnFcaY2DRJXrG72l-pxBXTtDFnzLyg2GUYmYdmCxUfepFXtMLxgDQ_hT8mZhh_CzDtsi0HN59PKpz8zaWyj2A0158ws0plLSzV6YEbsRb1uHOoNwHJPsgxqhdgQYQ8BygmAnVj_9S5xzw5mHCkRc9s3kbcgZEeFi4xxEBYsFrDutffuFLvsSE0b_knNpqSWbccK221g28vz4Gxxqj0ZpI5Kpq4XuGjHfNNfdNXcE8Xktqpp5XYm4MM-stcaH0k5ktoNwNYR3s-7Uw8eu3Nd-WxX_zy6X2txsbCRVTp9956qRUFvm1IOiSW0_kJxLUWAf86JtWV7cpL-ITVZOQ3HJHgVEQ6FT9thtbkoQ1iX4XJPJxCVVQ4H9ILLBFn8vsX4AtolSKZmqRpr-PFECnqyt0W70s_XQYe8Riq0LYRHcoakqCBPHeOJEBF4txgtv5IxXWQgxYqyDXa-TkCkCQycKCe2FKRZVEF57nN8qXuZxzjA9ontwu3sivojPaxHGpkP5LGlTtb9uUE","p":"-1BsrCqc1lrR3U3De9ldfF5CrCX9KsCOPQS9YCb7iFoGhTHSoUL0cB5HZBbnPW5mMqKb1MdwaENsrMrNk9fSQjDr-eF2GUbhpii7Eg9gGy8heSsiu_7PcMx4QHFQQ-CxqqwarnlJMKozdhgMiIBGxA2DPGiLHnG9JIgxuNWy7jbQgJ9ok7ogNRSgA7Qc6LgdHL8E_kEQAfkzt1NoiFFCJSdsdg_5vjehMpBG8UfvS_kQoYfobMcqyZUOMvGK0DpHTWcnffjJ-J-EQBIxhh-EBPCKc60BxR0GBF6cKjkQ39fR0lfD0mRW9-ffw-BhW7Yy4Bkz2mi9fBvj6d8Mwsnpzw","q":"-T0mppJzyfzElrgB-1sop6ZaFIPsWfvwz4pr0z5ceQ-xyu-QT3v1bS8PXlvqu_BdWusw5DHWNW4rpr_OAvOOsIZym4yn3qXBvqi83ttk-ctwqwiwClUVPBjcDCLXM3EEQQVOFYo2uOxSHDbxwVapWViFZGiFEHHw9pzvxoen5r8-XhJN3W8WgA45cnb1zX8ybXbjl_3QdqBnh8NrcpJ3mRpN5CKPkAgLBFj0fTgmpRE6dRTPNKK49WJ9K9qHFol7HCqIkEX45nEqGFcyK0WIJLGyxrg8BFNf1iASWljbZ_hFZSjxn8JlqKsHOpwu7E1jTgxKyPI5bwOttiu4b_qbzw","dp":"GFTEALMrdhFa6isiNvZnd6gEmngfF6mG299-mjWL-rqEkRauxtAdrFEyJj2Va7wphtN5dNNOTbnhZqVH2_10LNZhslKixXW4WQbufaQhcOBSRFHpzfuwh8I0DkEqPTge22BIQQYbEOwZiWBwrjKFJ2wLfai9d1gZsNTCw5tk9G04KIvGay8E-T6i81jXx6wznVndGOShsR84Y5Jet3vuhHxZouCPFFx8bdHMHIYTY-6cLpdi6E0sFlIpCsOZ5ekOiC7pgue4XirLegyI4OxiMrw7G1Hvru7Na1Thl7DoslNJzCyVF-SBCwVXA7bQljmAmXO3Mnkbh02H9leS-7Tivw","dq":"XF4tVM4x20myEalgEqdWCcu81p2Nmkukk0XZcBBMdRE78tmVwd9OtYgbSf0GoWATOP6wv-E4YdTSmJm835sj5oftMXiPPhRwGRiv5meopGqg9sHhe_LMS9lqs5S17HqV-QLeTV1LqnzqcUprjhtv54zG4s9ZgR65DqxasFjWAM4fbv2Zndbtn8elwqYTsnTRW4AUGOAXwd7wf4AM8gkWCceV1lZ4nghdDN9qvH1y1PntkDaGFBu6MDav7PCv38pTtbyNn-pOtBh8YUjvbtn1-qNgfgUJOREtE04PfywvI_j-vt7NrUd-JWQ86Zu4SBrmEqa7kH00i8_xMPJDCDz4QQ","qi":"BDrsL6wd7xyk29sI7jjHG9IabFzunpVues4EmtkF36DfwxNHChgmFAcuoWfDjxZ3zYa2g6A2qZahwxXmrBMeD4leMuRa3rhOsBJR0jPfD6mBgciko4iyzFpk5qdaoK3wOUbA4IA3R7pUYIoaAqJgmtQlpSAoJe6Be1mc45uZzufCesG3SVCwEoV0BwNCIhjyWxWWX8DWR_JAxuNs4WytMEv7j4LoJau-AlGHuOBtKLlr5Nwn6tVB0VT0phgylUAxcgO3pJLXKVUhWPZlddhRr2vTqQz09ayR94AaT_H5YoJWvrYzW36SSl_YzlZM4GSQxyg2NxZxrykmgqUHBTudYQ"};

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

const file = fs.readFileSync(path.resolve(__dirname, 'src/__tests__/daogarden.js'));

async function createContract(arweave, wallet, contractSrc, initState) {
  let srcTx = await arweave.createTransaction({ data: contractSrc }, wallet);
  srcTx.addTag('App-Name', 'SmartWeaveContractSource');
  srcTx.addTag('App-Version', '0.3.0');
  srcTx.addTag('Content-Type', 'application/javascript');
  await arweave.transactions.sign(srcTx, wallet);
  const response = await arweave.transactions.post(srcTx);
  if ((response.status == 200) || (response.status == 208))
      return createContractFromTx(arweave, wallet, srcTx.id, initState);
  else
      throw new Error(`Unable to write Contract Source.`);
}

async function createContractFromTx(arweave, wallet, srcTxId, state) {
  // Create a contract from a stored source TXID, setting the default state.
  let contractTX = await arweave.createTransaction({ data: state }, wallet);
  contractTX.addTag('App-Name', 'SmartWeaveContract');
  contractTX.addTag('App-Version', '0.3.0');
  contractTX.addTag('Contract-Src', srcTxId);
  contractTX.addTag('Content-Type', 'application/json');

  await arweave.transactions.sign(contractTX, wallet);
  const response = await arweave.transactions.post(contractTX);
  if ((response.status == 200) || (response.status == 208))
      return contractTX.id;
  else
      throw new Error(`Unable to write Contract Initial State`);
}

(async () => {
  const addy = await arweave.wallets.jwkToAddress(wallet);
  let balances = {};
  balances[addy] = 1000000;

  const tx = await createContract(arweave, wallet, file.toString(), JSON.stringify({
    name: "DAO Garden",
    ticker: "GARDEN",
    balances,
    vault: {},
    votes: [],
    roles: [],
    quorum: 0.5,
    support: 0.5,
    voteLength: 2000,
    lockMinLength: 1000,
    lockMaxLength: 100000
  }), 0);

  console.log(tx);
})();