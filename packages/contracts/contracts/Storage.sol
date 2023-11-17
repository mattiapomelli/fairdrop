// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Storage {
    string private data;

    constructor(string memory initialData) {
        data = initialData;
    }

    function getData() public view returns (string memory) {
        return data;
    }

    function setData(string memory _data) public {
        data = _data;
    }

    fallback() external {
        console.log("Fallback called");
    }
}
