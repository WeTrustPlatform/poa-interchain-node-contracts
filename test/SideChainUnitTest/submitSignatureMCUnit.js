"use strict";

let utils = require('./../utils/utils');
let consts = require('./../utils/consts');
let web3Utils = require('web3-utils');
let sidechain = artifacts.require('SideChain.sol');
let exampleToken = artifacts.require('./test/ExampleToken.sol');

let sidechainInstance;
let exampleTokenInstance;
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


contract('MainChain: submitTransaction Unit Test', function(accounts) {
  beforeEach(async function () {
    sidechainInstance = await sidechain.new(accounts.slice(0, 3), 2);
    exampleTokenInstance = await exampleToken.new(accounts.slice(0, 4));

    txHash = txHashes[0];
    toAddress = accounts[1];
    value = 1e6;
    data = '';
    version = await sidechainInstance.VERSION.call();
    sigs = utils.multipleSignedTransaction([0,1,2,3,4,5,6], txHash, toAddress, value, data, version);
  });

  it("checks that a new transaction object is added for first signature submission", async function () {
    // first check that the transaction doesn't exist
    let tx = await sidechainInstance.getTransactionMC.call(txHash);
    let destination = tx[0]; // first index is the destination address;

    assert.equal(destination, consts.ZERO_ADDRESS);

    // we only need to submit one signature
    await sidechainInstance.submitSignatureMC(sigs.msgHash, txHash, toAddress, value, data, sigs.v[0], sigs.r[0], sigs.s[0]);

    tx = await sidechainInstance.getTransactionMC.call(txHash);
    destination = tx[0]; // first index is the destination address;
    const valueRetrieved = tx[1];
    const dataRetrieved = tx[2];
    const v = tx[3];
    const r = tx[4];
    const s = tx[5];

    assert.equal(destination, toAddress);
    assert.equal(valueRetrieved, value);
    assert.equal('0x' + data, dataRetrieved);
    assert.equal(v, sigs.v[0]);
    assert.equal(r, sigs.r[0]);
    assert.equal(s, sigs.s[0]);
  });

  it("checks that signature is added properly to existing transaction object for non-first signature submission", async function () {
  });

  it("revert if called from a non owner account", async function () {
  });

  it("revert if destination address is null", async function () {
    toAddress = consts.ZERO_ADDRESS;
    sigs = utils.multipleSignedTransaction([0], txHash, toAddress, value, data, version);

    await utils.assertRevert(sidechainInstance.submitSignatureMC(sigs.msgHash, txHash, toAddress, value, data, sigs.v[0], sigs.r[0], sigs.s[0]));

    // test with valid conditions to see if it passes
    toAddress = accounts[1];
    sigs = utils.multipleSignedTransaction([0], txHash, toAddress, value, data, version);
    await sidechainInstance.submitSignatureMC(sigs.msgHash, txHash, toAddress, value, data, sigs.v[0], sigs.r[0], sigs.s[0]);
  });

  it("revert if owner already submitted a signature", async function () {
    await sidechainInstance.submitSignatureMC(sigs.msgHash, txHash, toAddress, value, data, sigs.v[0], sigs.r[0], sigs.s[0]);

    //checks that signature submission works
    const tx = await sidechainInstance.getTransactionMC.call(txHash);
    const v = tx[3];
    const r = tx[4];
    const s = tx[5];

    assert.equal(v, sigs.v[0]);
    assert.equal(r, sigs.r[0]);
    assert.equal(s, sigs.s[0]);

    // try to submit the same signature again
    await utils.assertRevert(sidechainInstance.submitSignatureMC(sigs.msgHash, txHash, toAddress, value, data, sigs.v[0], sigs.r[0], sigs.s[0]));
  });

  it("revert if hash of Params is different from msgHash", async function () {
    toAddress = accounts[2]; // a different account than one used to create msgHash
    await utils.assertRevert(sidechainInstance.submitSignatureMC(sigs.msgHash, txHash, toAddress, value, data, sigs.v[0], sigs.r[0], sigs.s[0]));

    toAddress = accounts[1]; // try to make sure it works with proper value
    await sidechainInstance.submitSignatureMC(sigs.msgHash, txHash, toAddress, value, data, sigs.v[0], sigs.r[0], sigs.s[0]);
  });

  it("checks that signatureAdded event is emitted properly", async function () {
    const res = await sidechainInstance.submitSignatureMC(sigs.msgHash, txHash, toAddress, value, data, sigs.v[0], sigs.r[0], sigs.s[0]);
    const log = res.logs[0];

    assert.equal(log.event, 'SignatureAdded');
  });
});