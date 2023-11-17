// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IStrategy} from "../interfaces/IStrategy.sol";
import {IPool} from "../interfaces/IPool.sol";

import "hardhat/console.sol";

contract PoolShareToken is ERC20 {
    constructor() ERC20("Pool Share Token", "PST") {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}

contract DemoFiPool is IPool {
    PoolShareToken public poolShareToken;

    // User account dat struct
    struct UserAccountData {
        uint256 totalCollateralBase;
        uint256 totalDebtBase;
        uint256 availableBorrowsBase;
        uint256 currentLiquidationThreshold;
        uint256 ltv;
        uint256 healthFactor;
    }

    mapping(address => UserAccountData) public userAccountData;

    constructor() {
        poolShareToken = new PoolShareToken();
    }

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16
    ) external {
        // Send tokens to the contract
        IERC20(asset).transferFrom(msg.sender, address(this), amount);

        // Update user account data
        userAccountData[onBehalfOf].totalCollateralBase += amount;

        // Mint pool share tokens
        poolShareToken.mint(onBehalfOf, amount);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {}

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint16 referralCode,
        address onBehalfOf
    ) external {}

    function getUserAccountData(
        address user
    )
        external
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        return (
            userAccountData[user].totalCollateralBase,
            userAccountData[user].totalDebtBase,
            userAccountData[user].availableBorrowsBase,
            userAccountData[user].currentLiquidationThreshold,
            userAccountData[user].ltv,
            userAccountData[user].healthFactor
        );
    }
}
