pragma solidity ^0.4.21;

import './MultiSigOwnable.sol';

contract Freezable is MultiSigOwnable {

	event contractFrozen(uint256 at);
	event contractUnFrozen(uint256 at);
	event minFrozenTimeChanged(uint256 oldMin, uint256 newMin);
	event frozenDurationRatioChanged(uint256 oldRatio, uint256 newRatio);

	uint256 public frozenDurationRatio = 8; // based on Num of approvals, frozenDuration will be increase by ratio ^ approvalCount
	uint256 public minTimeFrozen = 1 hours;

	mapping (address => bool) public approval;
	uint256 public approvalCount;
	uint256 public frozenAt;

	modifier onlyIfNotApproved() {
		require(!approval[msg.sender]);
		_;
	}

	modifier onlyIfApproved() {
		require(approval[msg.sender]);
		_;
	}

	function Freezable(address[] _owners, uint8 _required) MultiSigOwnable(_owners, _required) public {
	}

	function checkIfFrozen() view public returns(bool){
		if (approvalCount >= required) return true;
		if (frozenAt == 0 || approvalCount == 0) return false;
		else {
			uint256 frozenDuration = minTimeFrozen * (frozenDurationRatio ** (approvalCount - 1));
			if (now < (frozenAt + frozenDuration)) return true;
		}
		return false;
	}

	function changeFrozenDurationRatio(uint256 newRatio) onlyByWallet public {
		emit frozenDurationRatioChanged(frozenDurationRatio, newRatio);
		frozenDurationRatio = newRatio;
	}

	function changeMinTimeFrozen(uint256 newMinTime) onlyByWallet public {
		emit minFrozenTimeChanged(minTimeFrozen, newMinTime);
		minTimeFrozen = newMinTime;
	}

	function freeze() ownerExists(msg.sender) onlyIfNotApproved public {
		approval[msg.sender] = true;
		approvalCount++;

		if (frozenAt == 0) {
			frozenAt = now;
			emit contractFrozen(now);
		}
	}

	function unFreeze() ownerExists(msg.sender) onlyIfApproved public {
		approval[msg.sender] = false;
		approvalCount--;

		if (approvalCount == 0) {
			frozenAt = 0;
			emit contractUnFrozen(now);
		}

	}
}
