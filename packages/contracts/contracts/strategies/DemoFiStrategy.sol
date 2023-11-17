// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IStrategy} from "../interfaces/IStrategy.sol";
import {DemoFi} from "../test/DemoFi.sol";

import "hardhat/console.sol";

contract DemoFiStrategy is IStrategy {
    DemoFi private demoFi;

    constructor(address _demoFi) {
        demoFi = DemoFi(_demoFi);
    }

    function supply(address token, uint256 amount) external {
        // Send tokens to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Approve DemoFi pool to spend any amount of tokens
        if (IERC20(token).allowance(address(this), address(demoFi)) < amount) {
            IERC20(token).approve(address(demoFi), type(uint256).max);
        }

        demoFi.supply(token, amount);

        // TODO: transfer liquidity tokens to msg.sender
    }
}
