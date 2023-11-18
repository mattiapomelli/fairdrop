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

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}

contract DemoFiPool is IPool {
    PoolShareToken public poolShareToken;

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

        // Mint pool share tokens
        poolShareToken.mint(onBehalfOf, amount);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        // Check if the user has enough pool share tokens
        require(
            poolShareToken.balanceOf(msg.sender) >= amount,
            "Not enough pool share tokens"
        );

        // Burn pool share tokens
        poolShareToken.burn(msg.sender, amount);

        // Transfer tokens to the user
        IERC20(asset).transfer(to, amount);

        return amount;
    }

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
        // Collateral is the balance of the pool share token
        totalCollateralBase = poolShareToken.balanceOf(user);

        return (totalCollateralBase, 0, 0, 0, 0, 0);
    }

    /**
     * @notice Returns the state and configuration of the reserve
     * @return The state and configuration data of the reserve
     */
    function getReserveData(
        address
    ) external view returns (IPool.ReserveData memory) {
        return
            IPool.ReserveData({
                configuration: ReserveConfigurationMap({data: 0}),
                liquidityIndex: 0,
                currentLiquidityRate: 0,
                variableBorrowIndex: 0,
                currentVariableBorrowRate: 0,
                currentStableBorrowRate: 0,
                lastUpdateTimestamp: 0,
                id: 0,
                aTokenAddress: address(poolShareToken),
                stableDebtTokenAddress: address(0),
                variableDebtTokenAddress: address(0),
                interestRateStrategyAddress: address(0),
                accruedToTreasury: 0,
                unbacked: 0,
                isolationModeTotalDebt: 0
            });
    }
}
