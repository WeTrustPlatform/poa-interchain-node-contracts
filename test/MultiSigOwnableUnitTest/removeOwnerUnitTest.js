"use strict";

let utils = require('./../utils/utils');
let MultiSigOwnable = artifacts.require('test/TestMultiSigOwnable.sol');

let ownableInstance;

contract('MultiSigOwnable: removeOwner Unit Test', function(accounts) {

  beforeEach(async function () {
    ownableInstance = await MultiSigOwnable.new(accounts.slice(0, 3), 2);
  });

  it("checks that removeOwner work as intended if all the condition are valid", async function () {
    const ownersList = await ownableInstance.getOwners.call();

    assert.ok(ownersList.includes(accounts[0])); // first check that address to be added doesn't exist

    const removeOwnerEncodedDataField = ownableInstance.contract.removeOwner.getData(accounts[0]);
    await ownableInstance.callSelf(removeOwnerEncodedDataField);
    const newOwnersList = await ownableInstance.getOwners.call();

    assert.equal(newOwnersList.length, 2);
    assert.notOk(newOwnersList.includes(accounts[0]));
  });

  it("revert if not called from the smart contract Address", async function () {
    const removeOwnerEncodedDataField = ownableInstance.contract.removeOwner.getData(accounts[5]);
    await utils.assertRevert(ownableInstance.sendTransaction({from: accounts[0], data: removeOwnerEncodedDataField}));
    // check that calling the correct doesn't revert
    await ownableInstance.callSelf(removeOwnerEncodedDataField);
  });

  it("revert if owner doesn't exists", async function () {
    const ownersList = await ownableInstance.getOwners.call();

    assert.notOk(ownersList.includes(accounts[5])); // first check that address to be added doesn't exist

    const removeOwnerEncodedDataField = ownableInstance.contract.removeOwner.getData(ownersList[5]);
    await ownableInstance.callSelf(removeOwnerEncodedDataField);
    const newOwnersList = await ownableInstance.getOwners.call();

    assert.equal(newOwnersList.length, 3);
    assert.notOk(newOwnersList.includes(accounts[5]));
  });

  it("revert if valid requirements aren't met", async function () {
    /**
     * valid requirements:
     * - required <= ownerCount
     * - ownerCount != 0;
     */
    //create 2 owner 2 required contract to test required <= ownerCount
    ownableInstance = await MultiSigOwnable.new(accounts.slice(0, 2), 2);
    let ownersList = await ownableInstance.getOwners.call();

    assert.ok(ownersList.includes(accounts[0]));

    let removeOwnerEncodedDataField = ownableInstance.contract.removeOwner.getData(accounts[0]);
    // this should fail because required would be > ownerCount if we remove.
    await ownableInstance.callSelf(removeOwnerEncodedDataField);
    let newOwnersList = await ownableInstance.getOwners.call();

    assert.equal(newOwnersList.length, 2);
    assert.ok(newOwnersList.includes(accounts[0]));


    //create 1 owner 1 required contract to test ownerCount != 0
    ownableInstance = await MultiSigOwnable.new(accounts.slice(0, 1), 1);
    ownersList = await ownableInstance.getOwners.call();

    assert.ok(ownersList.includes(accounts[0]));
    removeOwnerEncodedDataField = ownableInstance.contract.removeOwner.getData(accounts[0]);
    // this should fail because ownerCount would become zero if we remove.
    await ownableInstance.callSelf(removeOwnerEncodedDataField);
    newOwnersList = await ownableInstance.getOwners.call();

    assert.equal(newOwnersList.length, 1);
    assert.ok(newOwnersList.includes(accounts[0]));
  });

  it("checks that ownerRemoval event is emitted properly", async function () {
    const removeOwnerEncodedDataField = ownableInstance.contract.removeOwner.getData(accounts[0]);
    const res = await ownableInstance.callSelf(removeOwnerEncodedDataField);
    const log = res.logs[0];
    assert.equal(log.event, 'OwnerRemoval');
  });

});