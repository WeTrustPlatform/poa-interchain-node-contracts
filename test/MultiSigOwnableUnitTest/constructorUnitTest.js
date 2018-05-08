"use strict";

let utils = require('./../utils/utils');
let consts = require('./../utils/consts');
let MultiSigOwnable = artifacts.require('test/TestMultiSigOwnable.sol');
let ownableInstance;

contract('MultiSigOwnable: AddOwner Unit Test', function(accounts) {

  beforeEach(async function () {
    ownableInstance = await MultiSigOwnable.new(accounts.slice(0, 3), 2);
  });

  it("revert if duplicate address exists", async function () {
    const ownerList = [accounts[0], accounts[0], accounts[1]];

    ownableInstance = await utils.assertRevert(MultiSigOwnable.new(ownerList, 2));

  });

  it("revert if owner address is zero address", async function () {
    const ownerList = [accounts[0], consts.ZERO_ADDRESS, accounts[1]];

    ownableInstance = await utils.assertRevert(MultiSigOwnable.new(ownerList, 2));
  });
});