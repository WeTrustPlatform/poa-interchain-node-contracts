'use strict';

let utils = require('./../utils/utils');
let web3Utils = require('web3-utils');
let sidechain = artifacts.require('SideChain.sol');

let sidechainInstance;
let txHashes = [];
let txHash;
let toAddress;
let value;
let data;

for (let i = 0; i < 10; i++) {
  txHashes.push(web3Utils.soliditySha3('test' + i));
}

contract('SideChain: revokeConfirmation Unit Test', function(accounts) {
  beforeEach(async function() {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2);
    txHash = txHashes[0];
    toAddress = accounts[1];

    value = 1e6;
    data = '';
  });

  it('checks that revokeConfirmation work as intended if all the condition are valid', async function() {
    const owner = accounts[0];

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    // check that txHash has been successfully signed by owner.
    let isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      owner
    );
    assert.ok(isSignedSC);

    // check that txHash hasn't been executed.
    const sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);
    assert.equal(sideChainTx[4], false);

    // check that Revocation event is emitted properly
    const res = await sidechainInstance.revokeConfirmation(txHash, {
      from: accounts[0]
    });
    assert.equal(res.logs[0].event, 'Revocation');

    // check that confirmatoin has been removed.
    isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      owner
    );
    assert.notOk(isSignedSC);
  });

  it('revert if msg.sender is not owner', async function() {
    const nonOwner = accounts[5];
    await utils.assertRevert(
      sidechainInstance.revokeConfirmation(txHash, { from: nonOwner })
    );

    const owner = accounts[0];
    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: owner }
    );

    // check that txHash has been successfully signed by owner.
    let isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      owner
    );
    assert.ok(isSignedSC);

    // check that txHash hasn't been executed.
    const sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);
    assert.equal(sideChainTx[4], false);

    await sidechainInstance.revokeConfirmation(txHash, { from: owner });

    // check that confirmatoin has been removed.
    isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      owner
    );
    assert.notOk(isSignedSC);
  });

  it('revert if tx has already been executed', async function() {
    await sidechainInstance.deposit(accounts[0], {
      from: accounts[0],
      value: 1e7
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

    await utils.assertRevert(
      sidechainInstance.revokeConfirmation(txHash, { from: accounts[0] })
    );
  });

  it("revert if msg.sender didn't sign the tx", async function() {
    const owner = accounts[0];

    await utils.assertRevert(
      sidechainInstance.revokeConfirmation(txHash, { from: accounts[1] })
    );

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: owner }
    );

    let isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      owner
    );
    assert.ok(isSignedSC);

    await sidechainInstance.revokeConfirmation(txHash, { from: owner });

    isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      owner
    );
    assert.notOk(isSignedSC);
  });
});
