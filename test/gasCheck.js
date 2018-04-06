"use strict";

let EthUtil = require('ethereumjs-util');
let web3Utils = require('web3-utils');

let InterChain = artifacts.require('InterChain.sol');
let InterChainV2 = artifacts.require('InterChainV2.sol');

contract('GasCheck Test', function(accounts) {
  it("InterChain V1 1 signer Required", async function () {
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
  });

  it("InterChain V2 10 signer Required", async function () {
    let node = await InterChainV2.new(accounts, 10);

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
});