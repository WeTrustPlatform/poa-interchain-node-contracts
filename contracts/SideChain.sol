pragma solidity ^0.4.0;

contract SideChain {

	event hashedMessage(address to, bytes32 hashed, bytes32 msgHash);
	event signatureAdded(bytes32 txHash, uint8 v, bytes32 r, bytes32 s);

	address[] public authorities;
	uint256 public required;
	mapping (bytes32 => Transaction) transactions;

	struct Transaction {
		address to;
		uint256 amount;
		bool executed;
		bool exists;
		signatures confirmations;
	}

	struct signatures {
		uint8[] v;
		bytes32[] r;
		bytes32[] s;
	}

	function SideChain(address[] _authorities, uint256 _required) public{
		authorities = _authorities;
		required = _required;
	}

	function submitSignature(bytes32 txHash, address to, uint256 amount, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public  {
		bytes32 hashed = keccak256(txHash, to, amount);

		emit hashedMessage(to, hashed, msgHash);
		require(hashed == msgHash);

		if(transactions[txHash].exists){
			require(transactions[txHash].to == to);
			require(transactions[txHash].amount == amount);


		} else {
			transactions[txHash].to = to;
			transactions[txHash].amount = amount;
			transactions[txHash].executed = false;
			transactions[txHash].exists = true;

		}

		transactions[txHash].signatures.v.push(v);
		transactions[txHash].signatures.r.push(r);
		transactions[txHash].signatures.s.push(s);

		emit signatureAdded(txHash, v, r, s);
	}

	function getTransaction(bytes32 txHash, uint) public returns (uint8[] v, bytes32[] r, bytes32[] s) {
		require(transactions[txHash].exists);
		return (transactions[txHash].signatures.v, transactions[txHash].signatures.r, transactions[txHash].signatures.s);
	}

}
