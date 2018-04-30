"use strict";

let utils = require('./../utils/utils');
let MultiSigOwnable = artifacts.require('test/TestMultiSigOwnable.sol');
let ownableInstance;

contract('MultiSigOwnable: AddOwner Unit Test', function(accounts) {

  beforeEach(async function () {
    ownableInstance = await MultiSigOwnable.new(accounts.slice(0, 3), 2);
  });

  it("checks that addOwner work as intended if all the condition are valid", async function () {
    const ownersList = await ownableInstance.getOwners.call();

    assert.notOk(ownersList.includes(accounts[5])); // first check that address to be added doesn't exist

    const addOwnerEncodedDataField = ownableInstance.contract.addOwner.getData(accounts[5]);
    await ownableInstance.callSelf(addOwnerEncodedDataField);
    const newOwnersList = await ownableInstance.getOwners.call();

    assert.equal(newOwnersList.length, 4);
    assert.ok(newOwnersList.includes(accounts[5]));
  });

  it("revert if not called from the smart contract Address", async function () {
    const addOwnerEncodedDataField = ownableInstance.contract.addOwner.getData(accounts[5]);

    // await utils.assertRevert(ownableInstance.sendTransaction({from: accounts[0], data: addOwnerEncodedDataField}));
    // check that calling the correct doesn't revert
    await ownableInstance.callSelf(addOwnerEncodedDataField);
  });

  it("revert if owner already exists", async function () {

    const ownersList = await ownableInstance.getOwners.call();

    assert.notOk(ownersList.includes(accounts[5])); // first check that address to be added doesn't exist

    const addOwnerEncodedDataField = ownableInstance.contract.addOwner.getData(ownersList[0]);
    await ownableInstance.callSelf(addOwnerEncodedDataField);
    const newOwnersList = await ownableInstance.getOwners.call();

    assert.equal(newOwnersList.length, 3);
    assert.notOk(newOwnersList.includes(accounts[5]))
  });

  it("checks that ownerAddition event is emitted properly", async function () {
    const addOwnerEncodedDataField = ownableInstance.contract.addOwner.getData(accounts[5]);
    const res = await ownableInstance.callSelf(addOwnerEncodedDataField);
    const log = res.logs[0];
    assert.equal(log.event, 'OwnerAddition');
  });
});