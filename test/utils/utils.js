'use strict';

let assert = require('chai').assert;
let consts = require('./consts');
let ethUtils = require('ethereumjs-util');
let web3Uitl = require('web3-utils');

// we need this becaues test env is different than script env
let myWeb3 = typeof web3 === undefined ? undefined : web3;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = {
  setWeb3: function(web3) {
    myWeb3 = web3;
  },

  assertEqualUpToGasCosts: function(actual, expected) {
    assert.closeTo(actual, expected, consts.MAX_GAS_COST_PER_TX);
  },

  assertThrows: function(promise, err) {
    return promise
      .then(function() {
        assert.isNotOk(true, err);
      })
      .catch(function(e) {
        assert.include(
          e.message,
          'invalid opcode',
          "contract didn't throw as expected",
        );
      });
  },

  assertRevert: function(promise, err) {
    return promise
      .then(function() {
        assert.isNotOk(true, err);
      })
      .catch(function(e) {
        assert.include(
          e.message,
          'revert',
          "contract didn't throw as expected",
        );
      });
  },

  calculateFrozenDuration: function(
    approvalCount,
    required,
    minTimeFrozenOpt,
    ratioOpt,
  ) {
    const minTime = minTimeFrozenOpt || 60 * 60; // one hour by default
    const defaultRatio = ratioOpt || 8;
    return minTime * defaultRatio ** (approvalCount - 1);
  },

  getBalance: async function(userIndexOrAddress, optTokenContract) {
    let account =
      typeof userIndexOrAddress === 'number'
        ? this.accounts[userIndexOrAddress]
        : userIndexOrAddress;
    let tokenContract = optTokenContract || ZERO_ADDRESS;

    if (!tokenContract || tokenContract === ZERO_ADDRESS) {
      return web3.eth.getBalance(account).toNumber();
    }

    return (await ExampleToken.at(tokenContract).balanceOf(account)).toNumber();
  },

  getGasUsage: function(transactionPromise, extraData) {
    return new Promise(function(resolve, reject) {
      transactionPromise
        .then(function(txId) {
          resolve({
            gasUsed: myWeb3.eth.getTransactionReceipt(txId).gasUsed,
            extraData: extraData,
          });
        })
        .catch(function(reason) {
          reject(reason);
        });
    });
  },

  createMsgHash: function(txHash, toAddress, value, data, version) {
    const hexEncodedData = this.checkAndEncodeHexPrefix(data);

    return web3Uitl
      .soliditySha3(
        { t: 'bytes32', v: txHash },
        { t: 'address', v: toAddress },
        value,
        { t: 'bytes', v: hexEncodedData },
        { t: 'uint8', v: version },
      )
      .substring(2);
  },

  checkAndEncodeHexPrefix: function(toHex) {
    if (toHex.length < 2) return '0x';

    if (toHex.substring(0, 2) === '0x') {
      return toHex;
    } else return '0x' + toHex;
  },

  signTransaction: function(
    userIndexOrPrivateKey,
    txHash,
    toAddress,
    value,
    data,
  ) {
    const privateKey =
      typeof userIndexOrPrivateKey === 'number'
        ? consts.PRIVATE_KEYS[userIndexOrPrivateKey]
        : userIndexOrPrivateKey;

    const msgHash = this.createMsgHash(txHash, toAddress, value, data);

    const sig = ethUtils.ecsign(
      Buffer.from(msgHash, 'hex'),
      Buffer.from(privateKey, 'hex'),
    );

    return {
      msgHash: '0x' + msgHash,
      v: sig.v,
      r: '0x' + sig.r.toString('hex'),
      s: '0x' + sig.s.toString('hex'),
    };
  },

  multipleSignedTransaction: function(
    arryOfUserIndexes,
    txHash,
    toAddress,
    value,
    data,
    version,
  ) {
    const v = [];
    const r = [];
    const s = [];

    const msgHash = this.createMsgHash(txHash, toAddress, value, data, version);

    for (let i = 0; i < arryOfUserIndexes.length; i++) {
      const sig = ethUtils.ecsign(
        Buffer.from(msgHash, 'hex'),
        Buffer.from(consts.PRIVATE_KEYS[arryOfUserIndexes[i]], 'hex'),
      );

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }

    return { msgHash: '0x' + msgHash, v, r, s };
  },

  increaseTime: function(bySeconds) {
    myWeb3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [bySeconds],
      id: new Date().getTime(),
    });
  },

  mineOneBlock: function() {
    myWeb3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime(),
    });
  },
};
