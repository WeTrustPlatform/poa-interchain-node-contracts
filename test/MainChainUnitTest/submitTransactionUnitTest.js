"use strict";

let utils = require('./../utils/utils');
let consts = require('./../utils/consts');
let web3Utils = require('web3-utils');
let mainchain = artifacts.require('MainChain.sol');
let exampleToken = artifacts.require('./test/ExampleToken.sol');

let mainchainInstance;
let exampleTokenInstance;
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
let sigs;
let version;
let contractAddress;


contract('MainChain: submitTransaction Unit Test', function(accounts) {
  beforeEach(async function () {
    mainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);
    await mainchainInstance.deposit(accounts[0], {from: accounts[0], value: 1e7}); // put 0.1 ether in so we can test withdrawal

    exampleTokenInstance = await exampleToken.new(accounts.slice(0, 4));

    txHash = txHashes[0];
    toAddress = accounts[1];
    value = 1e6;
    data = '';
    version = await mainchainInstance.VERSION.call();
    contractAddress = mainchainInstance.address;
  });

  it("checks that ETH withdrawal works as intended if all the condition are valid", async function () {
    const user = '0x641cB10d9676e1E2B84d427ea160cE0866C01D20'; // an arbitary account that does not have any balance
    const userBalanceBefore = web3.eth.getBalance(user);
    const contractBalanceBefore = web3.eth.getBalance(mainchainInstance.address);

    toAddress = user;
    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    const res = await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s, {from: accounts[0], gas: 1e6});

    const userBalanceAfter = web3.eth.getBalance(user);
    const contractBalanceAfter = web3.eth.getBalance(mainchainInstance.address);

    assert.equal(contractBalanceBefore - contractBalanceAfter, value);
    assert.equal(userBalanceAfter - userBalanceBefore, value);
  });

  it("checks that ERC20 Token withdrawal works as intended if all the condition are valid", async function () {
    const user = accounts[5];

    // send some eth to the mainchainInstance first
    await exampleTokenInstance.transfer(mainchainInstance.address, 1e8, {from: accounts[0]});

    const tokenAmount = 1000;
    const tokenTransferEncodedData = exampleTokenInstance.contract.transfer.getData(user, tokenAmount);

    toAddress = exampleTokenInstance.address;
    value = 0;
    data = tokenTransferEncodedData;

    const userBalanceBefore = await exampleTokenInstance.balanceOf.call(user);
    const contractBalanceBefore = await exampleTokenInstance.balanceOf.call(mainchainInstance.address);

    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);

    const userBalanceAfter = await exampleTokenInstance.balanceOf.call(user);
    const contractBalanceAfter = await exampleTokenInstance.balanceOf.call(mainchainInstance.address);

    assert.equal(contractBalanceBefore - contractBalanceAfter, tokenAmount);
    assert.equal(userBalanceAfter - userBalanceBefore, tokenAmount);
  });

  it("checks that external_call is working properly by calling different functions", async function () {
    let isUserAnOwner = await mainchainInstance.isOwner(accounts[9]);

    assert.notOk(isUserAnOwner);

    // First try to call Add Owner
    data = mainchainInstance.contract.addOwner.getData(accounts[9]);
    toAddress = mainchainInstance.address;
    value = 0;
    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    let res = await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);
    let log = res.logs[0];

    assert.equal(log.event, 'OwnerAddition');

    isUserAnOwner = await mainchainInstance.isOwner(accounts[9]);

    assert.ok(isUserAnOwner);

    // Try to remove the Added Owner
    data = mainchainInstance.contract.removeOwner.getData(accounts[9]);
    txHash = txHashes[1]; // we need to use a different txHash for this to succeed
    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    res = await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);
    log = res.logs[0];

    assert.equal(log.event, 'OwnerRemoval');

    isUserAnOwner = await mainchainInstance.isOwner(accounts[9]);

    assert.notOk(isUserAnOwner);

  });

  it("checks that transactions are added properly when it is executed", async function () {
    let transaction = await mainchainInstance.transactions.call(txHash);

    //first check that txHash is empty
    assert.equal(transaction[0], consts.ZERO_ADDRESS);
    assert.equal(transaction[1].toNumber(), '0');
    assert.equal(transaction[2], '0x');


    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);

    transaction = await mainchainInstance.transactions.call(txHash);

    assert.equal(transaction[0], toAddress);
    assert.equal(transaction[1].toNumber(), value);
    assert.equal(transaction[2], '0x' + data);

  });

  it("revert if transaction Hash already exits", async function () {
    await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);

    await utils.assertRevert(mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s));
  });

  it("revert if transaction Hash is blackListed", async function () {
    // add txHash to blackList.
    const txHashToBlackList = txHashes[1];
    const addBlackListData = mainchainInstance.contract.addBlackList.getData(txHash);
    const addBlackListSigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHashToBlackList, mainchainInstance.contract.address, 0, addBlackListData, version);
    await mainchainInstance.submitTransaction(txHashToBlackList, mainchainInstance.contract.address, 0, addBlackListData, addBlackListSigs.v, addBlackListSigs.r, addBlackListSigs.s);
    let istxBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.ok(istxBlackListed);

    // try to withdraw 1e6.
    const user = '0x641cB10d9676e1E2B84d427ea160cE0866C01D20'; // an arbitary account that does not have any balance
    const userBalanceBefore = web3.eth.getBalance(user);
    const contractBalanceBefore = web3.eth.getBalance(mainchainInstance.address);
    toAddress = user;
    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);

    // check transaction is reverted.
    utils.assertRevert(mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s, {from: accounts[0], gas: 1e6}));

    const userBalanceAfter = web3.eth.getBalance(user);
    const contractBalanceAfter = web3.eth.getBalance(mainchainInstance.address);

    assert.equal(contractBalanceBefore - contractBalanceAfter, 0);
    assert.equal(userBalanceAfter - userBalanceBefore, 0);
  });

  it("revert if contract is frozen", async function () {
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    await mainchainInstance.freeze({from: accounts[0]});
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    await utils.assertRevert(mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s));
  });

  it("revert if number of signatures are less than required", async function () {
    // one less signature than required
    sigs = utils.multipleSignedTransaction([0], contractAddress, txHash, toAddress, value, data, version);
    await utils.assertRevert(mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s));

    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);
  });


  it("revert if there aren't enough valid signatures", async function () {
    // two of the same signature
    sigs = utils.multipleSignedTransaction([0, 0], contractAddress, txHash, toAddress, value, data, version);
    await utils.assertRevert(mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s));

    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);
  });

  it("checks that Execution event is emitted properly", async function () {
    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    const res = await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);
    const log = res.logs[0];

    assert.equal(log.event, 'Execution');
  });

  it("checks that ExecutionFailure event is emitted properly", async function () {
    value = 1e8; // try to withdraw more than the contract holds

    sigs = utils.multipleSignedTransaction([0, 1], contractAddress, txHash, toAddress, value, data, version);
    const res = await mainchainInstance.submitTransaction(txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s);
    const log = res.logs[0];

    assert.equal(log.event, 'ExecutionFailure');
  });
});
