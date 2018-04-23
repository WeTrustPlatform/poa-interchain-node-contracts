"use strict";

let EthUtil = require('ethereumjs-util');
let web3Utils = require('web3-utils');

let InterChain = artifacts.require('InterChain.sol');
let InterChainV2 = artifacts.require('MainChain.sol');
let SideChain = artifacts.require('SideChain.sol');

var method2 = function(a) {
  var counts = [];
  for(var i = 0; i <= a.length; i++) {
    if(counts[a[i]] === undefined) {
      counts[a[i]] = 1;
    } else {
      return true;
    }
  }
  return false;
}

contract('GasCheck Test', function(accounts) {
  /* it("InterChain V1 1 signer Required", async function () {
    let node = await InterChain.new(accounts, 1);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 2 signer Required", async function () {
    let node = await InterChain.new(accounts, 2);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 3 signer Required", async function () {
    let node = await InterChain.new(accounts, 3);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[2]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 4 signer Required", async function () {
    let node = await InterChain.new(accounts, 4);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[2]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[3]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 5 signer Required", async function () {
    let node = await InterChain.new(accounts, 5);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[2]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[3]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[4]
      }),
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 6 signer Required", async function () {
    let node = await InterChain.new(accounts, 6);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[2]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[3]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[4]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[5]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 7 signer Required", async function () {
    let node = await InterChain.new(accounts, 7);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[2]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[3]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[4]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[5]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[6]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 8 signer Required", async function () {
    let node = await InterChain.new(accounts, 8);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[2]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[3]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[4]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[5]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[6]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[7]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 9 signer Required", async function () {
    let node = await InterChain.new(accounts, 9);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[2]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[3]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[4]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[5]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[6]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[7]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[8]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V1 10 signer Required", async function () {
    let node = await InterChain.new(accounts, 10);

    let res = await Promise.all([
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[0]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[1]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[2]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[3]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[4]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[5]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[6]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[7]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[8]
      }),
      node.submitTransaction(1, accounts[3], 3000000000, {
        from: accounts[9]
      })
    ]);
    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }

    console.log(cumulativeGasUsed);
  });
  it("InterChain V2 1 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 1);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V2 2 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 2);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V2 3 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 3);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
      '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V2 4 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 4);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
      '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
      'c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V2 5 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 5);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
      '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
      'c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c',
      '388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V2 6 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 6);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
      '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
      'c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c',
      '388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418',
      '659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V2 7 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 7);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
      '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
      'c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c',
      '388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418',
      '659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63',
      '82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V2 8 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 8);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
      '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
      'c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c',
      '388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418',
      '659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63',
      '82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8',
      'aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  });

  it("InterChain V2 9 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 9);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
      '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
      'c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c',
      '388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418',
      '659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63',
      '82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8',
      'aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7',
      '0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4',
    ];

    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }


    let res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        accounts[2],
        30000000,
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      // console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  }); */

  /* it("InterChain V2 60 signer Required", async function () {
    let node = await InterChainV2.new(accounts.splice(0, 150), 2);
    let receipt = await web3.eth.getTransactionReceipt(node.transactionHash);
    console.log(receipt);
    // const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 0;
    const privateKeys = [
      '38097f019d7275756eca41716a1d01ca34eea413abb1e79247c1db0656ed8575',
      'd9cfb366100c371637bc151ba8df9f5f07b4a9f99cab3dc1f3fd057cd04ce64a',
      '201a7d0b9957695bc741a2280e62ac0d77d59d2b0ae1e5142f95b57d1521c769',
      '7d871e7a5b116472be2e2205655c88ae114f13efc73a81803e9c549e77cedaa0',
      'ef6a47056e5dd350a76895d21d9b787f8f174e5b05a4cb662f0695b396e785cf',
      '3f003dc92891835e3b9bee2076e21dad406678bc391496f122ca2d995828523f',
      '8e79ecde15330046ca78749d6959f7fc0976be69c90b0f78ba4e2561476467ab',
      '48b2fac3db3c1d5642a1c1f5471c64643dd96c04e7533407bf8f8e4efe573752',
      '61d5ad8c98dc67d19fa147978ae8c5f1e4b7d4501db71cbd5498346f9f2fff26',
      '75142eb4ca3a780bcd42a05b9f6df8dda02750591e8fb52f95f6ceccc7caa038',
      '47cb7f6fb6b47f9d1f46e7fca362b4be193f42ec754f5fab3590b4be8f0326d6',
      '424c6d0856a0e6b5999975159c6ada89c3e90c89b9ce8ae92219b856214bb058',
      'b3722fea60d985fd394d2879de77f8f74a0f89a1b5577986b91f5ea2de29d8b7',
      '8843c37296f3f631781efa6113e95d42e87816b56b134ba7d3c694101ee54253',
      '3335a5da4093e763ef53fac6e6ba9fc5e218aa021cbbf5326316e70df73b9123',
      'd372a7f151a75d57b5d7a23f5a1b4ac6142fb866c88718f488c03dba308741de',
      '33c7dd1a10195fa64f6f9c7a66b07ea285074f45c62c5507dadfff9ec55f4449',
      '61960144929f82b5153d8e1a0a0ca3ece209ecc3c37035531c1683305a9eb491',
      '70413a3f7dd0b317c310c15276f3bcb399a6b5bae0896a817dd8c8c34232d248',
      'a890f6f96062a16b03a81706321d03de43c77207a7d20d24bc77bcd0b95190ae',
      '4b4e2761211ca76c3ff8759658febc724e97e6ee394b126390fc9526715e0065',
      '70165a633bb86649aaf5125ec42ead378c12a6c4b52fe47115d413191a51330b',
      '33ee033fe76ff104bb82d500102111df6e361063351ff498985d2b6eac930eca',
      '801d5d0966555fb33746f63c83dfe500da100659b9a56654f05d58009969e9c1',
      '71d26951e7d4a89aabef83a4cd0b5a13733d97c30b32a65bab01a55d0e945482',
      'ad31a579b8c1cad6236dc71c4f5d06f1206048e2f271fac1031f7c2c66397978',
      '3f7b1fc5de86598906ac073ebe371e831e1ff5ba5f21a4d8da83d55a7e8ca878',
      '5a572ac445c9aa5996dfc14d2230f1ade01a8ffa37c85c1f3279c928ad4a1f75',
      'e56f86f31d49bacf7aebed024e4fc71d82aea86b536e9e44bf89863f90fba7ff',
      '37ce957420083ec5217530f31cf910cd8a6d5ca13ac12b23557242f40594d14d',
      '6dfa47340a1c507c03742ff206e2fa650bc31e85f62977046c19de8e82de9d15',
      '5a689fd28d111efd4397d45de66b356d49533d7fcac91f3f26e3ea9ea5602d0f',
      '5454a1292a529c47869b008de4cf4373c2d380eb2b5e33e2a6ed42bd046f847b',
      'c57e2eccb5322a604c954f839e29bf1f16338f978191dc36b0bd67d77de401bf',
      'b3d2bfe7734adaab95401b1826b053105cec21dd728833a5e069cfc8572954ae',
      'ffb8848d46dca6e191b580a5073cbfd6def9735b5aa8fe086c25ea48aa7564ab',
      '9773826383d8074f7d86e5839dd3bf9b0993039e8105d4cc1f34df3a5ddcc1cf',
      '66637f8afc141935d86ab5981ab3b6f5cef49c2ae6de7c0a885875ab056aeece',
      '1fd0b4a44a776116193c09f05e1dfe92462bfd237202e8db30b647953c4ede21',
      '5afdf39608159b9fa94988ec224a6f746f1b68013bc9070fafac6bcb2b2db95c',
      'd9a6d95485bd928636c078d93d81a7018c9a42c8523ed8d9a26722e0bb9db702',
      'ada399fec85c5a33badd3040f4fde00523d3a43e82ee84d49604a288f75bff2d',
      'd09f5e5aaa6d811605cc8f0a329655b8954bf869c7c7f2c63f7a21dca9f5f031',
      '961e66ef0c738e16d385de22836ffc36820d0e5e1c3bb81c7ed4f86233535469',
      'c95a64ed9b9a67c6ed0a893d62f09b7394cb2156c5852d4a39386ac68b9a98ca',
      '6350c6ee1ebfb745c9010c5fe09ee05bae6b1789ba3a1f13f4cf4626e5165ff3',
      'f4b3859eb6c18a44bc73b5e1d40e908f9d5b5f4bc37c13465302996d78b8a4f4',
      '9b8212b7ee84a18d6684d7255859328fbf339f82b2b805d9c621d93bc515a3fc',
      '1eb3a6a93af299a211c655363efd3411af62f080d4ce5b8b89c402e3d36b07a8',
      '1b90dbeff57dd935f284d94cee866123a76daa4e4af7aefa762527de8463d11c',
      '2d74c1e4167e48ef7332b6a96a14a509c415207b83a1bde4a07adb8de89830a5',
      '6481ea357088457b33cce5359ca27d9bca62ec2b8bf6747df752d7c38ca06386',
      '519f4274aa42a82f4cf16806686e7c0e17930e30b5b5511acd21771ad504be50',
      '18f1f3880ba71486b8599fbc4a15d2073ef5e0badaab4dfb246ad1efd96cdb27',
      '846225aff7916ce333f8d1fe3ee5cc9c78caa5797e67f6db5e14f8474f9110ed',
      '8faf9ea03ce79b8d9433678c0055864cfef89ebad4c64f725ae2731f88f56b1e',
      'cc97cfbb97842e80ec8cb7be3afd5c767a51253296568674d82323e8b94eb062',
      '3e62cfb8e35c36e4381d291608b39ed0dead64e6e54a051d50b4eb53ddadc3ae',
      '951c4910e80107ba689ca6e145df071f572853c569570c63ea2cb939e6afe006',
      '3b958d8024f2ce7e097f218266e39b11b1e5ccb952f6f5cb7d72e1eacd65f396',
      '22ccbf5be983b5b8381fdf5587e5759674d33ca9738ce62e1b7dd3b405b29718',
      '722fefc17c268e9df186b4d89742ec30b6bc71e242bb0049254c129be8236982',
      'ebefbe24c064162d220610d66292a77a58eccdbd65094b8ba813be2746932071',
      '3382e34e85ff416a23a892e0dc30c37460024aa0d2dcb51d1606388d600b1af1',
      '3f78b5979446f33c53f7cdf07c07000779c41032ff1719e5346a54f659764dd2',
      '472174f13a0e14d5bcac9a1ea031e525a3539158510186a04c5c6442739926cd',
      'f44cea5575c60eb203f7c01c8f0b53dd02b1c8f01d4c8e101e19baafa9d1be4c',
      '8e90f8d5277f8024dd85664db59bd37feccc498df0d68edc4bec2632409be06a',
      '2fe868504d0c42b93e47b59972a85e334a38f6a48f1bc785ce30977a929ee858',
      '4d2aebe073c1d36dda4f12f39a5efc5895af11e6601f0b8c36e40c7ca503eda3',
      '85c229f874b1d315d4bbe62aef86cbc6ee13586039b65d97c8e04caf1cbff8b3',
      '0c0bea7a90c404f9dca57a5e046090b7ba958a9e609cfb8dc621f883965cbc5f',
      '2a5fd105fdb7be500eaefbfa96d6adaa36954eb32d9ba91103dabcef61469898',
      '9fead3141713837f50c79391854421a418ba486d379053a8764290ddebfc26a9',
      '1a14d8d9bf7d63ed69ff4cc49f8d1ea0089a552d6463aca385ec5a521b86f6d2',
      '80f39e0faba8bdc5631477dae43d03be0679ec0330f7e38a44320e100b8fcb73',
      'e543c596f611b5bf8323b4b38173b4daa547f7b4976961e4d27950f9396d4c54',
      '58fdd9f5470dc8cfdeced0030ed129143de6d4acf22b210813b20c95af508543',
      'bb71879047d0714e44d37e6544be05c51e14ba6884ad0f733d25a6ffd1e992cb',
      '81c092571dbf9268b2755b7871c250615e00080767e00e3296cbe8eff859ac93',
      '27b9b000a7864fcb091fee9ec93f786bca6a0aa32cbaad06d6d366b41aa2b7cd',
      'b292b8ce48fd440a1e6c36ca500c7bfd39aa5cd3b4814b1bc460aa2053e99f80',
      '127fe3f95810420b97abe6cf42309e6f51a5ab089b18454a27098cd050a6d38b',
      '306801c6fafa6fdc5dc4b1e483c16295cec2507b7da887efaba98e490b719797',
      'b0693aae7fc7e04e09ef4fc9a48adc58a0fbb91d84865f369cb7aa1d5b2f5e46',
      'ca9af9a882c4a8790801d2a631d6645ee005805362a5dfd9982c188bd09c8c48',
      '0ec704da86fb2bee163a3d2941a201cc64a1fc6016febad6d2defe8d8a9eba0b',
      'c48ae53fb4f1674270eeebdf8551b9b6dac04a8b80a72d75e5587ad3a9e03a00',
      'd1beec7cca334973c971586650cf330fef32844399a2837c23333a80886d02ac',
      'e5e46efb44984c4762f4cc51abca8316c7076198b877a59d2a115e74c365a9e5',
      '33326710b6b283b5c783aef725547cf20e244043e8b4a39fb4970b526aba1a1f',
      '15e66e33e83e711464988e747aa42e2ccb10d8da977d91dc7931617fa49eb7e5',
      '849dda266ec6c0836cc8ed6861592bfd85cfd936644990fcd936dc28e379be1a',
      'fe1ff23427f3fd37acdc6b8603af4f71e6b2b22fcf1c33f5fc6c0cea28819da7',
      '4584d56de2943cd6b6cc2360bbf9b53cf2a82000979384f4a65861582789060a',
      '1ec3c92cbe7f41237b14ced31fc8dbd9fad3a60782d1ebc7330633f2bc372c61',
      '9a72368077a59ecc261af45d81e61c03fa75779dc39e245e42e90be691ac3823',
      'e91ab3c9ed19f2bb2dd3583eaef0d2ceed7cbdbc39791272677c2241d8e8602f',
      'a09e0dce49f2f146d6076a7209ffae4deeadcae082e2cfc0e2d478878383c448',
      '83e4c849953116de538c09c1e6202f0dd0b588bd8f2c4ae4e042b23504e1efb8',
      'de9abb5e48812c979f87c9eaa260afbdeca485b0c8372d475efc7ecca0cbf520',
      'f6a0d62c590216134c58842dc9aebcd4b7f5ef30c14ade89123d84033407156d',
      '199d6d3e17cb99263f36bb38e57ab26ecc84e6dc21f1daade6ff0c65136d2d13',
      'e0829b10676553a42323bd6db150bc60b12369f3ffe2e1919d9bd8781c26a812',
      '487cd8ec550000041e432c5065c5a599f4d7a234ece755b63b1fa0b94c41f566',
      '29063d5236ecd6a0a283155e06f2ba55a2c5f49c6a880c5f434d5ca71603381a',
      '6e234e2518bbedf4cfda943adbeb036e2d6550bc3af33cc80ac5c93886afa94a',
      '8f9e4a8c3d4dba6c165c612ed073fe7b096e529ea29eb21ca8decb1538e1d47c',
      '0fc9bef59317743ccc499cfd6a26e5556c59bec44f39f8a530ceec4d112b8ea1',
      '6c898f65a0ea9eae75d7ef32942320c77068fdf7ade6a8dfaaec5d1e76d9115a',
      'bea6934e13efed8e47e08136ef77366a9eea998091ac3fd70b977a0c330fe015',
      '7314ad362f37d0e04e7a8aec8e276e67be7bde9d3dadf9b8442b0269f8b60b6f',
      'ef4c5c739da8391c41cab89fb0996f18d85c6fd4142719c0259ddde859de2e8d',
      '9a618b1b8dcf25d7ee2a0aaed2b7233729bbce7d1372266e37c0a9d4169a2f89',
      '49e417ec91445f10478b62c98006d1c3c91a6b4afe394528cb025672aa137c85',
      '46aa80321c2707e043d0584d446e9ca83f8c05665c34081a376dac9a333dcc88',
      'bbda855cc3474731e98caaf12f83e00f3531c28a4bdefd2191d34681552a1083',
      '12819aad8034d6b506c49ac6dd5048c4b8ee3f3d10093b49794d61bed1e5936f',
      '68375a4f3bcb09512386bb8f5967dd2fbfe08fc99caa005f6b209169873ac541',
      '9d1c559cb69a6bdbc08d411a6ab1652105b091957ae519e02f18a1b2fa71472b',
      '21dff1d21a30e6928f44af86b583bbc5dbdc87a65ec3503583ba7f1b38f7eb4f',
      'f68e518ceb83acb7e6569bbf071e8ac6f2cddcc88f319da4984622dcd6b19d24',
      '4e7f8bb7ab2b2bd66c6b4b70285878bbbde9350c3a019dffd651f8d9479b8aa4',
      'b3da6bc7754447d92f04ef3de047195cbf3bfce9bb7285e72d655d2f507a2da6',
      '97571c9aa9539a63e8ab5e5e4a57a24e29e595c47e318db7443f33ac3c9e1baa',
      '3334548cbdb496d7a25d9e59fa8328f3a43438714e9aae8d0c0f6cabbd59def7',
      '368f129ab4a83284acbd44b2165b37301919b110cf36764d31469226cf4a626d',
      'e59df1ac3f52774180010a7968f3044b13b3f8afb3d197f4880783b69b5195cc',
      '5954233a0832c93d58bb0ae8c74418d627bbde5ad2e84c39f5d469fd0b3b1270',
      '3922e36050f61506e09a3b0d005028adff97b39da15701650b2bdd7a9f13ceb5',
      '6acd2114d4426fc0fc8533bdeba754cf5664482dfaa91f7338de2ffdb47a040f',
      '419c885ad9710fceff602bec6e5946d1d704cb0348dcec4f104dc1621f67a760',
      '1b7e45fe79af47d06ed103c4f780f3fc0e567c59f26be34cdf7daf7bb26deff5',
      '827ea2399f08974719fb34bcc6b5980c2938673ae9c9997fa2d4ad48f8c56d25',
      'd3fe7b5bc4084e0069056d457ddc6382826e41e991f23596564dbea8c9796611',
      'e01bb7b08cfd8b544711d17b104ce94bbe49e4bc56b23a50b5c99b3d7d4ccbcc',
      'bb368152f70bb83ee198ffac6a552c628b94eca30496ca4a3ea8a81001463c02',
      'db1597722a1b5e214c25e1afb44b2c3c7308b1cde5abc5a3d81242d2292ee26f',
      '241eb918aad1a20cb0e33036952af8a785cb0d6f4a6bfac37b8180b9ef12bd9e',
      '0045314c4ccc5fe714fba039ccedc34335096f8c97e1b4d703c904dae5fd47f3',
      '2e54d644ac0410d7917b05d0f38f0c97c890c7836884ca0f7f5d7b9c1ce4f9c5',
      '942f4d67f6d91bb62f350676543ff7b75aed81fb3f42de220b5b9868b5bb00a4',
      '0d35cd0425d5121667504f3faf88b71fa814c118ea3c09a4f52dafecd48ba289',
      'cbf296b4a8ec2f24068ef640219f0dbda9482db29d4b5ded60aefff3e8404087',
      '70eb3dddcd91c0119da27ca1c7a09ac70583c71e65c7eec7831761af8998f210',
      'd1938d43c63e268c4e45e7e7b4c163c25f6cb0dae9592f166dd0dfd07bb4e268',
      '28945182c4f8e54d399a09179b6a5bbceb70815229957059a6f878e8a4f4a549',
      '496b8af2b844765cdbf0f6c931dc07f02c52fa64fcd061edc72ac30fcbcfbab1',
      '124844b316890bb4b94dc5b8580c8d49f85eab03bcabe3b30ff13f5ff28d0bed',
      'e0b890c46c0c410a2bfb6573f97a45e7e7edb78372b2125bc96c61bb11ae169f',
      '7de8cc23b74618be1c453cc4eac4539f4c9283f908da66cd19917150ac945fbe',
      'b00dd192a9378d97e9f89c79c6b48378078019b803356daf8d94cd8b26494419',
      '673bb3e5d3cee644bd177fd3f795d2fa9d4fe8ba7a551d8627a54d73eb957521',
      '348993ae9dcfcab11f97972dc50905e649376e7137dc641b5cf0f84ca111e553',
      'bc26e5a8153ef66bb4011ce1c92c8c97bd5ca4284883dc23e901a6a4c024f0a6',
      'a613949cb0b8a2b9c5c31ccf8a5cd03886477b6dcd17ae4f3e4169b1ba1dc300',
      '792c308be6d698d576ee040fd3b1edc36834b60dc2691a147eb5493650e30184',
      'cb4e5f2ea5d6eec8e0d6647e453f91780fb420c96b769629986e4598ae983f8b',
      'e77d65573ef5afdb8e60e79cc2c1ca0bbb635121796cced65fa7c8fb83005cf6',
      'fba72cd082a4c9b653edd15ce9a9c531bf91dbf4387d345e4ba8a7e1cf5aba34',
      'a3944b91fd14fb0270e6309cfffe4372359d463f1b41e243c5138be0a97639bd',
      '3013766baaad09b2f3511868dc122195f654a4d97ab181ad00591d7e557c8e18',
      'ff6e5a685912b9194b16ef71a7b50f34038a7eb64ee68a4a8327aa8f86e0c9b1',
      'a795795dbce6d146f624e08554a2a1ec965c74c7c1e5797850de8a49455732c4',
      '6b98c5704d579ead64548eed081a27b9f38eab10e20568d9a836869492f5d905',
      '13ef04c664ee89c324b617a2335296cf054020a197cf84d0fb543bb886b1ce0a',
      'd2ba4d6d151463a7a04dd2cad0b4a6d3ff62868e5de13ac4d0176d2b6a7581bf',
      'a1270509a1ed216a63fcb0aa5cd061d6745e6e7645b6bb6568d8688480461126',
      'a1e8c0025a7ee9c10dc53f5dcc7d98cd56f1c1b367be2285b4b9075b93c388b8',
      '2b27c4e7324ec7dfe4ecbc8dbed7ce34075cd3488e6ba4d6d9d31abc567b9396',
      '28ac32592a27d51d8e19ca9a306b85807803b30dbfa5af35a7f8d567c2556971',
      'a298431fdb20ff8f41077e45bf2eabb7b064771fb4742136a31c201cc14a0cc0',
      '9d46e9d97effb559864f7d5e69e40981b6fdca5682b60fbae9bbd9582b36cca8',
      'e659882a1b39f31aff320a38b332dee1a4977f982eddf52d2b7439d29eb67f35',
      'a0c0ba55197eccf3ff1019608c2d55dffef44fd8ec47aff57946e9b902c955a0',
      '64bdfe3827989387aa0004cc12ab032b6ff4024ca3b9e0ced10e293e99945be5',
      'fef7114a310b71ce819d9c7c51d168fefa36433bde221f8ab35e3143948cb131',
      'f865eda5cd499c08d83f574c206617b2b22d4170e3f0e774bf503207a56a9c6c',
      '61b50d5c6d5460c412da52fa1b887a450a97c95a8d49fbd6f42a2c7549a05537',
      '5e17a15a568f14562318b4ec2a5d06df09c1e350d4d39fc585f77e348acc2520',
      '281c4d57123ac096330f2cb4a2fcb1aa8f4191f2ff2d2bc930940bcf1c99b4a1',
      'c0fd1b6ba466a88229e84694a7891a055d0be310dbb11c5964b21466b9f097ed',
      '8049febba613ec4ecb9e8ab091a0bdaeadec1d9709b66a3c9c14d6f124d2fad1',
      '0977cc1986d180338acd2e9496efa9f4914febec1c81c96ef4895d8f80b22651',
      '121120bb12b8ea8344ca49e03bd1ad4ae6d63806ccfe9bf30c3fac124ff07a65',
      '448c4e365496adf4b8ebfb514391025e4222f37b0a4b23c526fbb9c08b5bf6ae',
      'b81afe1c3622cf91247b619387cec5a3d1cfd215a2ad25dec7919f9848d4c70e',
      '0499afdae83feffbcadabe0b497a263475fb5441e053b7eea82fdb375be4e75c',
      'b843f6b17395e9643dd10da7cc1c8835cac3f4c89d7ffee754481887a0556514',
      'fdfaadd92ea10707397151d2fbabf3967a459e3a051065e99ef43bfead1936de',
      '1c7324434dd0fb05a93b0846815e95351a945916d581c5164d31381a9f88d6db',
      '37ee50eff5c0ceda0abcb280bae86e16c27fd622e4c50610b7d9482d1cf2d917',
      'b3849cd39e696ebb7d8af7c49c0decaa4fbbe15d64b1b3be03cabf794d1a2445',
      'db23ba80d277ef9d5cbd146fde140cfb0f744f11ff6f092705c2d64bce05e7b5',
      'd00c82778aa3e772446e0511407bfd7699b5795c952efdc16dd46b2297120db9',
      'f9745661adf225f0a24cbcf1d677ed4d5687f1e01b04786d454bc334f78f7119',
      'b5e9a8ad0df5b33e8dc611d61bc145cedf0fd5d2b8a47351ed43fbaf38f0fcd5',
      'c6040f35f33451930c696319e4f7977c7039c217eda8211ae3c1076c603d01cd',
      '010480d7befa35c6b029c9ffc2add33acc7fdffe6f34f2a91ba4bdbc0651de9c',
      '9acd6cb310a94d99b338f49598f6b7a916bea19b4846bf8caf5c50b8ab016b74',
    ];

    let addOwnerEncodedDataField;
    let txHash;
    let msgHash;
    let v = [];
    let r = [];
    let s = [];
  // console.log(accounts[150])
  for (let j = 0; j < 100; j++ ) {

    v = [];
    r = [];
    s = [];

    // console.log(accounts[j]);
    addOwnerEncodedDataField = node.contract.addOwner.getData(accounts[j]);

    txHash = web3Utils.soliditySha3('addOwner' + j);

    msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash }, {t: 'address', v: node.address }).substring(2);

    for (let i = 0; i < 2; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'));

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }

    const res = await node.submitTransaction('0x' + msgHash,
      txHash,
      node.address,
      0,
      addOwnerEncodedDataField,
      v,
      r,
      s, {
        from: accounts[0]
      });

    // console.log(res.logs[1]);
  }
    console.log('done adding');

  const owners = await node.getOwners.call();
  console.log(method2(owners));
  console.log(owners.length);
  console.log(owners);
    v = [];
    r = [];
    s = [];

    addOwnerEncodedDataField = node.contract.changeRequirement.getData(owners.length);

    txHash = web3Utils.soliditySha3('changeRequirement');

    msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash }, {t: 'address', v: node.address }).substring(2);

    for (let i = 0; i < 2; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'));

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }

    let res = await node.submitTransaction('0x' + msgHash,
      txHash,
      node.address,
      0,
      addOwnerEncodedDataField,
      v,
      r,
      s, {
        from: accounts[0]
      });

    txHash = web3Utils.soliditySha3('test');

    msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}).substring(2);

    v = [];
    r = [];
    s = [];

    for (let i = 0; i < 150; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'))

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }

    res = await Promise.all([
      node.submitTransaction('0x' + msgHash,
        txHash,
        toAddress,
        0,
        "",
        v,
        r,
        s, {
          from: accounts[0]
        })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      console.log(res[i].logs);
    }

    console.log(cumulativeGasUsed);
  }); */

  /* it("InterChain V2 10 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 10);
    let sideChain = await SideChain.new(accounts, 10);

    const txHash = web3Utils.soliditySha3('test');
    const toAddress = accounts[2];
    const value = 30000000;
    const privateKeys = [
      'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
      'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
      '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
      'c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c',
      '388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418',
      '659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63',
      '82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8',
      'aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7',
      '0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4',
      '8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5'
    ];


    let msgHash = web3Utils.soliditySha3({ t: 'bytes32', v: txHash}, {t: 'address', v: toAddress}, { t: 'uint256', v: 30000000 }).substring(2);
    let v = [];
    let r = [];
    let s = [];

    for (let i = 0; i < privateKeys.length; i++) {
      const sig = EthUtil.ecsign(Buffer.from(msgHash, 'hex'), new Buffer(privateKeys[i], 'hex'));

      v.push(sig.v);
      r.push('0x' + sig.r.toString('hex'));
      s.push('0x' + sig.s.toString('hex'));
    }

    await Promise.all([
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[0],
        r[0],
        s[0], {
          from: accounts[0]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[1],
        r[1],
        s[1], {
          from: accounts[1]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[2],
        r[2],
        s[2], {
          from: accounts[2]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[3],
        r[3],
        s[3], {
          from: accounts[3]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[4],
        r[4],
        s[4], {
          from: accounts[4]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[5],
        r[5],
        s[5], {
          from: accounts[5]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[6],
        r[6],
        s[6], {
          from: accounts[6]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[7],
        r[7],
        s[7], {
          from: accounts[7]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[8],
        r[8],
        s[8], {
          from: accounts[8]
        }),
      sideChain.submitSignature(
        txHash,
        accounts[2],
        30000000,
        '0x' + msgHash,
        v[9],
        r[9],
        s[9], {
          from: accounts[9]
        }),
    ]);

    const signatures = await sideChain.getTransaction.call(
      txHash,
      {
        from: accounts[0]
      });


    let res = await Promise.all([
      node.submitTransaction(txHash,
        '0x' + msgHash,
        accounts[2],
        30000000,
        "",
        signatures[0],
        signatures[1],
        signatures[2], {
        from: accounts[0]
      })
    ]);

    let cumulativeGasUsed = 0;
    for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
      console.log(res[i].logs);
    }
    console.log(cumulativeGasUsed);
  }); */

  /* it("Test Add authority", async function () {
    let node = await InheritnceTester.new(accounts);

    let res = await Promise.all([
      node.owners.call(1),
    ]);

    // console.log(res[0])

    let cumulativeGasUsed = 0;
    /* for (let i = 0; i < res.length; i++) {
      cumulativeGasUsed += res[i].receipt.cumulativeGasUsed;
    }
  }); */
});