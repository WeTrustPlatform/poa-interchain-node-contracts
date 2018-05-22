'use strict';

let utils = require('./../utils/utils');
let web3Utils = require('web3-utils');
let sidechain = artifacts.require('SideChain.sol');

let sidechainInstance;
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

contract('SideChain: executeTransaction Unit Test', function(accounts) {
  beforeEach(async function() {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2);

    txHash = txHashes[0];
    toAddress = accounts[0];
    value = 1e6;
    data = '';
  });

  it('checks that executeTransaction works as intended if all the condition are valid', async function() {
    let depositAmount = 1e5;
    await sidechainInstance.deposit(accounts[0], {
      from: accounts[0],
      value: depositAmount
    });

    let withdrawAmount = 1e6;

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      withdrawAmount,
      data,
      { from: accounts[0] }
    );
    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      withdrawAmount,
      data,
      { from: accounts[1] }
    );

    // check that txHash hasn't been executed.
    let sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);
    assert.equal(sideChainTx[4], false);

    depositAmount = 1e6;
    await sidechainInstance.deposit(accounts[0], {
      from: accounts[0],
      value: depositAmount
    });
    const contractBalance = web3.eth.getBalance(sidechainInstance.address);
    assert.isAbove(contractBalance.toNumber(), withdrawAmount);

    // checks that Execution event is emitted properly
    const res = await sidechainInstance.executeTransaction(txHash);
    assert.equal(res.logs[0].event, 'Execution');

    // check that txHash has been executed.
    sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);
    assert.equal(sideChainTx[4], true);
  });

  it('revert if tx has already been executed', async function() {
    const depositAmount = 1e7;
    await sidechainInstance.deposit(accounts[0], {
      from: accounts[0],
      value: depositAmount
    });

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[1] }
    );

    // check that txHash has been executed.
    const sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);
    assert.equal(sideChainTx[4], true);

    await utils.assertRevert(sidechainInstance.executeTransaction(txHash));
  });

  it('checks that ExecutionFailure event is emitted properly', async function() {
    const depositAmount = 1e7;
    await sidechainInstance.deposit(accounts[0], {
      from: accounts[0],
      value: depositAmount
    });

    let withdrawAmount = 1e8;

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      withdrawAmount,
      data,
      { from: accounts[0] }
    );

    const res = await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      withdrawAmount,
      data,
      { from: accounts[1] }
    );

    assert.equal(res.logs[1].event, 'ExecutionFailure');
  });
});
