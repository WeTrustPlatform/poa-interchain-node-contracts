"use strict";

let utils = require('./../utils/utils');
let consts = require('./../utils/consts');
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
let sigs;
let version;


contract('SideChain: getConfirmationCount Unit Test', function(accounts) {
  beforeEach(async function () {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2);

    txHash = txHashes[0];
    toAddress = accounts[0];
    value = 1e6;
    data = '';
    version = await sidechainInstance.VERSION.call();
  });

  it("checks that getConfirmationCount works as intended", async function () {
    sigs = utils.signTransaction(0, txHash, toAddress, value, data, version);
    await sidechainInstance.submitTransactionSC(sigs.msgHash, txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s, {from: accounts[0]});

    let res = 0;
    res = await sidechainInstance.getConfirmationCount(txHash);
    assert.equal(res, 1);

    sigs = utils.signTransaction(1, txHash, toAddress, value, data, version);
    await sidechainInstance.submitTransactionSC(sigs.msgHash, txHash, toAddress, value, data, sigs.v, sigs.r, sigs.s, {from: accounts[1]});

    res = await sidechainInstance.getConfirmationCount(txHash);
    assert.equal(res, 2);
  });
});
