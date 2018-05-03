pragma solidity ^0.4.0;

contract MultiSigOwnable {

	/*
 	 *  Constants
 	 */
	uint256 constant public MAX_OWNER_COUNT = 50;

	event OwnerAddition(address indexed owner);
	event OwnerRemoval(address indexed owner);
	event RequirementChange(uint8 required);

	modifier onlyByWallet() {
		require(msg.sender == address(this));
		_;
	}

	modifier ownerDoesNotExist(address owner) {
		require(!isOwner[owner]);
		_;
	}

	modifier ownerExists(address owner) {
		require(isOwner[owner]);
		_;
	}

	modifier validRequirement(uint ownerCount, uint8 _required) {
		require(ownerCount <= MAX_OWNER_COUNT
		&& _required <= ownerCount
		&& _required != 0
		&& ownerCount != 0);
		_;
	}

	mapping (address => bool) public isOwner;
	address[] public owners;
	uint8 public required;

	function MultiSigOwnable(address[] _owners, uint8 _required) validRequirement(_owners.length, _required) public{
		for (uint i=0; i <_owners.length; i++) {
			require(!isOwner[_owners[i]] && _owners[i] != 0);
			isOwner[_owners[i]] = true;
		}
		owners = _owners;
		required = _required;
	}

	/// @dev Allows to add a new owner. Transaction has to be sent by wallet.
	/// @param owner Address of new owner.
	function addOwner(address owner)
	public
	onlyByWallet
	ownerDoesNotExist(owner)
	validRequirement(owners.length + 1, required)
	{
		isOwner[owner] = true;
		owners.push(owner);
		emit OwnerAddition(owner);
	}

	/// @dev Allows to remove an owner. Transaction has to be sent by wallet.
	/// @param owner Address of owner.
	function removeOwner(address owner)
	public
	onlyByWallet
	ownerExists(owner)
	validRequirement(owners.length - 1, required)
	{
		isOwner[owner] = false;
		for (uint i=0; i<owners.length - 1; i++)
			if (owners[i] == owner) {
				owners[i] = owners[owners.length - 1];
				break;
			}
		owners.length -= 1;

		if (required > owners.length)
			changeRequirement(uint8(owners.length)); // cast to uint8 is safe because MAX_OWNER_COUNT < 256

		emit OwnerRemoval(owner);
	}

	/// @dev Allows to replace an owner with a new owner. Transaction has to be sent by wallet.
	/// @param owner Address of owner to be replaced.
	/// @param newOwner Address of new owner.
	function replaceOwner(address owner, address newOwner)
	public
	onlyByWallet
	ownerExists(owner)
	ownerDoesNotExist(newOwner)
	{
		for (uint i=0; i<owners.length; i++)
			if (owners[i] == owner) {
				owners[i] = newOwner;
				break;
			}
		isOwner[owner] = false;
		isOwner[newOwner] = true;
		emit OwnerRemoval(owner);
		emit OwnerAddition(newOwner);
	}


	/// @dev Returns list of owners.
	/// @return List of owner addresses.
	function getOwners()
	public
	view
	returns (address[])
	{
		return owners;
	}

	/// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
	/// @param _required Number of required confirmations.
	function changeRequirement(uint8 _required)
	public
	onlyByWallet
	validRequirement(owners.length, _required)
	{
		required = _required;
		emit RequirementChange(_required);
	}
}
