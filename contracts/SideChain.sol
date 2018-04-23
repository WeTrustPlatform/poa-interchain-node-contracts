pragma solidity ^0.4.0;

contract SideChain {

	event hashedMessage(address to, bytes32 hashed, bytes32 msgHash);
	event signatureAdded(bytes32 txHash, uint8 v, bytes32 r, bytes32 s);

	modifier onlyByAuthority (address toCheck) {
		require(isAuthority[toCheck]);
		_;
	}

	address[] public authorities;
	mapping (address => bool) isAuthority;
	uint256 public required;
	mapping (bytes32 => Transaction) transactions;
	mapping (bytes32 => mapping(address => bool)) signedTx;

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

		for (uint i=0; i< _authorities.length; i++) {
			require(!isAuthority[_authorities[i]] && _authorities[i] != 0);
			isAuthority[_authorities[i]] = true;
		}
	}


	function submitSignature(bytes32 txHash, address to, uint256 amount, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public
		onlyByAuthority(msg.sender)
	{
		require(!signedTx[txHash][msg.sender]);

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

		transactions[txHash].confirmations.v.push(v);
		transactions[txHash].confirmations.r.push(r);
		transactions[txHash].confirmations.s.push(s);

		signedTx[txHash][msg.sender] = true;
		emit signatureAdded(txHash, v, r, s);
	}

	function getTransaction(bytes32 txHash) public returns (uint8[] v, bytes32[] r, bytes32[] s) {
		require(transactions[txHash].exists);
		return (transactions[txHash].confirmations.v, transactions[txHash].confirmations.r, transactions[txHash].confirmations.s);
	}

}
