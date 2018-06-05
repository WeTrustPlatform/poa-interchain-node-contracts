[![Build Status](https://travis-ci.com/WeTrustPlatform/interchain-node-contracts.svg?token=52dbeJVrfqXvGhWfS1U6&branch=develop)](https://travis-ci.com/WeTrustPlatform/interchain-node-contracts)

# Interchain-node-contracts

These smart contracts are designed with intention to be used as part of the interchain nodes where money is transferred between two different blockchains (Main Chain and Side Chain).

There are a couple of assumption that were made in designing these smart contracts:

- The Fees on Main Chain will be significantly higher than on the side chain.
- Transaction speed on Main Chain is lower than side chain.
- If user can send Funds from a non-smart contract account to our smart contract on main chain, he/she will also be able to receive funds at that account in the side chain and vice-versa.
- Upgrade is imminent (We'll most likely need to upgrade at some point in the future).

## Features
- **Minimize Gas Usage**    
Unlike traditional multi signature wallet smart contracts where each authority submits a transaction on chain to approve a transaction, this version assume that the transactions are signed offline and is submitted to main chain once. This not only help reduce the network traffic on the main chain, but also minimize the gas used by a factor of 1/3 when 10 signatures are required. This is expected to reduce further if full versions were used (Tested with happy flow version of both traditional and bitcoin style multi-sig wallet).   

- **Escape Hatch**    
To deal with the case of hacks and other un-foreseen events that would allow user to drain funds from the contract, contract Frozen and Unfrozen functions are implemented.    

- **Upgradability**   
The flow to upgrade would be as follow:
  - Owners call Freeze function to freeze permanently.
  - Deploy new version of the smart contract, setting appropriate version number and point to current contract address in previousVersionAddress.

- **Support ERC20 Token**
- **Prevent Replay Attack**
- **Audibility**

## Getting Started
### Prerequisites
- Node v5+

### Install

```
git clone git@github.com:WeTrustPlatform/interchain-node-contracts.git
cd interchain-node-contracts
npm install
```

## Test
[Truffle](http://truffleframework.com/docs/getting_started/testing) is used as the test framework.

**Run contract test:**
```
npm test
```


## Code style

```
npm run lint
```

## Built With

* [Solidity](http://solidity.readthedocs.io/en/v0.4.24/)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags](https://github.com/WeTrustPlatform/interchain-node-contracts/tags) on this repository.

## Security
All contracts are WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

## Acknowledgments
This version of Multi Signature Smart Contract is inspired by [Gnosis MultiSig Wallet](https://github.com/gnosis/MultiSigWallet) and inspired by bitcoin's P2SH protocol which is primarily used for creation of multi signature wallets, see [here](https://www.soroushjp.com/2014/12/20/bitcoin-multisig-the-hard-way-understanding-raw-multisignature-bitcoin-transactions/) for more Info.

## License
[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) &copy; WeTrustPlatform
