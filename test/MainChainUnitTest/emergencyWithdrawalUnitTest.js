'use strict';

let utils = require('./../utils/utils');
let web3Utils = require('web3-utils');
let mainchain = artifacts.require('MainChain.sol');
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
let toAddress;
let value;
let isFrozen;

contract('MainChain: emergencyWithdrawal Unit Test', function(accounts) {
  beforeEach(async function() {
    mainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);
    destinationMainchainInstance = await mainchain.new(accounts.slice(0, 3), 2);
    await mainchainInstance.deposit(accounts[0], {
      from: accounts[0],
      value: 1e7
    });

    // freeze mainchainInstance.
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);
    await mainchainInstance.freeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    exampleTokenInstance = await exampleToken.new(accounts.slice(0, 4));

    value = 1e7;
    toAddress = destinationMainchainInstance.address;
    await mainchainInstance.VERSION.call();
  });

  it('checks that ETH emergency withdrawal works as intended if all the conditions are valid', async function() {
    const contractBalanceBefore = web3.eth.getBalance(
      mainchainInstance.address
    );
    const desContractBalanceBefore = web3.eth.getBalance(toAddress);

    // need approvals from 2 owners.
    const depositEncodedData = destinationMainchainInstance.contract.deposit.getData(
      toAddress
    );
    await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[0] }
    );
    const res = await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[1] }
    );

    // check EmergencyWithdrawal event is fired.
    assert.equal(res.logs[1].event, 'EmergencyWithdrawal');

    // check funds has been moved from mainchainInstance to destinationMainchainInstance.
    const contractBalanceAfter = web3.eth.getBalance(mainchainInstance.address);
    const desContractBalanceAfter = web3.eth.getBalance(toAddress);

    assert.equal(contractBalanceBefore - contractBalanceAfter, value);
    assert.equal(desContractBalanceAfter - desContractBalanceBefore, value);
  });

  it('checks that ERC20 Token emergency withdrawal works as intended if all the condition are valid', async function() {
    const tokenAmountToSend = 1000;

    // send 1e7 exampleToken to the mainchainInstance first
    await exampleTokenInstance.transfer(mainchainInstance.address, value, {
      from: accounts[0]
    });
    const tokenBalanceBefore = await exampleTokenInstance.balanceOf.call(
      mainchainInstance.address
    );
    const destTokenBalanceBefore = await exampleTokenInstance.balanceOf.call(
      toAddress
    );

    // need approvals from 2 owners.
    const transferEncodedData = exampleTokenInstance.contract.transfer.getData(
      toAddress,
      tokenAmountToSend
    );

    value = 0;
    await mainchainInstance.emergencyWithdrawal(
      exampleTokenInstance.address,
      value,
      transferEncodedData,
      { from: accounts[0] }
    );
    const res = await mainchainInstance.emergencyWithdrawal(
      exampleTokenInstance.address,
      value,
      transferEncodedData,
      { from: accounts[1] }
    );

    // check EmergencyWithdrawal event is fired.
    assert.equal(res.logs[0].event, 'EmergencyWithdrawal');

    // check funds has been moved from mainchainInstance to destinationMainchainInstance.
    const tokenBalanceAfter = await exampleTokenInstance.balanceOf.call(
      mainchainInstance.address
    );
    const destTokenBalanceAfter = await exampleTokenInstance.balanceOf.call(
      toAddress
    );

    assert.equal(tokenBalanceBefore - tokenBalanceAfter, tokenAmountToSend);
    assert.equal(
      destTokenBalanceAfter - destTokenBalanceBefore,
      tokenAmountToSend
    );
  });

  it('revert if contract is not frozen', async function() {
    // check mainchainInstance is not frozen.
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);
    await mainchainInstance.unFreeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.notOk(isFrozen);

    const depositEncodedData = destinationMainchainInstance.contract.deposit.getData(
      toAddress
    );
    await utils.assertRevert(
      mainchainInstance.emergencyWithdrawal(
        toAddress,
        value,
        depositEncodedData,
        { from: accounts[0] }
      )
    );

    // check when mainchainInstance is frozen, emergencyWithdrawal works as intended.
    await mainchainInstance.freeze();
    isFrozen = await mainchainInstance.checkIfFrozen.call();
    assert.ok(isFrozen);

    await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[0] }
    );
    const res = await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[1] }
    );

    // check EmergencyWithdrawal event is fired.
    assert.equal(res.logs[1].event, 'EmergencyWithdrawal');
  });

  it('revert if msg.sender is not owner', async function() {
    // one less signature than required
    const depositEncodedData = destinationMainchainInstance.contract.deposit.getData(
      toAddress
    );
    await utils.assertRevert(
      mainchainInstance.emergencyWithdrawal(
        toAddress,
        value,
        depositEncodedData,
        { from: accounts[5] }
      )
    );

    // check when msg.sender is owner, emergencyWithdrawal works as intended.
    await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[0] }
    );
    const res = await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[1] }
    );

    // check EmergencyWithdrawal event is fired.
    assert.equal(res.logs[1].event, 'EmergencyWithdrawal');
  });

  it("revert if there aren't enough valid signatures", async function() {
    // two of the same signature
    const depositEncodedData = destinationMainchainInstance.contract.deposit.getData(
      toAddress
    );
    await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[0] }
    );
    await utils.assertRevert(
      mainchainInstance.emergencyWithdrawal(
        toAddress,
        value,
        depositEncodedData,
        { from: accounts[0] }
      )
    );

    // check when there are enough valid signatures, emergencyWithdrawal works as intended.
    const res = await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[1] }
    );

    // check EmergencyWithdrawal event is fired.
    assert.equal(res.logs[1].event, 'EmergencyWithdrawal');
  });

  it('Check that ExecutionFailure is emitted when external_call fails', async function() {
    // Withdraw more amount than the contract holds so that external_call will fail.
    const contractBalance = web3.eth.getBalance(mainchainInstance.address);
    value = contractBalance + 1;
    let depositEncodedData = destinationMainchainInstance.contract.deposit.getData(
      toAddress
    );
    await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[0] }
    );
    let res = await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[1] }
    );

    // check EmergencyFailure is emitted.
    assert.equal(res.logs[0].event, 'ExecutionFailure');

    // check when external_call successes, EmergencyWithdrawal is emitted.
    value = contractBalance - 1;
    depositEncodedData = destinationMainchainInstance.contract.deposit.getData(
      toAddress
    );
    await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[0] }
    );
    res = await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[1] }
    );
    assert.equal(res.logs[1].event, 'EmergencyWithdrawal');
  });

  it('Revert when transaction has already been executed.', async function() {
    const depositEncodedData = destinationMainchainInstance.contract.deposit.getData(
      toAddress
    );
    await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[0] }
    );
    let res = await mainchainInstance.emergencyWithdrawal(
      toAddress,
      value,
      depositEncodedData,
      { from: accounts[1] }
    );

    // check transaction is executed successfully.
    assert.equal(res.logs[1].event, 'EmergencyWithdrawal');

    // Revert when submit transaction twice.
    await utils.assertRevert(
      mainchainInstance.emergencyWithdrawal(
        toAddress,
        value,
        depositEncodedData,
        { from: accounts[0] }
      )
    );
  });
});
