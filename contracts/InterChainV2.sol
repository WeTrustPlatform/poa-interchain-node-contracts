pragma solidity ^0.4.0;

contract InterChainV2 {

	event transactionExecuted(bytes32 txHash);
	event authorityAdded(address t);
	event externalCallResult(bool res);
	event addressRecovered(address recovered);
	event hashedMessage(address to, bytes32 hashed, bytes32 msgHash);

	address[] public authorities;
	uint256 public required;
	mapping(bytes32 => Transaction) transactions;
	mapping(bytes32 => mapping(address => bool))confirmations;

	struct Transaction {
		address to;
		uint256 amount;
		bool executed;
		bool exists;
		address[] confirmations;
	}

	modifier onlyWallet() {
		require(msg.sender == address(this));
		_;
	}

	function InterChainV2(address[] _authorities, uint256 _required) public{
		authorities = _authorities;
		required = _required;
	}

	// here we will assume that the msgHash is sha3 of msg in the following format
	// sha3(txHash, to, value)
	function submitTransaction(bytes32 msgHash,bytes32 txHash, address to, uint256 value, uint8[] v, bytes32[] r, bytes32[] s) public {
		require(!transactions[txHash].exists);
		require(v.length == r.length && r.length == s.length);

		bytes32 hashed = keccak256(txHash, to, value);
		emit hashedMessage(to, hashed, msgHash);
		require(hashed == msgHash);

		address[] memory confirmed = new address[](v.length);
		uint confirmedCount;

		for (uint8 i = 0; i < v.length; i++) {
			address res = ecrecover(msgHash, v[i], r[i], s[i]);
			for (uint8 j = 0; j < confirmed.length; j++) {
				require(res != confirmed[j]);
			}
			confirmed[i] = res;
			confirmedCount++;

			transactions[txHash].confirmations = confirmed;

			if(confirmedCount >= required) {
				transactions[txHash].to = to;
				transactions[txHash].amount = value;
				transactions[txHash].executed = true;
				transactions[txHash].exists = true;
				emit transactionExecuted(txHash);
			}
		}
	}

	function callAddAuthority () public {
		bytes memory data = '000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000247065cb4800000000000000000000000042eb768f2244c8811c63729a21a3569731535f0600000000000000000000000000000000000000000000000000000000';
		bool res = external_call(address(this), 0, data.length, data);
		emit externalCallResult(res);
	}

	function external_call(address destination, uint value, uint dataLength, bytes data) private returns (bool) {
		bool result;
		assembly {
			let x := mload(0x40)   // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
			let d := add(data, 32) // First 32 bytes are the padded length of data, so exclude that
			result := call(
			sub(gas, 34710),   // 34710 is the value that solidity is currently emitting
			// It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
			// callNewAccountGas (25000, in case the destination address does not exist and needs creating)
			destination,
			value,
			d,
			dataLength,        // Size of the input (in bytes) - this is what fixes the padding problem
			x,
			0                  // Output is ignored, therefore the output size is zero
			)
		}
		return result;
	}

	function addAuthority(address t) onlyWallet internal {
		emit authorityAdded(t);
	}

	function isContract(address addr) internal view returns (bool) {
		uint size;
		assembly { size := extcodesize(addr) }
		return size > 0;
	}

	function recoverAddr(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
		return ecrecover(msgHash, v, r, s);
	}
}
