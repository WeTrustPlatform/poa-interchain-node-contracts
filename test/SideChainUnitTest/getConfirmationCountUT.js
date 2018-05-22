'use strict';

let web3Utils = require('web3-utils');
let sidechain = artifacts.require('SideChain.sol');

let sidechainInstance;
let txHashes = [];

for (let i = 0; i < 10; i++) {
  txHashes.push(web3Utils.soliditySha3('test' + i));
}

/**
 * Default values for testing each test cases
 */
let txHash;
let toAddress;
let value;
let data;

contract('SideChain: getConfirmationCount Unit Test', function(accounts) {
  beforeEach(async function() {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2);

    txHash = txHashes[0];
    toAddress = accounts[0];
    value = 1e6;
    data = '';
  });

  it('checks that getConfirmationCount works as intended', async function() {
    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[0] }
    );

    let res = 0;
    res = await sidechainInstance.getConfirmationCount(txHash);
    assert.equal(res, 1);

    await sidechainInstance.submitTransactionSC(
      txHash,
      toAddress,
      value,
      data,
      { from: accounts[1] }
    );

    res = await sidechainInstance.getConfirmationCount(txHash);
    assert.equal(res, 2);
  });
});
