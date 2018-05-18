pragma solidity ^0.4.21;

import "./MultiSigOwnable.sol";

contract Freezable is MultiSigOwnable {

    //////////////////////
    //	 EVENTS
    /////////////////////
    event contractFrozen(uint256 at);
    // this event is only fired when all the approvals were retracted
    // the contract can also automatically unfreeze if certain amount of time has passed based on number of approvals
    event contractUnFrozen(uint256 at);
    event minFrozenTimeChanged(uint256 oldMin, uint256 newMin);
    event frozenDurationRatioChanged(uint256 oldRatio, uint256 newRatio);


    //////////////////////
    //	 Modifiers
    /////////////////////
    modifier onlyIfNotApproved() {
        require(!approval[msg.sender]);
        _;
    }

    modifier onlyIfApproved() {
        require(approval[msg.sender]);
        _;
    }

    ////////////////////////
    //	 Storage Variables
    ////////////////////////

    // scale factor on how long contract will be frozen for based on the number of approvals
    uint256 public frozenDurationRatio = 8;
    // if only one approval, the contract will be frozen for minTimeFrozen
    uint256 public minTimeFrozen = 1 hours;

    mapping (address => bool) public approval;
    uint256 public approvalCount;
    uint256 public frozenAt;

    /////////////////////////
    //	 Public Functions
    ////////////////////////
    function Freezable(address[] _owners, uint8 _required) MultiSigOwnable(_owners, _required) public {}

    /// @dev check if the contract is in the frozen state
    /// **NOTE** the contract can automatically unfreeze if enough time has elapsed
    function checkIfFrozen() view public returns(bool) {
        if (approvalCount >= required) return true;
        if (frozenAt == 0 || approvalCount == 0) return false;
        else {
            uint256 frozenDuration = minTimeFrozen * (frozenDurationRatio ** (approvalCount - 1));
            if (now < (frozenAt + frozenDuration)) return true;
        }
        return false;
    }

    /// @dev Allows to change the scaling factor of the frozenDuration
    /// @param newRatio the newRatio to be used
    function changeFrozenDurationRatio(uint256 newRatio)
        onlyByWallet
        public {
        emit frozenDurationRatioChanged(frozenDurationRatio, newRatio);
        frozenDurationRatio = newRatio;
    }

    /// @dev Allows to change the minimum time frozen when there is only one approval
    /// @param newMinTime newMinTime to use in seconds
    function changeMinTimeFrozen(uint256 newMinTime)
        onlyByWallet
        public {
        emit minFrozenTimeChanged(minTimeFrozen, newMinTime);
        minTimeFrozen = newMinTime;
    }

    /// @dev Allows an owner to freeze the contract if they suspect malicious activities
    function freeze()
        ownerExists(msg.sender)
        onlyIfNotApproved
        public {
        approval[msg.sender] = true;
        approvalCount++;

        if (frozenAt == 0) {
            frozenAt = now;
            emit contractFrozen(now);
        }
    }

    /// @dev Allows an owner to retract the freeze after determining that contract is not at risk
    function unFreeze()
        ownerExists(msg.sender)
        onlyIfApproved
        public {
        approval[msg.sender] = false;
        approvalCount--;

        if (approvalCount == 0) {
            frozenAt = 0;
            emit contractUnFrozen(now);
        }
    }
}
