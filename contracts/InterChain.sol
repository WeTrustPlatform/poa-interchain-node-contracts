pragma solidity ^0.4.21;

contract InterChain {

	event newTransactionSubmitted(bytes32 txHash, address _to, uint256 _amount);
	event transactionApproved(bytes32 txHash, address authority);
	event transactionExecuted(bytes32 txHash);

	address[] public authorities;
	uint256 public required;
	mapping(bytes32 => Transaction) transactions;
	mapping(bytes32 => mapping(address => bool)) confirmations;

	struct Transaction {
		address to;
		uint256 amount;
		bool executed;
		bool exists;
	}

	function InterChain(address[] _authorities, uint256 _required) public{
		authorities = _authorities;
		required = _required;
	}

	function submitTransaction(bytes32 txHash, address _to, uint256 _amount) public {
		if(!transactions[txHash].exists) {
			Transaction memory transaction = transactions[txHash];
			transaction.exists = true;
			transaction.to = _to;
			transaction.amount = _amount;
			transactions[txHash] = transaction;
			confirmations[txHash][msg.sender] = true;
			emit newTransactionSubmitted(txHash, _to, _amount);
		} else {
			require(transactions[txHash].to == _to);
			require(transactions[txHash].amount == _amount);

			confirmations[txHash][msg.sender] = true;
			emit transactionApproved(txHash, msg.sender);


			if (isConfirmed(txHash)) {
			transactions[txHash].executed = true;
			emit transactionExecuted(txHash);
			}
		}
	}

	function isConfirmed(bytes32 transactionId)
	public
	constant
	returns (bool)
	{
		uint count = 0;
		for (uint i=0; i<authorities.length; i++) {
			if (confirmations[transactionId][authorities[i]])
				count += 1;
			if (count == required)
				return true;
		}
	}

}
