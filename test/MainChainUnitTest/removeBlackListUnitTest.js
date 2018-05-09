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

contract('MainChain: removeBlackList Unit Test', function(accounts) {
  beforeEach(async function () {
    mainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);

    txHash = txHashes[0];
    toAddress = mainchainInstance.contract.address;
    value = 0;
    data = '';
    version = await mainchainInstance.VERSION.call();
    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    let sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);
  });

  it("checks that removeBlackList work as intended if all the condition are valid", async function () {
    // check NotFrozen
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    // check txBlackListed
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), true);

    // check oulyByWallet
    let txHash1 = txHashes[1];
    const removeBlackListData = mainchainInstance.contract.removeBlackList.getData(txHash);
    let sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, removeBlackListData, version);
    await mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, removeBlackListData, sigs1.v, sigs1.r, sigs1.s, {from: accounts[0]});

    // check txHash is removed from blacklist successfully
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), false);
  });

  it("revert if not onlyByWallet", async function () {
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), true);

    toAddress = accounts[0];
    let txHash1 = txHashes[1];

    const removeBlackListData = mainchainInstance.contract.removeBlackList.getData(txHash);
    let sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, removeBlackListData, version);
    let res = await mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, removeBlackListData, sigs1.v, sigs1.r, sigs1.s);

    // only 'Execucion' event is excuted, 'removeBlackList' is reverted.
    assert.equal(res.logs.length, 1);
  });

  it("revert if tx is not blacklisted", async function () {
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);
    let txHash1 = txHashes[1];

    // check txHash is not blacklisted.
    assert.equal(await mainchainInstance.isBlackListed.call(txHash1), false);

    const removeBlackListData = mainchainInstance.contract.removeBlackList.getData(txHash1);
    let sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, removeBlackListData, version);
    let res = await mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, removeBlackListData, sigs1.v, sigs1.r, sigs1.s);

    // only 'Execucion' event is excuted, 'removeBlackList' is reverted.
    assert.equal(res.logs.length, 1);
  });

  it("revert if contract is frozen", async function () {
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), true);
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    await mainchainInstance.freeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    let txHash1 = txHashes[1];

    const removeBlackListData = mainchainInstance.contract.removeBlackList.getData(txHash);
    let sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, removeBlackListData, version);

    await utils.assertRevert(mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, removeBlackListData, sigs1.v, sigs1.r, sigs1.s));
  });

  it("checks that UnBlackListed event is emitted properly", async function () {
    let txHash1 = txHashes[1];
    const removeBlackListData = mainchainInstance.contract.removeBlackList.getData(txHash);
    let sigs1 = utils.multipleSignedTransaction([0, 1], txHash1, toAddress, value, removeBlackListData, version);
    let res = await mainchainInstance.submitTransaction(sigs1.msgHash, txHash1, toAddress, value, removeBlackListData, sigs1.v, sigs1.r, sigs1.s);

    assert.equal(res.logs[0].event, 'UnBlackListed');
  });
});
