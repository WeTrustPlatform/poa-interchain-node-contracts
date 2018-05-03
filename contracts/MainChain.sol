pragma solidity ^0.4.21;

import './libs/MultiSigOwnable.sol';
import './libs/Freezable.sol';

/// @title Multisignature wallet - Allows multiple parties to agree on transactions before execution.
/// @author Stefan George - <stefan.george@consensys.net>
contract MainChain is Freezable {

	/*
	 *  Events
	 */
	event Execution(bytes32 indexed txHash);
	event ExecutionFailure(bytes32 indexed txHash);
	event Deposit(address indexed sender, address indexed to, uint value);

	/*
	 *  Storage
	 */
	mapping (bytes32 => Transaction) public transactions;
	uint256 public transactionCount;

	struct Transaction {
		address destination;
		uint256 value;
		bytes data;
	}

	/*
	 *  Modifiers
	 */

	modifier transactionDoesNotExists(bytes32 txHash) {
		require(transactions[txHash].destination == 0);
		_;
	}

	modifier notNull(address _address) {
		require(_address != 0);
		_;
	}

	/*
	 * Public functions
	 */
	/// @dev Contract constructor sets initial owners and required number of confirmations.
	/// @param _owners List of initial owners.
	/// @param _required Number of required confirmations.
	function MainChain(address[] _owners, uint8 _required) Freezable(_owners, _required)
	public
	{
	}

	function deposit(address to) notNull(to) payable public {
		require(msg.value > 0);
		emit Deposit(msg.sender, to, msg.value);
	}

	/// @dev Allows an owner to submit and confirm a transaction.
	/// @param destination Transaction target address.
	/// @param value Transaction ether value.
	/// @param data Transaction data payload.
	/// @return Returns transaction ID.
	// @TODO we need to add a mechanism to allow owners to withdraw even when frozen
	function submitTransaction(bytes32 msgHash, bytes32 txHash, address destination, uint256 value, bytes data, uint8[] v, bytes32[] r, bytes32[] s)
	public
	notNull(destination)
	transactionDoesNotExists(txHash)
	returns (bytes32)
	{
		require(!checkIfFrozen());
		require(v.length >= required);

		bytes32 hashedTxParams = keccak256(txHash, destination, value, data);
		require(hashedTxParams == msgHash);

		// execute the transaction after all checking the signatures
		require (hasEnoughRequiredSignatures(msgHash, v, r, s));

		if (external_call(destination, value, data.length, data)) {
			addTransaction(txHash, destination, value, data);
			emit Execution(txHash);
		} else {
			emit ExecutionFailure(txHash);
		}
	}

	function hasEnoughRequiredSignatures(bytes32 msgHash, uint8[] v, bytes32[] r, bytes32[] s) internal view returns(bool){
		address[] memory confirmed = new address[](v.length);
		uint8 confirmedCount;

		for (uint8 i = 0; i < v.length; i++) {
			address result = ecrecover(msgHash, v[i], r[i], s[i]);

			if (!duplicateExists(confirmed, result)) {
				confirmed[i] = result;
				confirmedCount++;
			}

			if (confirmedCount >= required) return true;
		}
		return false;
	}

	function duplicateExists(address[] list, address toCheck) internal pure returns (bool) {
		for (uint8 i = 0; i < list.length; i++) {
			if (list[i] == toCheck) return true;
		}
		return false;
	}

	// call has been separated into its own function in order to take advantage
	// of the Solidity's code generator to produce a loop that copies tx.data into memory.
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

	/*
	 * Internal functions
	 */
	/// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
	/// @param destination Transaction target address.
	/// @param value Transaction ether value.
	/// @param data Transaction data payload.
	/// @return Returns transaction ID.
	// @TODO we need to add mechanism to blacklist certain txHash
	function addTransaction(bytes32 txHash, address destination, uint value, bytes data)
	internal
	notNull(destination)
	{
		transactions[txHash] = Transaction({
			destination: destination,
			value: value,
			data: data
			});
		transactionCount += 1;
	}
}