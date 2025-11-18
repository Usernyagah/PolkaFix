// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolkaFix is Ownable {
    IERC20 public immutable wDOT;

    struct Bounty {
        string title;
        string description;
        string issueUrl;
        uint256 reward;
        address payable submitter;
        string fixPR;
        bool resolved;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) hasVoted;
    }

    Bounty[] public bounties;

    event BountyPosted(uint256 id, string title, uint256 reward);
    event FixSubmitted(uint256 id, address submitter, string prLink);
    event Voted(uint256 id, address voter, bool approve);
    event BountyResolved(uint256 id, address winner, uint256 reward);

    constructor(address _wDOT) Ownable(msg.sender) {
        wDOT = IERC20(_wDOT);
    }

    function postBounty(
        string memory title,
        string memory description,
        string memory issueUrl,
        uint256 reward
    ) external {
        require(reward > 0, "Reward > 0");
        require(wDOT.transferFrom(msg.sender, address(this), reward), "Transfer failed");

        Bounty storage b = bounties.push();
        b.title = title;
        b.description = description;
        b.issueUrl = issueUrl;
        b.reward = reward;

        emit BountyPosted(bounties.length - 1, title, reward);
    }

    function submitFix(uint256 bountyId, string memory prLink) external {
        Bounty storage b = bounties[bountyId];
        require(bytes(b.fixPR).length == 0, "Fix already submitted");
        b.submitter = payable(msg.sender);
        b.fixPR = prLink;
        emit FixSubmitted(bountyId, msg.sender, prLink);
    }

    function vote(uint256 bountyId, bool approve) external {
        Bounty storage b = bounties[bountyId];
        require(bytes(b.fixPR).length > 0, "No fix submitted");
        require(!b.hasVoted[msg.sender], "Already voted");

        if (approve) b.yesVotes++; else b.noVotes++;
        b.hasVoted[msg.sender] = true;

        uint256 total = b.yesVotes + b.noVotes;
        if (total >= 3 && b.yesVotes * 100 >= total * 70 && !b.resolved) {
            b.resolved = true;
            wDOT.transfer(b.submitter, b.reward);
            emit BountyResolved(bountyId, b.submitter, b.reward);
        }

        emit Voted(bountyId, msg.sender, approve);
    }

    function bountyCount() external view returns (uint256) {
        return bounties.length;
    }
}

