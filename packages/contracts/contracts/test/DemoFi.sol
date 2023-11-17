// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IStrategy} from "../interfaces/IStrategy.sol";

import "hardhat/console.sol";

// contract PoolShareToken is ERC20 {
//     constructor() ERC20("Pool Share Token", "PST") {}

//     function mint(address account, uint256 amount) external {
//         _mint(account, amount);
//     }
// }

contract DemoFi {
    function supply(address asset, uint256 amount) external {
        // Send tokens to the contract
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
    }
}
