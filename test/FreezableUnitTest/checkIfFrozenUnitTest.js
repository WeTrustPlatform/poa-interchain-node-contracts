"use strict";

let utils = require('./../utils/utils');
let freezable = artifacts.require('test/TestFreezable.sol');
let freezableInstance;

contract('Freezable: CheckIfFrozen Unit Test', function(accounts) {

  beforeEach(async function () {
    freezableInstance = await freezable.new(accounts.slice(0, 3), 2);
  });

  it("returns true when contract is frozen and frozenDuration hasn't passed", async function () {
    await freezableInstance.freeze({from: accounts[0]});

    const approvalCount = await freezableInstance.approvalCount.call();
    const frozenAt = await freezableInstance.frozenAt.call();
    const required = await freezableInstance.required.call();

    await utils.mineOneBlock();
    const now = web3.eth.getBlock('latest').timestamp;

    assert.ok(now <= frozenAt.toNumber() + utils.calculateFrozenDuration(approvalCount, required));

    const res = await freezableInstance.checkIfFrozen.call();

    assert.ok(res);
  });

  it("returns false when frozenAt is false", async function () {
    const frozenAt = await freezableInstance.frozenAt.call();

    assert.equal(frozenAt, 0);

    const res = await freezableInstance.checkIfFrozen.call();

    assert.notOk(res);
  });

  it("returns false when approvalCount is zero", async function () {
    const approvalCount = await freezableInstance.approvalCount.call();

    assert.equal(approvalCount, 0);

    const res = await freezableInstance.checkIfFrozen.call();

    assert.notOk(res);
  });

  it("returns false when frozenDuration has passed", async function () {
    // choose required to be 3 here because we want to test frozenDuration time when
    // there are three approved
    freezableInstance = await freezable.new(accounts.slice(0, 6), 4);
    await freezableInstance.freeze({from: accounts[0]});

    let approvalCount = await freezableInstance.approvalCount.call();
    const required = await freezableInstance.required.call();
    let frozenDurationOneApproved = utils.calculateFrozenDuration(approvalCount, required);
    let frozenDuration = frozenDurationOneApproved;

    let res = await freezableInstance.checkIfFrozen.call();
    assert.ok(res);

    utils.increaseTime(frozenDuration);
    res = await freezableInstance.checkIfFrozen.call();
    assert.notOk(res);


    // test frozenDuration with 2 approval
    await freezableInstance.freeze({from: accounts[1]});
    approvalCount = await freezableInstance.approvalCount.call();
    let frozenDurationTwoApproved = utils.calculateFrozenDuration(approvalCount, required);
    frozenDuration = frozenDurationTwoApproved - frozenDurationOneApproved;
    res = await freezableInstance.checkIfFrozen.call();
    assert.ok(res);

    utils.increaseTime(frozenDuration);
    res = await freezableInstance.checkIfFrozen.call();
    assert.notOk(res);

    // test frozenDuration with 3 approval
    await freezableInstance.freeze({from: accounts[2]});
    approvalCount = await freezableInstance.approvalCount.call();
    let frozenDurationThreeApproved = utils.calculateFrozenDuration(approvalCount, required);
    frozenDuration = frozenDurationThreeApproved - frozenDurationTwoApproved;
    res = await freezableInstance.checkIfFrozen.call();
    assert.ok(res);

    utils.increaseTime(frozenDuration);
    res = await freezableInstance.checkIfFrozen.call();
    assert.notOk(res);
  });

  it("returns true when approvalCount >= required all the time", async function () {
    await freezableInstance.freeze({from: accounts[0]});
    await freezableInstance.freeze({from: accounts[1]});

    const approvalCount = await freezableInstance.approvalCount.call();
    const required = await freezableInstance.required.call();
    const frozenDuration = utils.calculateFrozenDuration(approvalCount, required);

    let res = await freezableInstance.checkIfFrozen.call();
    assert.ok(res);

    utils.increaseTime(frozenDuration);

    await utils.mineOneBlock();

    res = await freezableInstance.checkIfFrozen.call();
    assert.ok(res);
  });
});