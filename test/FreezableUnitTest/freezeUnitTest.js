"use strict";

let utils = require('./../utils/utils');
let freezable = artifacts.require('test/TestFreezable.sol');
let freezableInstance;

contract('Freezable: freeze Unit Test', function(accounts) {

  beforeEach(async function () {
    freezableInstance = await freezable.new(accounts.slice(0, 3), 2);
  });

  it("checks that freeze work as intended if all the condition are valid", async function () {
    const user = accounts[0];

    let frozenAt = await freezableInstance.frozenAt.call();
    let approvalCount = await freezableInstance.approvalCount.call();
    let hasUserApproved = await freezableInstance.approval.call(user);

    assert.equal(frozenAt.toNumber(), 0);
    assert.equal(approvalCount.toNumber(), 0);
    assert.notOk(hasUserApproved);

    await freezableInstance.freeze({from: user});

    frozenAt = await freezableInstance.frozenAt.call();
    approvalCount = await freezableInstance.approvalCount.call();
    hasUserApproved = await freezableInstance.approval.call(user);

    await utils.mineOneBlock();
    const now = web3.eth.getBlock('latest').timestamp;

    assert.ok(now >= frozenAt.toNumber());
    assert.equal(approvalCount.toNumber(), 1);
    assert.ok(hasUserApproved);
  });

  it("revert if called from an already approved owner", async function () {
    const user = accounts[0];

    await freezableInstance.freeze({from: accounts[0]});

    const hasUserApproved = await freezableInstance.approval.call(user);

    assert.ok(hasUserApproved);

    await utils.assertRevert(freezableInstance.freeze({from: accounts[0]}));
  });

  it("checks that contractFrozen event is emitted properly", async function () {
    const res = await freezableInstance.freeze({from: accounts[0]});
    const log = res.logs[0];

    assert.equal(log.event, 'contractFrozen');
  });
});