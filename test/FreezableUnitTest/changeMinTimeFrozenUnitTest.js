'use strict';

let utils = require('./../utils/utils');
let freezable = artifacts.require('test/TestFreezable.sol');
let freezableInstance;

contract('Freezable: ChangeMinTimeFrozen Unit Test', function(accounts) {
  beforeEach(async function() {
    freezableInstance = await freezable.new(accounts.slice(0, 3), 2);
  });

  it('checks that ChangeMinTimeFrozen work as intended if all the condition are valid', async function() {
    const defaultMinTimeFrozen = 60 * 60;
    const timeToSwitch = 300; // some arbitary number to test with
    const changeMinTimeFrozenEncodedData = freezableInstance.contract.changeMinTimeFrozen.getData(
      timeToSwitch
    );

    let minTimeFrozen = await freezableInstance.minTimeFrozen.call();
    assert.equal(minTimeFrozen.toNumber(), defaultMinTimeFrozen);

    await freezableInstance.callSelf(changeMinTimeFrozenEncodedData);

    minTimeFrozen = await freezableInstance.minTimeFrozen.call();
    assert.equal(minTimeFrozen.toNumber(), timeToSwitch);
  });

  it('revert if not called from the smart contract Address', async function() {
    const timeToSwitch = 300; // some arbitary number to test with
    const changeMinTimeFrozenEncodedData = freezableInstance.contract.changeMinTimeFrozen.getData(
      timeToSwitch
    );

    await utils.assertRevert(
      freezableInstance.sendTransaction({
        from: accounts[0],
        data: changeMinTimeFrozenEncodedData
      })
    );

    // now check that the proper way to call the function actually works
    const res = await freezableInstance.callSelf(
      changeMinTimeFrozenEncodedData
    );

    assert.equal(res.logs.length, 1);
  });

  it('checks that minFrozenTimeChanged event is emitted properly', async function() {
    const timeToSwitch = 300; // some arbitary number to test with
    const changeMinTimeFrozenEncodedData = freezableInstance.contract.changeMinTimeFrozen.getData(
      timeToSwitch
    );

    const res = await freezableInstance.callSelf(
      changeMinTimeFrozenEncodedData
    );
    const log = res.logs[0];

    assert.equal(log.event, 'minFrozenTimeChanged');
  });
});
