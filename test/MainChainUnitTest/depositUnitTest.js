"use strict";

let utils = require('./../utils/utils');
let mainchain = artifacts.require('MainChain.sol');
let mainchainInstance;

contract('MainChain: Deposit Unit Test', function(accounts) {

  beforeEach(async function () {
    mainchainInstance = await mainchain.new(accounts.slice(0, 3), 2, {from: accounts[0]});
  });

  it("checks that deposit work as intended if all the condition are valid", async function () {
    const contractBalance = web3.eth.getBalance(mainchainInstance.address);

    assert.equal(contractBalance.toNumber(), 0);
    await mainchainInstance.deposit(accounts[0], {from: accounts[0], value: 1e8 });

    const newContractBalance = web3.eth.getBalance(mainchainInstance.address);
    assert.equal(newContractBalance.toNumber(), 1e8);
  });

  it("revert if to address is null", async function () {
    utils.assertRevert(mainchainInstance.deposit(0, {from: accounts[0], value: 1e8}));
    const res = await mainchainInstance.deposit(accounts[0], {from: accounts[0], value: 1e8 });

    assert.equal(res.logs.length, 1);
  });

  it("revert if value is equal to 0", async function () {
    utils.assertRevert(mainchainInstance.deposit(accounts[0], {from: accounts[0], value: 0}));
    const res = await mainchainInstance.deposit(accounts[0], {from: accounts[0], value: 1e8 });

    assert.equal(res.logs.length, 1);
  });

  it("checks that deposited event is emitted properly", async function () {
    const res = await mainchainInstance.deposit(accounts[0], {from: accounts[0], value: 1e8 });
    const log = res.logs[0];

    assert.equal(log.event, 'Deposit');
  });

});
