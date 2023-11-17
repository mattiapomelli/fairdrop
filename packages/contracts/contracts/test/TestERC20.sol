// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    address public owner;

    constructor(address[] memory addresses) ERC20("TestERC20", "TERC20") {
        for (uint256 i = 0; i < addresses.length; i++) {
            _mint(addresses[i], 1000000 ether);
        }
        owner = msg.sender;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
