'use strict';

let utils = require('./../utils/utils');
let consts = require('./../utils/consts');
let web3Utils = require('web3-utils');
let sidechain = artifacts.require('SideChain.sol');
let exampleToken = artifacts.require('./test/ExampleToken.sol');

let sidechainInstance;
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

contract('SideChain: submitTransactionSC Unit Test', function(accounts) {
  beforeEach(async function() {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2);
    exampleTokenInstance = await exampleToken.new(accounts.slice(0, 4));
    txHash = txHashes[0];
    toAddress = accounts[1];
    value = 1e6;
    data = '';
  });

  it('checks that ETH withdrawal works as intended if all the condition are valid', async function() {
    await sidechainInstance.deposit(accounts[0], {
      from: accounts[0],
      value: 1e7
    });

    const user = '0x641cb10d9676e1e2b84d427ea160ce0866c01d20';

    const sidechainContractBalanceBefore = web3.eth.getBalance(
      sidechainInstance.address
    );
    const userBalanceBefore = web3.eth.getBalance(user);

    toAddress = user;

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    // need confimation from another owners in order to emit Execution event.
    const res = await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[1] }
    );

    // check that Execution event has been successfully emited.
    assert.equal(res.logs[1].event, 'Execution');

    const sidechainContractBalanceAfter = web3.eth.getBalance(
      sidechainInstance.address
    );
    const userbalanceAfter = web3.eth.getBalance(user);

    assert.equal(
      sidechainContractBalanceBefore - sidechainContractBalanceAfter,
      value
    );
    assert.equal(userbalanceAfter - userBalanceBefore, value);
  });

  it('checks that ERC20 Token withdrawal works as intended if all the condition are valid', async function() {
    const user = accounts[5];

    // send some exampleToken to the sidechainInstance first
    await exampleTokenInstance.transfer(sidechainInstance.address, value, {
      from: accounts[0]
    });
    const userBalanceBefore = await exampleTokenInstance.balanceOf.call(user);
    const contractBalanceBefore = await exampleTokenInstance.balanceOf.call(
      sidechainInstance.address
    );

    const tokenAmountToSend = 1000;
    const tokenTransferEncodedData = exampleTokenInstance.contract.transfer.getData(
      user,
      tokenAmountToSend
    );

    toAddress = exampleTokenInstance.address;
    value = 0;
    data = tokenTransferEncodedData;

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

    const userBalanceAfter = await exampleTokenInstance.balanceOf.call(user);
    const contractBalanceAfter = await exampleTokenInstance.balanceOf.call(
      sidechainInstance.address
    );

    assert.equal(
      contractBalanceBefore - contractBalanceAfter,
      tokenAmountToSend
    );
    assert.equal(userBalanceAfter - userBalanceBefore, tokenAmountToSend);
  });

  it('checks that external_call is working properly by calling different functions', async function() {
    let isUserAnOwner = await sidechainInstance.isOwner(accounts[9]);

    assert.notOk(isUserAnOwner);

    // First try to call Add Owner
    data = sidechainInstance.contract.addOwner.getData(accounts[9]);
    toAddress = sidechainInstance.address;
    value = 0;
    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    let res = await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[1] }
    );
    let log = res.logs[1];

    assert.equal(log.event, 'OwnerAddition');

    isUserAnOwner = await sidechainInstance.isOwner(accounts[9]);

    assert.ok(isUserAnOwner);

    // Try to remove the Added Owner
    data = sidechainInstance.contract.removeOwner.getData(accounts[9]);
    txHash = txHashes[1]; // we need to use a different txHash for this to succeed

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    res = await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[1] }
    );
    log = res.logs[1];

    assert.equal(log.event, 'OwnerRemoval');

    isUserAnOwner = await sidechainInstance.isOwner(accounts[9]);

    assert.notOk(isUserAnOwner);
  });

  it('revert if msg.sender is not owner', async function() {
    const nonOwner = accounts[5];

    await utils.assertRevert(
      sidechainInstance.submitTransactionSC(txHash, toAddress, value, data, {
        from: nonOwner
      })
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
    const isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      owner
    );
    assert.ok(isSignedSC);
  });

  it('revert if address is null', async function() {
    const owner = accounts[0];
    toAddress = consts.ZERO_ADDRESS;
    await utils.assertRevert(
      sidechainInstance.submitTransactionSC(txHash, toAddress, value, data, {
        from: owner
      })
    );

    toAddress = accounts[0];

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: owner }
    );

    // check that txHash has been successfully signed by owner.
    const isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      owner
    );
    assert.ok(isSignedSC);
  });

  it('revert if this owner already signed this txHash', async function() {
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

    await utils.assertRevert(
      sidechainInstance.submitTransactionSC(txHash, toAddress, value, data, {
        from: owner
      })
    );
  });

  it("revert if the hash of the parameter doesn't equal to msgHash added to blockchain", async function() {
    toAddress = accounts[1];

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    toAddress = accounts[2];

    await utils.assertRevert(
      sidechainInstance.submitTransactionSC(txHash, toAddress, value, data, {
        from: accounts[1]
      })
    );

    toAddress = accounts[1];

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[1] }
    );

    // check that txHash has been successfully signed by accounts[1].
    const isSignedSC = await sidechainInstance.contract.isSignedSC.call(
      txHash,
      accounts[1]
    );
    assert.ok(isSignedSC);
  });

  it("add transaction to sidechain if transaction hasn't been added to sidechain", async function() {
    const owner = accounts[0];

    // check that txHash hasn't been added to sideChainTx yet.
    let sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);
    assert.equal(sideChainTx[1], consts.ZERO_ADDRESS);

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: owner }
    );

    // check that txHash has been added to sideChainTx successfully.
    sideChainTx = sidechainInstance.contract.sideChainTx.call(txHash);
    assert.equal(sideChainTx[1], toAddress);
    assert.equal(sideChainTx[2], value);
  });

  it('checks that Confirmation event is emitted properly', async function() {
    const owner = accounts[0];

    const res = await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: owner }
    );
    assert.equal(res.logs[0].event, 'Confirmation');
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
