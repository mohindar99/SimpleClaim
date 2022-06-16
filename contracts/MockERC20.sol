// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
   uint256 private initalSupply = 10**6 * 1e18;
   constructor () ERC20('Test', 'TEST') {
      _mint(msg.sender, initalSupply);
   }
}