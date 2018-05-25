'use strict';

let utils = require('./../utils/utils');
let freezable = artifacts.require('test/TestFreezable.sol');
let freezableInstance;

contract('Freezable: unFreeze Unit Test', function(accounts) {
  beforeEach(async function() {
    freezableInstance = await freezable.new(accounts.slice(0, 3), 2);
  });

  it(
    'checks that unFreeze work as intended if all the condition are valid &' +
      ' also emit contractUnFrozen event',
    async function() {
      const user = accounts[0];

      await freezableInstance.freeze({ from: user });

      let frozenAt = await freezableInstance.frozenAt.call();
      let approvalCount = await freezableInstance.approvalCount.call();
      let hasUserApproved = await freezableInstance.approval.call(user);

      assert.notEqual(frozenAt.toNumber(), 0);
      assert.equal(approvalCount.toNumber(), 1);
      assert.ok(hasUserApproved);

      const res = await freezableInstance.unFreeze({ from: user });

      const log = res.logs[0];

      assert.equal(log.event, 'contractUnFrozen');

      frozenAt = await freezableInstance.frozenAt.call();
      approvalCount = await freezableInstance.approvalCount.call();
      hasUserApproved = await freezableInstance.approval.call(user);

      assert.equal(frozenAt.toNumber(), 0);
      assert.equal(approvalCount.toNumber(), 0);
      assert.notOk(hasUserApproved);
    }
  );

  it("checks that unFreeze doesn't unFreeze completely if approvalCount is > 1", async function() {
    const user = accounts[0];
    const user2 = accounts[1];

    await freezableInstance.freeze({ from: user });
    await freezableInstance.freeze({ from: user2 });

    let frozenAt = await freezableInstance.frozenAt.call();
    let approvalCount = await freezableInstance.approvalCount.call();
    let hasUserApproved = await freezableInstance.approval.call(user);

    assert.notEqual(frozenAt.toNumber(), 0);
    assert.equal(approvalCount.toNumber(), 2);
    assert.ok(hasUserApproved);

    await freezableInstance.unFreeze({ from: user });

    frozenAt = await freezableInstance.frozenAt.call();
    approvalCount = await freezableInstance.approvalCount.call();
    hasUserApproved = await freezableInstance.approval.call(user);

    assert.notEqual(frozenAt.toNumber(), 0);
    assert.equal(approvalCount.toNumber(), 1);
    assert.notOk(hasUserApproved);
  });

  it('revert if called from an not approved owner', async function() {
    const user = accounts[0];

    const hasUserApproved = await freezableInstance.approval.call(user);

    assert.notOk(hasUserApproved);

    await utils.assertRevert(freezableInstance.unFreeze({ from: accounts[0] }));
  });
});
