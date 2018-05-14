"use strict";

let utils = require('./../utils/utils');
let consts = require('./../utils/consts');
let web3Utils = require('web3-utils');
let mainchain = artifacts.require('MainChain.sol');
let MultiSigOwnable = artifacts.require('test/TestMultiSigOwnable.sol');
let exampleToken = artifacts.require('./test/ExampleToken.sol');

let mainchainInstance;
let destinationMainchainInstance;
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

contract('MainChain: emergencyWithdrawal Unit Test', function(accounts) {
  beforeEach(async function () {
    mainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);
    destinationMainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);
    await mainchainInstance.deposit(accounts[0], {from: accounts[0], value: 1e7});

    exampleTokenInstance = await exampleToken.new(accounts.slice(0, 4));

    txHash = txHashes[0];
    value = 1e7;
    data = '';
    toAddress = destinationMainchainInstance.address;
    version = await mainchainInstance.VERSION.call();
  });

  it("checks that ETH emergency withdrawal works as intended if all the conditions are valid", async function () {
    const contractBalanceBefore = web3.eth.getBalance(mainchainInstance.address);
    const desContractBalanceBefore = web3.eth.getBalance(toAddress);

    // check mainchainInstance is fronzen.
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);
    await mainchainInstance.freeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    // need approvals from 2 owners.
    const transferEncodedData = mainchainInstance.contract.deposit.getData(toAddress, {from: mainchainInstance.address, value});
    await mainchainInstance.emergencyWithdrawal(toAddress, value, transferEncodedData, {from: accounts[0]});
    const res = await mainchainInstance.emergencyWithdrawal(toAddress, value, transferEncodedData, {from: accounts[1]});

    // check funds has been moved from mainchainInstance to destinationMainchainInstance.
    const contractBalanceAfter = web3.eth.getBalance(mainchainInstance.address);
    const desContractBalanceAfter = web3.eth.getBalance(toAddress);

    assert.equal(contractBalanceBefore - contractBalanceAfter, value);
    assert.equal(desContractBalanceAfter - desContractBalanceBefore, value);
  });

  it("checks that ERC20 Token emergency withdrawal works as intended if all the condition are valid", async function () {
    // send 1e7 exampleToken to the mainchainInstance first
    await exampleTokenInstance.transfer(mainchainInstance.address, 10000, {from: accounts[0]});
    const contractBalanceBefore = await exampleTokenInstance.balanceOf.call(mainchainInstance.address);
    const desContractBalanceBefore = await exampleTokenInstance.balanceOf.call(toAddress);

    console.log(contractBalanceBefore);
    console.log(desContractBalanceBefore);

    // check mainchainInstance is fronzen.
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);
    await mainchainInstance.freeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    // need approvals from 2 owners.
    const transferEncodedData = exampleTokenInstance.contract.transfer.getData(toAddress, 100);
    console.log(transferEncodedData);


    await mainchainInstance.emergencyWithdrawal(toAddress, 0, transferEncodedData, {from: accounts[0]});
    const res = await mainchainInstance.emergencyWithdrawal(toAddress, 0, transferEncodedData, {from: accounts[1]});

    // check EmergencyWithdrawal event is fired.
    assert.equal(res.logs[1].event, 'EmergencyWithdrawal');

    // check funds has been moved from mainchainInstance to destinationMainchainInstance.
    const contractBalanceAfter = await exampleTokenInstance.balanceOf.call(mainchainInstance.address);
    const desContractBalanceAfter = await exampleTokenInstance.balanceOf.call(toAddress);

    console.log(contractBalanceAfter);
    console.log(desContractBalanceAfter);

    assert.equal(contractBalanceBefore - contractBalanceAfter, value);
    assert.equal(desContractBalanceAfter - desContractBalanceBefore, value);
  });


  it("revert if contract is not frozen", async function () {
    // check mainchainInstance is not frozen.
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    const transferEncodedData = mainchainInstance.contract.deposit.getData(toAddress, {from: mainchainInstance.address, value});
    await utils.assertRevert(mainchainInstance.emergencyWithdrawal(toAddress, value, transferEncodedData, {from: accounts[0]}));
  });

  it("revert if msg.sender is not owner", async function () {
    // check mainchainInstance is fronzen.
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);
    await mainchainInstance.freeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    // one less signature than required
    const transferEncodedData = mainchainInstance.contract.deposit.getData(toAddress, {from: mainchainInstance.address, value});
    await utils.assertRevert(mainchainInstance.emergencyWithdrawal(toAddress, value, transferEncodedData, {from: accounts[5]}));
  });

  it("revert if there aren't enough valid signatures", async function () {
    // check mainchainInstance is fronzen.
    let isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);
    await mainchainInstance.freeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    // two of the same signature
    const transferEncodedData = mainchainInstance.contract.deposit.getData(toAddress, {from: mainchainInstance.address, value});
    await mainchainInstance.emergencyWithdrawal(toAddress, value, transferEncodedData, {from: accounts[0]});
    await utils.assertRevert(mainchainInstance.emergencyWithdrawal(toAddress, value, transferEncodedData, {from: accounts[0]}));
  });
});
