// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IStrategy {
    /**
     * @dev Supply to the protocol managed by the strategy
     * @param asset The address of the underlying asset to supply
     * @param amount The amount to be supplied
     */
    function supply(address asset, uint256 amount) external;

    /**
     * @dev Withdraw from the protocol managed by the strategy
     * @param asset The address of the underlying asset to withdraw
     * @param amount The underlying amount to be withdrawn
     * @return The final amount withdrawn
     */
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);

    /**
     * Returns the asset of the strategy yield token given the underlying token
     * @param asset the underlying token
     */
    function getYieldAssetFromUnderlying(
        address asset
    ) external view returns (address);
}
