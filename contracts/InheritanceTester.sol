pragma solidity ^0.4.21;

import './libs/MultiSigOwnable.sol';

contract InheritanceTester is MultiSigOwnable {
	function InheritanceTester(address[] _owners, uint8 _required) MultiSigOwnable(_owners, _required) public {
	}
}
