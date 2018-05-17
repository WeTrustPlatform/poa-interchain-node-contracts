"use strict";

let utils = require('./../utils/utils');
let consts = require('./../utils/consts');
let sidechain = artifacts.require('SideChain.sol');
let sidechainInstance;
let depositAmount;
let toAddress;

contract('SideChain: Deposit Unit Test', function(accounts) {
  beforeEach(async function () {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2, {from: accounts[0]});
    depositAmount = 1e8;
    toAddress = accounts[0];
  });

  it("checks that deposit work as intended if all the condition are valid", async function () {
    const contractBalance = web3.eth.getBalance(sidechainInstance.address);

    assert.equal(contractBalance.toNumber(), 0);
    await sidechainInstance.deposit(toAddress, {from: accounts[0], value: depositAmount});

    const newContractBalance = web3.eth.getBalance(sidechainInstance.address);
    assert.equal(newContractBalance.toNumber(), depositAmount);
  });

  it("revert if toAddress is zero address", async function () {
    toAddress = consts.ZERO_ADDRESS;
    utils.assertRevert(sidechainInstance.deposit(toAddress, {from: accounts[0], value: depositAmount}));

    toAddress = accounts[0];
    const res = await sidechainInstance.deposit(toAddress, {from: accounts[0], value: depositAmount});

    assert.equal(res.logs.length, 1);
  });

  it("revert if value is equal to 0", async function () {
    depositAmount = 0;
    utils.assertRevert(sidechainInstance.deposit(toAddress, {from: accounts[0], value: depositAmount}));

    depositAmount = 1e8;
    const res = await sidechainInstance.deposit(toAddress, {from: accounts[0], value: depositAmount});

    assert.equal(res.logs.length, 1);
  });

  it("checks that deposited event is emitted properly", async function () {
    const res = await sidechainInstance.deposit(toAddress, {from: accounts[0], value: depositAmount});
    const log = res.logs[0];
    assert.equal(log.event, 'Deposit');
    assert.equal(log.args.sender, accounts[0]);
    assert.equal(log.args.to, toAddress);
    assert.equal(log.args.value, depositAmount);
  });
});
