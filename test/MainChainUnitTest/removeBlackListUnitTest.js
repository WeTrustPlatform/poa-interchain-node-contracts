'use strict';

let utils = require('./../utils/utils');
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
let version;
let contractAddress;

contract('MainChain: removeBlackList Unit Test', function(accounts) {
  beforeEach(async function() {
    mainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);

    txHash = txHashes[0];
    toAddress = mainchainInstance.address;
    value = 0;
    version = await mainchainInstance.VERSION.call();
    contractAddress = mainchainInstance.address;
    const addBlackListData = mainchainInstance.contract.addBlackList.getData(
      txHash,
    );
    const sigs = utils.multipleSignedTransaction(
      [0, 1],
      contractAddress,
      txHash,
      toAddress,
      value,
      addBlackListData,
      version,
    );
    await mainchainInstance.submitTransaction(
      txHash,
      toAddress,
      value,
      addBlackListData,
      sigs.v,
      sigs.r,
      sigs.s,
    );
  });

  it('checks that removeBlackList work as intended if all the condition are valid', async function() {
    // check NotFrozen
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    // check txBlackListed
    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.ok(txBlackListed);

    // check oulyByWallet
    const removeBlackListData = mainchainInstance.contract.removeBlackList.getData(
      txHash,
    );
    const removeBlackListSigs = utils.multipleSignedTransaction(
      [0, 1],
      contractAddress,
      txHashes[1],
      toAddress,
      value,
      removeBlackListData,
      version,
    );
    await mainchainInstance.submitTransaction(
      txHashes[1],
      toAddress,
      value,
      removeBlackListData,
      removeBlackListSigs.v,
      removeBlackListSigs.r,
      removeBlackListSigs.s,
      { from: accounts[0] },
    );

    // check txHash is removed from blacklist successfully
    txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.notOk(txBlackListed);
  });

  it('revert if not onlyByWallet', async function() {
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    let txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.ok(txBlackListed);

    await utils.assertRevert(
      mainchainInstance.removeBlackList(txHash, { from: accounts[0] }),
    );

    // check txHash is still blacklisted.
    txBlackListed = await mainchainInstance.isBlackListed.call(txHash);
    assert.ok(txBlackListed);
  });

  it('revert if tx is not blacklisted', async function() {
    const isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    // check txHashes[1] is not blacklisted.
    let txBlackListed = await mainchainInstance.isBlackListed.call(txHashes[1]);
    assert.notOk(txBlackListed);

    const removeBlackListData = mainchainInstance.contract.removeBlackList.getData(
      txHashes[1],
    );
    const removeBlackListSigs = utils.multipleSignedTransaction(
      [0, 1],
      contractAddress,
      txHashes[1],
      toAddress,
      value,
      removeBlackListData,
      version,
    );
    const res = await mainchainInstance.submitTransaction(
      txHashes[1],
      toAddress,
      value,
      removeBlackListData,
      removeBlackListSigs.v,
      removeBlackListSigs.r,
      removeBlackListSigs.s,
    );

    // only 'Execucion' event is excuted, 'removeBlackList' is reverted.
    assert.equal(res.logs.length, 1);
  });

  it('checks that UnBlackListed event is emitted properly', async function() {
    const removeBlackListData = mainchainInstance.contract.removeBlackList.getData(
      txHash,
    );
    const sigs1 = utils.multipleSignedTransaction(
      [0, 1],
      contractAddress,
      txHashes[1],
      toAddress,
      value,
      removeBlackListData,
      version,
    );
    const res = await mainchainInstance.submitTransaction(
      txHashes[1],
      toAddress,
      value,
      removeBlackListData,
      sigs1.v,
      sigs1.r,
      sigs1.s,
    );

    assert.equal(res.logs[0].event, 'UnBlackListed');
  });
});
