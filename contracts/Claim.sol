// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Claim is Ownable {
   using SafeERC20 for IERC20;

   mapping(address => bool) private moderator;
   mapping(address => uint256) private balance;
   IERC20 private claimToken;

   constructor (
      address[] memory moderators_,
      uint256[] memory balances_,
      IERC20 claimToken_
   ) {
      for (uint8 i = 0; i < 5; i ++) {
         moderator[moderators_[i]] = true;
         balance[moderators_[i]] = balances_[i];
      }

      claimToken = claimToken_;
   }

   modifier onlyModerator() {
      require (moderator[msg.sender] == true, 'no permission');
      _;
   }

   function claim() external onlyModerator {
      address sender = msg.sender;
      uint256 bal = balance[sender];
      require (bal > 0, 'no balance');

      balance[sender] = 0;
      claimToken.safeTransfer(sender, bal);
   }

   function tokenBalance(address account) external view returns (uint256) {
      return balance[account];
   }
}