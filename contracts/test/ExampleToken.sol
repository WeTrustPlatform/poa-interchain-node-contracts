// Based on https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/StandardToken.sol .
//
// An example ERC20 token, used for testing.
pragma solidity ^0.4.8;

/**
 * Standard ERC20 token
 *
 * https://github.com/ethereum/EIPs/issues/20
 * Based on code by FirstBlood:
 * https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract ExampleToken {

	event Transfer(address from, address to, uint256 amount);
	event Approval(address owner, address spender, uint256 amount);

	mapping(address => uint256) balances;
	mapping(address => mapping (address => uint256)) allowed;

	function ExampleToken(address[] accounts) public {
		for (uint16 i = 0; i < accounts.length; ++i) {
			balances[accounts[i]] = 100000000000000000000; // 1e20
		}
	}
	// This is a method used only for tests.
	function injectTokens(address to, uint256 howMuch) external {
		balances[to] = balances[to] + howMuch;
	}

	// See ERC20
	function transfer(address _to, uint256 _value) external returns (bool) {
		if (balances[msg.sender] >= _value && _value > 0) {
			balances[msg.sender] -= _value;
			balances[_to] += _value;
			emit Transfer(msg.sender, _to, _value);
			return true;
		}
		return false;
	}

	// See ERC20
	function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
		if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
			balances[_to] += _value;
			balances[_from] -= _value;
			allowed[_from][msg.sender] -= _value;
			emit Transfer(_from, _to, _value);
			return true;
		}
		return false;
	}

	// See ERC20
	function balanceOf(address _owner) view external returns (uint256) {
		return balances[_owner];
	}

	// See ERC20
	function approve(address _spender, uint256 _value) external returns (bool) {
		allowed[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

	// See ERC20
	function allowance(address _owner, address _spender) view external returns (uint256) {
		return allowed[_owner][_spender];
	}
}
