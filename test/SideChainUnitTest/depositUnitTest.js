"use strict";

let utils = require('./../utils/utils');
let sidechain = artifacts.require('SideChain.sol');
let sidechainInstance;

contract('SideChain: Deposit Unit Test', function(accounts) {
  beforeEach(async function () {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2, {from: accounts[0]});
  });

  it("checks that deposit work as intended if all the condition are valid", async function () {
    const contractBalance = web3.eth.getBalance(sidechainInstance.address);

    assert.equal(contractBalance.toNumber(), 0);
    await sidechainInstance.deposit(accounts[0], {from: accounts[0], value: 1e8 });

    const newContractBalance = web3.eth.getBalance(sidechainInstance.address);
    assert.equal(newContractBalance.toNumber(), 1e8);
  });

  it("revert if to address is null", async function () {
    utils.assertRevert(sidechainInstance.deposit(0, {from: accounts[0], value: 1e8}));
    const res = await sidechainInstance.deposit(accounts[0], {from: accounts[0], value: 1e8 });

    assert.equal(res.logs.length, 1);
  });

  it("revert if value is equal to 0", async function () {
    utils.assertRevert(sidechainInstance.deposit(accounts[0], {from: accounts[0], value: 0}));
    const res = await sidechainInstance.deposit(accounts[0], {from: accounts[0], value: 1e8 });

    assert.equal(res.logs.length, 1);
  });

  it("checks that deposited event is emitted properly", async function () {
    const res = await sidechainInstance.deposit(accounts[0], {from: accounts[0], value: 1e8 });
    const log = res.logs[0];

    assert.equal(log.event, 'Deposit');
  });
});
