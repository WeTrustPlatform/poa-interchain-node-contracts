pragma solidity ^0.4.21;

contract InterChain {

	event newTransactionSubmitted(uint256 txHash, address _to, uint256 _amount);
	event transactionApproved(uint256 txHash, address authority);
	event transactionExecuted(uint256 txHash);

	address[] public authorities;
	uint256 public required;
	mapping(uint256 => Transaction) transactions;

	struct Transaction {
		address to;
		uint256 amount;
		bool executed;
		bool exists;
		address[] confirmed;
	}

	function InterChain(address[] _authorities, uint256 _required) public{
		authorities = _authorities;
		required = _required;
	}

	function submitTransaction(uint256 txHash, address _to, uint256 _amount) public {
		if(!transactions[txHash].exists) {
			Transaction memory transaction = transactions[txHash];
			transaction.exists = true;
			transaction.to = _to;
			transaction.amount = _amount;
			transactions[txHash] = transaction;
			transactions[txHash].confirmed.push(msg.sender);
			emit newTransactionSubmitted(txHash, _to, _amount);
		} else {
			require(transactions[txHash].to == _to);
			require(transactions[txHash].amount == _amount);

			transactions[txHash].confirmed.push(msg.sender);
			emit transactionApproved(txHash, msg.sender);

			if (transactions[txHash].confirmed.length >= required) {
			transactions[txHash].executed = true;
			emit transactionExecuted(txHash);
			}
		}
	}

}
