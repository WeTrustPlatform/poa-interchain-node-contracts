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

    await sidechainInstance.deposit(accounts[0], {
      from: accounts[0],
      value
    });
  });

  it('checks that executeTransaction works as intended if all the condition are valid', async function() {
    const withdrawAmount = value + 1;

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
    assert.equal(sideChainTx[4], false); // sideChainTx[4] is executed flag

    await sidechainInstance.deposit(accounts[0], {
      from: accounts[0],
      value
    });

    const contractBalance = web3.eth.getBalance(sidechainInstance.address);
    assert.isAbove(contractBalance.toNumber(), withdrawAmount);

    // checks that Execution event is emitted properly
    const res = await sidechainInstance.executeTransaction(txHash);
    assert.equal(res.logs[0].event, 'Execution');

    // check that txHash has been executed.
    sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);
    assert.equal(sideChainTx[4], true); // sideChainTx[4] is executed flag
  });

  it('revert if tx has already been executed', async function() {
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
    assert.equal(sideChainTx[4], true); // sideChainTx[4] is executed flag

    await utils.assertRevert(sidechainInstance.executeTransaction(txHash));
  });

  it('checks that ExecutionFailure event is emitted properly', async function() {
    const withdrawAmount = value + 1;

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
