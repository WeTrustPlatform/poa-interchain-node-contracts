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
    toAddress = mainchainInstance.contract.address;
    value = 0;
    data = '';
    version = await mainchainInstance.VERSION.call();
  });

  it("checks that addBlackList work as intended if all the condition are valid", async function () {
    // check NotFrozen
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    // check txNotBlackListed
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), false);

    // check oulyByWallet
    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    let sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // check txHash is added to blacklist successfully
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), true);
  });

  it("revert if not onlyByWallet", async function () {
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), false);

    toAddress = accounts[0];

    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    let sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    let res = await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // only 'Execucion' event is excuted, 'addBlackList' is reverted.
    assert.equal(res.logs.length, 1);
  });

  it("revert if tx is blacklisted", async function () {
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    let sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    // check txHash is already blacklisted.
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), true);

    const addBlackListData1 = mainchainInstance.contract.addBlackList.getData(txHash);
    let sigs1 = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData1, version);

    await utils.assertRevert(mainchainInstance.submitTransaction(sigs1.msgHash, txHash, toAddress, value, addBlackListData1, sigs1.v, sigs1.r, sigs1.s));
  });

  it("revert if contract is frozen", async function () {
    assert.equal(await mainchainInstance.isBlackListed.call(txHash), false);
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    await mainchainInstance.freeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    let sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);

    await utils.assertRevert(mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s));
  });

  it("checks that BlackListed event is emitted properly", async function () {
    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    let sigs = utils.multipleSignedTransaction([0, 1], txHash, toAddress, value, addBlackListData, version);
    let res = await mainchainInstance.submitTransaction(sigs.msgHash, txHash, toAddress, value, addBlackListData, sigs.v, sigs.r, sigs.s);

    assert.equal(res.logs[0].event, 'BlackListed');
  });
});
