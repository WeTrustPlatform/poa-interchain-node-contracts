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
let addBlackListData;
let sigs;
let res;

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
    assert.equal(txBlackListed, false);

    // check oulyByWallet
    addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // check txHash is added to blacklist successfully
    txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.equal(txBlackListed, true);
  });

  it("revert if not onlyByWallet", async function () {
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.equal(txBlackListed, false);

    const mainchainInstance1 = await mainchain.new(accounts.slice(0, 3), 2);
    toAddress = mainchainInstance1.address;

    addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    res = await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // only 'Execucion' event is excuted, 'addBlackList' is reverted.
    assert.equal(res.logs.length, 1);
    // check txHash is not blacklisted.
    txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.equal(txBlackListed, false);
  });

  it("revert if tx is blacklisted", async function () {
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // check txHash is already blacklisted.
    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.equal(txBlackListed, true);

    const txHash1 = txHashes[1];
    const addBlackListData1 = mainchainInstance.contract.addBlackList.getData(txHash);
    const sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, addBlackListData1, version);
    res = await mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, addBlackListData, sigs1.v, sigs1.r, sigs1.s);

    // only 'Execucion' event is excuted, 'addBlackList' is reverted.
    assert.equal(res.logs.length, 1);
  });

  it("checks that BlackListed event is emitted properly", async function () {
    addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    res = await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    assert.equal(res.logs[0].event, 'BlackListed');
  });
});
