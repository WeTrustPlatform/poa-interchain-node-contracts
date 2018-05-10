"use strict";

let utils = require('./../utils/utils');
let consts = require('./../utils/consts');
let web3Utils = require('web3-utils');
let mainchain = artifacts.require('MainChain.sol');

let mainchainInstance;
let txHashes = [];

for (let i = 0; i < 10; i++) {
  txHashes.push(web3Utils.soliditySha3('test' + i));
}

/**
 * Default values for testing each test cases
 */
let txHash;
let toAddress;
let value;
let data;
let version;

contract('MainChain: addBlackList Unit Test', function(accounts) {
  beforeEach(async function () {
    mainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);

    txHash = txHashes[0];
    toAddress = mainchainInstance.address;
    value = 0;
    data = '';
    version = await mainchainInstance.VERSION.call();
  });

  it("checks that addBlackList work as intended if all the condition are valid", async function () {
    // check NotFrozen
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    // check txNotBlackListed
    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.notOk(txBlackListed);

    // check oulyByWallet
    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    const sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // check txHash is added to blacklist successfully
    txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.ok(txBlackListed);
  });

  it("revert if not onlyByWallet", async function () {
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.notOk(txBlackListed);

    await utils.assertRevert(mainchainInstance.addBlackList(txHash, {from: accounts[0]}));

    txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.notOk(txBlackListed);
  });

  it("revert if tx is blacklisted", async function () {
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    let addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    let sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // check txHash is already blacklisted.
    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.ok(txBlackListed);

    // const data = mainchainInstance.contract.addBlackList.getData(txHash);
    sigs = utils.multipleSignedTransaction([0, 1], txHashes[1], toAddress, value, addBlackListData, version);
    const res = await mainchainInstance.submitTransaction(sigs.msgHash, txHashes[1], toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // only 'Execucion' event is excuted, 'addBlackList' is reverted.
    assert.equal(res.logs.length, 1);
  });

  it("checks that BlackListed event is emitted properly", async function () {
    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    const sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    const res = await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    assert.equal(res.logs[0].event, 'BlackListed');
  });
});
