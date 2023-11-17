// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IStrategy} from "../interfaces/IStrategy.sol";
import {IPool} from "../interfaces/IPool.sol";

import "hardhat/console.sol";

contract SparkLendStrategy is IStrategy {
    IPool private pool;
    address private fairdropAddress;

    constructor(address _fairdropAddress, address _pool) {
        fairdropAddress = _fairdropAddress;
        pool = IPool(_pool);
    }

    function supply(address token, uint256 amount) external {
        // Send tokens to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Approve SparkLend pool to spend any amount of tokens
        if (IERC20(token).allowance(address(this), address(pool)) < amount) {
            IERC20(token).approve(address(pool), type(uint256).max);
        }

        pool.supply(token, amount, fairdropAddress, 0);
    }
}
