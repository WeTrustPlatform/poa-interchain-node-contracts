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
let txHash1;
let toAddress;
let value;
let data;
let version;
let removeBlackListData;
let sigs1;
let res;

contract('MainChain: removeBlackList Unit Test', function(accounts) {
  beforeEach(async function () {
    mainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);

    txHash = txHashes[0];
    txHash1 = txHashes[1];
    toAddress = mainchainInstance.address;
    value = 0;
    data = '';
    version = await mainchainInstance.VERSION.call();
    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    const sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);
  });

  it("checks that removeBlackList work as intended if all the condition are valid", async function () {
    // check NotFrozen
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    // check txBlackListed
    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.equal(txBlackListed, true);

    // check oulyByWallet
    removeBlackListData = mainchainInstance.contract.removeBlackList.getData(txHash);
    sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, removeBlackListData, version);
    await mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, removeBlackListData, sigs1.v, sigs1.r, sigs1.s, {from: accounts[0]});

    // check txHash is removed from blacklist successfully
    txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.equal(txBlackListed, false);
  });

  it("revert if not onlyByWallet", async function () {
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.equal(txBlackListed, true);

    await utils.assertRevert(mainchainInstance.removeBlackList(txHash, {from: accounts[0]}));

    // check txHash is still blacklisted.
    txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.equal(txBlackListed, true);
  });

  it("revert if tx is not blacklisted", async function () {
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    // check txHash1 is not blacklisted.
    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash1);
    assert.equal(txBlackListed, false);

    removeBlackListData = mainchainInstance.contract.removeBlackList.getData(txHash1);
    sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, removeBlackListData, version);
    res = await mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, removeBlackListData, sigs1.v, sigs1.r, sigs1.s);

    // only 'Execucion' event is excuted, 'removeBlackList' is reverted.
    assert.equal(res.logs.length, 1);
  });

  it("checks that UnBlackListed event is emitted properly", async function () {
    removeBlackListData = mainchainInstance.contract.removeBlackList.getData(txHash);
    sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, removeBlackListData, version);
    res = await mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, removeBlackListData, sigs1.v, sigs1.r, sigs1.s);

    assert.equal(res.logs[0].event, 'UnBlackListed');
  });
});
