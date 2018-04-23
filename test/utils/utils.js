"use strict";

let assert = require('chai').assert;

// we need this becaues test env is different than script env
let myWeb3 = (typeof web3 === undefined ? undefined : web3);

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

module.exports = {
  setWeb3: function(web3) {
    myWeb3 = web3;
  },

  assertEqualUpToGasCosts: function(actual, expected) {
    assert.closeTo(actual, expected, consts.MAX_GAS_COST_PER_TX);
  },

  assertThrows: function(promise, err) {
    return promise.then(function() {
      assert.isNotOk(true, err);
    }).catch(function(e) {
      assert.include(e.message, 'invalid opcode', "contract didn't throw as expected");
    });
  },

  assertRevert: function(promise, err) {
    return promise.then(function() {
      assert.isNotOk(true, err);
    }).catch(function(e) {
      assert.include(e.message, 'revert', "contract didn't throw as expected");
    });
  },

  calculateFrozenDuration: function(approvalCount, required, minTimeFrozenOpt, ratioOpt) {
    const minTime = minTimeFrozenOpt || 60 * 60; // one hour by default
    const defaultRatio = ratioOpt || 8;
    return minTime * (defaultRatio ** (approvalCount - 1));
  },

  getBalance: async function (userIndexOrAddress, optTokenContract) {
    let account = (typeof userIndexOrAddress === 'number') ?
      this.accounts[userIndexOrAddress] : userIndexOrAddress; // eslint-disable-line
    let tokenContract = optTokenContract || ZERO_ADDRESS;

    if (!tokenContract || tokenContract === ZERO_ADDRESS) {
      return web3.eth.getBalance(account).toNumber();
    }

    return (await ExampleToken.at(tokenContract).balanceOf(account)).toNumber();
  },

  getGasUsage: function(transactionPromise, extraData) {
    return new Promise(function(resolve, reject) {
      transactionPromise.then(function(txId) {
        resolve({
          gasUsed: myWeb3.eth.getTransactionReceipt(txId).gasUsed,
          extraData: extraData,
        });
      }).catch(function(reason) {
        reject(reason);
      });
    });
  },

  increaseTime: function(bySeconds) {
    myWeb3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [bySeconds],
      id: new Date().getTime(),
    });
  },

  mineOneBlock: function() {
    myWeb3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_mine",
      id: new Date().getTime(),
    });
  },
};