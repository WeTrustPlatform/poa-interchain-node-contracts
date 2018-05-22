'use strict';

let utils = require('./../utils/utils');
let MultiSigOwnable = artifacts.require('test/TestMultiSigOwnable.sol');

let ownableInstance;

contract('MultiSigOwnable: replaceOwner Unit Test', function(accounts) {
  beforeEach(async function() {
    ownableInstance = await MultiSigOwnable.new(accounts.slice(0, 3), 2);
  });

  it('checks that replaceOwner work as intended if all the condition are valid', async function() {
    const replaceOwnerEncodedDataField = ownableInstance.contract.replaceOwner.getData(
      accounts[1],
      accounts[5]
    );
    await ownableInstance.callSelf(replaceOwnerEncodedDataField);
    const newOwnerList = await ownableInstance.getOwners.call();

    assert.ok(newOwnerList.includes(accounts[5]));
    assert.notOk(newOwnerList.includes(accounts[1]));
  });

  it('revert if not called from the smart contract Address', async function() {
    const replaceOwnerEncodedDataField = ownableInstance.contract.replaceOwner.getData(
      accounts[0],
      accounts[5]
    );
    await utils.assertRevert(
      ownableInstance.sendTransaction({
        from: accounts[0],
        data: replaceOwnerEncodedDataField
      })
    );
    // check that calling the correct doesn't revert
    await ownableInstance.callSelf(replaceOwnerEncodedDataField);
  });

  it("revert if owner doesn't exists", async function() {
    const ownersList = await ownableInstance.getOwners.call();

    assert.notOk(ownersList.includes(accounts[5])); // first check that address to be added doesn't exist
    assert.notOk(ownersList.includes(accounts[6])); // first check that address to be added doesn't exist

    const replaceOwnerEncodedDataField = ownableInstance.contract.replaceOwner.getData(
      accounts[5],
      accounts[6]
    );
    const res = await ownableInstance.callSelf(replaceOwnerEncodedDataField);
    assert.equal(res.logs.length, 0);
    const newOwnersList = await ownableInstance.getOwners.call();

    assert.equal(newOwnersList.length, 3);
    assert.notOk(newOwnersList.includes(accounts[6]));
  });

  it('revert if newOwner does exists', async function() {
    const ownersList = await ownableInstance.getOwners.call();

    assert.ok(ownersList.includes(accounts[0])); // first check that address to be added does exist
    assert.ok(ownersList.includes(accounts[1])); // first check that address to be added does exist

    const replaceOwnerEncodedDataField = ownableInstance.contract.replaceOwner.getData(
      accounts[0],
      accounts[1]
    );
    const res = await ownableInstance.callSelf(replaceOwnerEncodedDataField);
    assert.equal(res.logs.length, 0);
  });

  it('checks that OwnerAddition event is emitted properly', async function() {
    const replaceOwnerEncodedDataField = ownableInstance.contract.replaceOwner.getData(
      accounts[0],
      accounts[5]
    );
    const res = await ownableInstance.callSelf(replaceOwnerEncodedDataField);
    assert.equal(res.logs[1].event, 'OwnerAddition');
  });

  it('checks that OwnerRemoval event is emitted properly', async function() {
    const replaceOwnerEncodedDataField = ownableInstance.contract.replaceOwner.getData(
      accounts[0],
      accounts[5]
    );
    const res = await ownableInstance.callSelf(replaceOwnerEncodedDataField);
    assert.equal(res.logs[0].event, 'OwnerRemoval');
  });
});
