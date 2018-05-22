'use strict';

let utils = require('./../utils/utils');
let MultiSigOwnable = artifacts.require('test/TestMultiSigOwnable.sol');

let ownableInstance;

contract('MultiSigOwnable: changeRequirement Unit Test', function(accounts) {
  beforeEach(async function() {
    ownableInstance = await MultiSigOwnable.new(accounts.slice(0, 3), 2);
  });

  it('checks that changeRequirement work as intended if all the condition are valid', async function() {
    const requirement = await ownableInstance.required.call();
    assert.equal(requirement.toNumber(), 2);

    const changeRequirementEncodedDataField = ownableInstance.contract.changeRequirement.getData(
      3
    );
    await ownableInstance.callSelf(changeRequirementEncodedDataField);
    const newRequirement = await ownableInstance.required.call();

    assert.equal(newRequirement.toNumber(), 3);
  });

  it('revert if not called from the smart contract Address', async function() {
    const changeRequirementEncodedDataField = ownableInstance.contract.changeRequirement.getData(
      3
    );
    await utils.assertRevert(
      ownableInstance.sendTransaction({
        from: accounts[0],
        data: changeRequirementEncodedDataField
      })
    );

    const res = await ownableInstance.callSelf(
      changeRequirementEncodedDataField
    );
    const log = res.logs[0];

    assert.equal(log.event, 'RequirementChange');
  });

  it("revert if valid requirements aren't met", async function() {
    /**
     * valid requirements:
     * - required <= ownerCount
     * - required != 0
     */
    const required = await ownableInstance.required.call();
    const ownerList = await ownableInstance.getOwners.call();

    let changeRequirementEncodedDataField = ownableInstance.contract.changeRequirement.getData(
      ownerList.length + 1
    );
    await ownableInstance.callSelf(changeRequirementEncodedDataField);
    let newRequired = await ownableInstance.required.call();

    assert.equal(required.toNumber(), newRequired.toNumber());

    changeRequirementEncodedDataField = ownableInstance.contract.changeRequirement.getData(
      0
    );
    await ownableInstance.callSelf(changeRequirementEncodedDataField);
    newRequired = await ownableInstance.required.call();

    assert.equal(required.toNumber(), newRequired.toNumber());
  });

  it('checks that requirementsChanged event is emitted properly', async function() {
    const changeRequirementEncodedDataField = ownableInstance.contract.changeRequirement.getData(
      3
    );
    const res = await ownableInstance.callSelf(
      changeRequirementEncodedDataField
    );
    const log = res.logs[0];
    assert.equal(log.event, 'RequirementChange');
  });
});
