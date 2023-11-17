// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IStrategy {
    function supply(address token, uint256 amount) external;
}
