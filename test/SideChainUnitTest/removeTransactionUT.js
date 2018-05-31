'use strict';

let web3Utils = require('web3-utils');
let sidechain = artifacts.require('SideChain.sol');
let consts = require('./../utils/consts');
let utils = require('./../utils/utils');

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

contract('SideChain: removeTransactionSC Unit Test', function(accounts) {
  beforeEach(async function() {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2);
    txHash = txHashes[0];
    toAddress = sidechainInstance.address;
    value = 0;
    data = '';
  });

  it('checks that removeTransactionSC works as intended', async function() {
    // check txHash has been added to sideChainTx.
    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    let sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);

    assert.equal(sideChainTx[1], toAddress); // sideChainTx[1] is the transaction target address.

    const removeTranscationSCData = sidechainInstance.contract.removeTransactionSC.getData(
      txHash
    );

    txHash = txHashes[1];

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      removeTranscationSCData,
      { from: accounts[0] }
    );

    const res = await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      removeTranscationSCData,
      { from: accounts[1] }
    );

    // check that txHash has been removed from sideChainTx
    sideChainTx = await sidechainInstance.contract.sideChainTx.call(
      txHashes[0]
    );
    assert.equal(sideChainTx[1], consts.ZERO_ADDRESS); // sideChainTx[1] is the transaction target address.

    // check TransactionRemoved event is emitted.
    assert.equal(res.logs[1].event, 'TransactionRemoved');
  });

  it('revert if not onlyByWallet', async function() {
    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    let sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);

    assert.equal(sideChainTx[1], toAddress); // sideChainTx[1] is the transaction target address.

    await utils.assertRevert(
      sidechainInstance.removeTransactionSC(txHash, { from: accounts[0] })
    );

    // check that txHash hasn't been removed from sideChainTx
    sideChainTx = await sidechainInstance.contract.sideChainTx.call(
      txHashes[0]
    );
    assert.equal(sideChainTx[1], toAddress); // sideChainTx[1] is the transaction target address.
  });

  it('revert if transaction has executed', async function() {
    data = sidechainInstance.contract.addOwner.getData(accounts[9]);
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

    // check transaction has executed.
    let sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);

    assert.equal(sideChainTx[4], true); // sideChainTx[4] is sideChainTx[txHash].excuted.

    const removeTranscationSCData = sidechainInstance.contract.removeTransactionSC.getData(
      txHash
    );

    txHash = txHashes[1];

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      removeTranscationSCData,
      { from: accounts[0] }
    );

    const res = await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      removeTranscationSCData,
      { from: accounts[1] }
    );

    // check that ExecutionFailure is emitted because of removeTransactionSC is reverted.
    assert.equal(res.logs[1].event, 'ExecutionFailure');
    sideChainTx = await sidechainInstance.contract.sideChainTx.call(
      txHashes[0]
    );
    assert.equal(sideChainTx[1], toAddress); // sideChainTx[1] is the transaction target address.
  });
});
