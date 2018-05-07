"use strict";

let utils = require('./../utils/utils');
let freezable = artifacts.require('test/TestFreezable.sol');
let freezableInstance;

contract('Freezable: ChangeFrozenDurationRatio Unit Test', function(accounts) {

  beforeEach(async function () {
    freezableInstance = await freezable.new(accounts.slice(0, 3), 2);
  });

  it("checks that ChangeFrozenDurationRatio work as intended if all the condition are valid", async function () {
    const defaultMinTimeFrozen = 8;
    const ratioToSwitch = 14; // some arbitary number to test with
    const changeMinTimeFrozenEncodedData = freezableInstance.contract.changeFrozenDurationRatio.getData(ratioToSwitch);

    let frozenDurationRatio = await freezableInstance.frozenDurationRatio.call();
    assert.equal(frozenDurationRatio.toNumber(), defaultMinTimeFrozen);

    await freezableInstance.callSelf(changeMinTimeFrozenEncodedData);

    frozenDurationRatio = await freezableInstance.frozenDurationRatio.call();
    assert.equal(frozenDurationRatio.toNumber(), ratioToSwitch);
  });

  it("revert if not called from the smart contract Address", async function () {
    const timeToSwitch = 300; // some arbitary number to test with
    const changeMinTimeFrozenEncodedData = freezableInstance.contract.changeMinTimeFrozen.getData(timeToSwitch);

    await utils.assertRevert(freezableInstance.sendTransaction({from: accounts[0], data: changeMinTimeFrozenEncodedData}));

    // now check that the proper way to call the function actually works
    const res = await freezableInstance.callSelf(changeMinTimeFrozenEncodedData);

    assert.equal(res.logs.length, 1);
  });

  it("checks that frozenDurationRatioChanged event is emitted properly", async function () {
    const ratioToSwitch = 12; // some arbitary number to test with
    const changeFrozenDurationRatioEncodedData = freezableInstance.contract.changeFrozenDurationRatio.getData(ratioToSwitch);

    const res = await freezableInstance.callSelf(changeFrozenDurationRatioEncodedData);
    const log = res.logs[0];

    assert.equal(log.event, 'frozenDurationRatioChanged');
  });

});