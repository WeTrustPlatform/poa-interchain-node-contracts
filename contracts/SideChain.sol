pragma solidity ^0.4.21;

import './libs/MultiSigOwnable.sol';
import './libs/Freezable.sol';

contract SideChain is Freezable {
	//////////////////////
	//	 CONSTANTS
	/////////////////////
	uint8 public constant VERSION = 1;

	//////////////////////
	//	 EVENTS
	/////////////////////
	event Confirmation(address indexed sender, bytes32 indexed txHash);
	event Revocation(address indexed sender, bytes32 indexed txHash);
	event Submission(bytes32 indexed txHash);
	event Execution(bytes32 indexed txHash);
	event ExecutionFailure(bytes32 indexed txHash);
	event Deposit(address indexed sender, address indexed to, uint value);
	event SignatureAdded(bytes32 txHash, uint8 v, bytes32 r, bytes32 s);

	//////////////////////
	//	 Modifiers
	/////////////////////
	modifier notNull(address _address) {
		require(_address != 0);
		_;
	}

	////////////////////////
	//	 Storage Variables
	////////////////////////
	mapping (bytes32 => Transaction) public sideChainTx;
	mapping (bytes32 => mapping(address => bool)) public isSignedSC;
	uint256 sideChainTxCount;

	mapping (bytes32 => Transaction) mainChainTxs;
	mapping (bytes32 => Signatures) mainChainSigs;
	mapping (bytes32 => mapping(address => bool)) public isSignedMC;
	uint256 mainChainTxCount;

	////////////////////////
	//	 Structs
	////////////////////////
	struct Transaction {
		address destination;
		uint256 value;
		bytes data;
		bool executed;
	}

	struct Signatures {
		uint8[] v;
		bytes32[] r;
		bytes32[] s;
	}

	/////////////////////////
	//	 Public Functions
	////////////////////////

	/// @dev Contract constructor sets initial owners and required number of confirmations.
	/// @param _owners List of initial owners.
	/// @param _required Number of required confirmations.
	function SideChain(address[] _owners, uint8 _required) Freezable(_owners, _required) public {
	}

	/// @dev Allows to deposit ETH into the contract
	/// @param to the destination address where user wish to received the funds on mainchain
	function deposit(address to)
	  notNull(to)
	  payable
	  public {
		require(msg.value > 0);
		emit Deposit(msg.sender, to, msg.value);
	}

	/// @dev submit transaction to be processed pending the approvals
	/// @param txHash transaction hash of the deposit tx in main chain
	/// @param destination destination provided in deposit tx in main chain
	/// @param value msg.value of deposit tx in main chain
	/// @param data data of deposit tx in main chain
	function submitTransactionSC(bytes32 txHash, address destination, uint256 value, bytes data)
		ownerExists(msg.sender)
		public {
		require(!isSignedSC[txHash][msg.sender]);
		if (sideChainTx[txHash].destination == address(0)) {
			addTransactionSC(txHash, destination, value, data);
		} else {
			require(sideChainTx[txHash].destination == destination);
			require(sideChainTx[txHash].value == value);
			require(sideChainTx[txHash].data == data);
		}
		isSignedSC[txHash][msg.sender] = true;
		emit Confirmation(msg.sender, txHash);
		executeTransaction(txHash);
	}

	/// @dev Allows an owner to revoke a confirmation for a transaction.
	/// @param txHash to revoke confirmation
	function revokeConfirmation(bytes32 txHash)
	  ownerExists(msg.sender)
	  public {
		require(!sideChainTx[txHash].executed);
		require(isSignedSC[txHash][msg.sender]);

		isSignedSC[txHash][msg.sender] = false;
		emit Revocation(msg.sender, txHash);
	}

	/// @dev Allows anyone to execute a confirmed transaction.
	/// @param txHash to be executed
	function executeTransaction(bytes32 txHash)
	  public {
		require(isSignedSC[txHash][msg.sender]);
		require(!sideChainTx[txHash].executed);
		if (isConfirmed(txHash)) {
			Transaction storage txn = sideChainTx[txHash];
			txn.executed = true;
			if (external_call(txn.destination, txn.value, txn.data.length, txn.data))
				emit Execution(txHash);
			else {
				emit ExecutionFailure(txHash);
				txn.executed = false;
			}
		}
	}

	/// @dev Returns the confirmation status of a transaction.
	/// @return Confirmation status.
	function isConfirmed(bytes32 txHash)
	  view
	  public
	  returns(bool) {
		uint count = 0;
		for (uint i=0; i<owners.length; i++) {
			if (isSignedSC[txHash][owners[i]])
				count += 1;
			if (count == required)
				return true;
		}
	}

	/// @dev Returns number of confirmations of a transaction.
	/// @return Number of confirmations.
	function getConfirmationCount(bytes32 txHash)
	  view
	  public
	  returns(uint count) {
		for (uint i=0; i<owners.length; i++)
			if (isSignedSC[txHash][owners[i]])
				count += 1;
	}

	/// @dev Returns array with owner addresses, which confirmed transaction.
	/// @return Returns array of owner addresses.
	function getSigners(bytes32 txHash)
	  view
	  public
	  returns(address[] _isSignedSC) {
		address[] memory isSignedSCTemp = new address[](owners.length);
		uint count = 0;
		uint i;
		for (i=0; i<owners.length; i++)
			if (isSignedSC[txHash][owners[i]]) {
				isSignedSCTemp[count] = owners[i];
				count += 1;
			}
		_isSignedSC = new address[](count);
		for (i=0; i<count; i++)
			_isSignedSC[i] = isSignedSCTemp[i];
	}

	/////////////////////////
	//	 Private Functions
	////////////////////////


	/// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
	/// @param txHash Transaction transactionHash
	/// @param destination Transaction target address.
	/// @param value Transaction ether value.
	/// @param data Transaction data payload.
	function addTransactionSC(bytes32 txHash, address destination, uint value, bytes data)
	  notNull(destination)
	  private {
		sideChainTx[txHash] = Transaction({
			destination: destination,
			value: value,
		  executed: false,
			data: data
			});
		sideChainTxCount += 1;
	}

	// call has been separated into its own function in order to take advantage
	// of the Solidity's code generator to produce a loop that copies tx.data into memory.
	function external_call(address destination, uint value, uint dataLength, bytes data) private returns(bool) {
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

	//////////////////////////////////////////////
	// SUBMIT SIGNATURES TO WITHDRAW ON MAINCHAIN
	//////////////////////////////////////////////

	/// @dev store signature to be submitted in mainchain
	/// @param msgHash sha3 hash of txHash destination value data and VERSION
	/// @param txHash transaction hash of the deposit tx in side chain
	/// @param destination destination provided in deposit tx in side chain
	/// @param value msg.value of deposit tx in side chain
	/// @param data data of deposit tx in side chain
	/// @param v part of sig
	/// @param r part of sig
	/// @param s part of sig
	function submitSignatureMC(bytes32 msgHash, bytes32 txHash, address destination, uint256 value, bytes data, uint8 v, bytes32 r, bytes32 s)
	  ownerExists(msg.sender)
	  notNull(destination)
	  public {
		require(!isSignedMC[txHash][msg.sender]);

		address signer = ecrecover(msgHash, v, r, s);
		require(msg.sender == signer);

		bytes32 hashedTxParams = keccak256(txHash, destination, value, data, VERSION);
		require(hashedTxParams == msgHash);

		if(mainChainTxs[txHash].destination == address(0)){
			addTransactionMC(txHash, destination, value, data);
		}

		addSignatureMC(txHash, v, r, s);

		isSignedMC[txHash][msg.sender] = true;
		emit SignatureAdded(txHash, v, r, s);
	}

	/// @dev store the signature
	function addSignatureMC(bytes32 txHash, uint8 v, bytes32 r, bytes32 s) private {
		mainChainSigs[txHash].v.push(v);
		mainChainSigs[txHash].r.push(r);
		mainChainSigs[txHash].s.push(s);
	}

	/// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
	/// @param txHash Transaction transactionHash
	/// @param destination Transaction target address.
	/// @param value Transaction ether value.
	/// @param data Transaction data payload.
	function addTransactionMC(bytes32 txHash, address destination, uint256 value, bytes data)
	  notNull(destination)
	  private {
		mainChainTxs[txHash] = Transaction({
			destination: destination,
			value: value,
			executed: false,
			data: data
			});
		mainChainTxCount += 1;
	}

	/// @dev retrieve the value and signatures of a txHash
	/// @param txHash to get
	function getTransactionMC(bytes32 txHash)
	  view
	  public
	  returns(address destination, uint256 value, bytes data, uint8[] v, bytes32[] r, bytes32[] s) {
		Transaction storage tempTx = mainChainTxs[txHash];
		Signatures storage tempSigs = mainChainSigs[txHash];
		return (tempTx.destination, tempTx.value, tempTx.data, tempSigs.v, tempSigs.r, tempSigs.s);
	}
}
