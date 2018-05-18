pragma solidity ^0.4.21;

import "./libs/MultiSigOwnable.sol";
import "./libs/Freezable.sol";

contract MainChain is Freezable {
    //////////////////////
    //	 CONSTANTS
    /////////////////////
    uint8 public constant VERSION = 1;

    //////////////////////
    //	 EVENTS
    /////////////////////
    event Execution(bytes32 indexed txHash);
    event ExecutionFailure(bytes32 indexed txHash);
    event Deposit(address indexed sender, address indexed to, uint value);
    event BlackListed(bytes32 indexed txHash);
    event UnBlackListed(bytes32 indexed txhash);
    event EmergencyWithdrawal(bytes32 hashedParam, address indexed destination, uint256 value, bytes data);

    //////////////////////
    //	 Modifiers
    /////////////////////
    modifier transactionDoesNotExists(bytes32 txHash) {
        require(transactions[txHash].destination == 0);
        _;
    }

    modifier notNull(address _address) {
        require(_address != 0);
        _;
    }

    modifier txNotBlackListed(bytes32 txHash) {
        require(!isBlackListed[txHash]);
        _;
    }

    modifier txBlackListed(bytes32 txHash) {
        require(isBlackListed[txHash]);
        _;
    }

    modifier onlyWhenNotFrozen() {
        require(!checkIfFrozen());
        _;
    }

    modifier onlyWhenFrozen() {
        require(checkIfFrozen());
        _;
    }

    ////////////////////////
    //	 Storage Variables
    ////////////////////////
    mapping (bytes32 => Transaction) public transactions;
    mapping (bytes32 => EmergencyTx) public emergencyTxs;
    mapping (address => mapping(address => bool)) public emergencyTxConfirmation;
    mapping (bytes32 => bool) public isBlackListed;
    uint256 public transactionCount;

    ////////////////////////
    //	 Structs
    ////////////////////////
    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
    }

    struct EmergencyTx {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
        address[] confirmations;
        mapping(address => bool) isConfirmed;
    }



    /////////////////////////
    //	 Public Functions
    ////////////////////////

    /// @dev Contract constructor sets initial owners and required number of confirmations.
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    function MainChain(address[] _owners, uint8 _required) Freezable(_owners, _required) public {}

    /// @dev Allows to deposit ETH into the contract
    /// @param to the destination address where user wish to received the funds on sidechain
    function deposit(address to)
      onlyWhenNotFrozen
      notNull(to)
      payable
      public {
        require(msg.value > 0);
        emit Deposit(msg.sender, to, msg.value);
    }

	/// @dev submit a transaction to be processed
	/// @param txHash transaction hash of the deposit tx in side chain
	/// @param destination destination provided in deposit tx in side chain
	/// @param value msg.value of deposit tx in side chain
	/// @param data data of deposit tx in side chain
	/// @param v list of v part of sig
	/// @param r list of r part of sig
	/// @param s list of s part of sig
    function submitTransaction(bytes32 txHash, address destination, uint256 value, bytes data, uint8[] v, bytes32[] r, bytes32[] s)
	  notNull(destination)
	  transactionDoesNotExists(txHash)
	  txNotBlackListed(txHash)
	  onlyWhenNotFrozen
	  public {
        require(v.length >= required);

        bytes32 msgHash = keccak256(byte(0x19), VERSION, address(this),txHash, destination, value, data);

        // execute the transaction after all checking the signatures
        require (hasEnoughRequiredSignatures(msgHash, v, r, s));

        if (external_call(destination, value, data.length, data)) {
            addTransaction(txHash, destination, value, data);
            emit Execution(txHash);
        } else {
            emit ExecutionFailure(txHash);
        }
    }

    /// @dev Allow to add a txHash to blacklist which will prevent a submitTransaction with txHash to fail
    /// @param txHash to be blackListed
    function addBlackList(bytes32 txHash)
      onlyByWallet
      onlyWhenNotFrozen
      txNotBlackListed(txHash)
      public {
        isBlackListed[txHash] = true;

        emit BlackListed(txHash);
    }

    /// @dev Remove a particular txHash from the blacklist
    /// @param txHash to be removed from blackListed
    function removeBlackList(bytes32 txHash)
      onlyByWallet
      onlyWhenNotFrozen
      txBlackListed(txHash)
      public {
        isBlackListed[txHash] = false;

        emit UnBlackListed(txHash);
    }

    /// @dev Allows owner to move funds when frozen
    /// @param destination target destination
    /// @param value ether value
    /// @param data data payload
    function emergencyWithdrawal(address destination, uint256 value, bytes data)
      onlyWhenFrozen
      ownerExists(msg.sender)
      public {
        bytes32 hashedParam = keccak256(destination, value, data);

        EmergencyTx storage transaction = emergencyTxs[hashedParam];

        // store the param for audit sake
        if (transaction.destination == address(0)) {
            transaction.destination = destination;
            transaction.value = value;
            transaction.data = data;
        }

        require(!transaction.executed); // make sure the transaction is not executed
        require(!transaction.isConfirmed[msg.sender]); // make sure the msg.sender is in the confirmed list

        transaction.isConfirmed[msg.sender] = true;
        transaction.confirmations.push(msg.sender);

        if (transaction.confirmations.length >= required) {
            if (external_call(destination, value, data.length, data)) {
                transaction.executed = true;
                emit EmergencyWithdrawal(hashedParam, destination, value, data);
            } else {
                emit ExecutionFailure(hashedParam);
            }
        }
    }


    /////////////////////////
    //	 Private Functions
    ////////////////////////

    /// @dev checks all the signatures and make sure they are from the owners
    /// @param msgHash messageHash that signers singed
    /// @param v , r, s signatures
    /// @return boolean
    function hasEnoughRequiredSignatures(bytes32 msgHash, uint8[] v, bytes32[] r, bytes32[] s) view private returns(bool){
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

    /// @dev check that no duplicate exists
    /// @param list array to be checked
    /// @param toCheck element to check for
    function duplicateExists(address[] list, address toCheck) pure private returns(bool) {
        for (uint8 i = 0; i < list.length; i++) {
            if (list[i] == toCheck) return true;
        }
        return false;
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

    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @param txHash Transaction transactionHash
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    function addTransaction(bytes32 txHash, address destination, uint value, bytes data)
        notNull(destination)
        private {
        transactions[txHash] = Transaction({
            destination: destination,
            value: value,
            data: data
            });
        transactionCount += 1;
    }
}
