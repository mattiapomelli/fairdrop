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

    function supply(address asset, uint256 amount) external {
        // Send tokens to this contract
        IERC20(asset).transferFrom(msg.sender, address(this), amount);

        // Approve SparkLend pool to spend tokens
        if (IERC20(asset).allowance(address(this), address(pool)) < amount) {
            IERC20(asset).approve(address(pool), amount);
        }

        pool.supply(asset, amount, fairdropAddress, 0);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        // Get aTokens from sender
        IERC20 aToken = IERC20(getYieldAssetFromUnderlying(asset));

        // uint balance = aToken.balanceOf(msg.sender);
        aToken.transferFrom(msg.sender, address(this), amount);

        uint256 withdrawnAmount = pool.withdraw(asset, amount, to);
        return withdrawnAmount;
    }

    function getYieldAssetFromUnderlying(
        address asset
    ) public view returns (address) {
        return pool.getReserveData(asset).aTokenAddress;
    }
}
