// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PoolShareToken is ERC20 {
    constructor() ERC20("Pool Share Token", "PST") {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}

contract DemoFi {}
