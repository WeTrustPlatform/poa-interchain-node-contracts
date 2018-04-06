pragma solidity ^0.4.0;

contract InterChainV2 {

	event transactionExecuted(bytes32 txHash);
	event addressRecovered(address recovered);
	event hashedMessage(address to, bytes32 hashed, bytes32 msgHash);

	address[] public authorities;
	uint256 public required;
	mapping(bytes32 => Transaction) transactions;

	struct Transaction {
		address to;
		uint256 amount;
		bool executed;
		bool exists;
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

			if(confirmedCount >= required) {
				transactions[txHash].to = to;
				transactions[txHash].amount = value;
				transactions[txHash].executed = true;
				transactions[txHash].exists = true;
				emit transactionExecuted(txHash);
			}
		}
	}

	function recoverAddr(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public returns (address) {
		return ecrecover(msgHash, v, r, s);
	}
}
