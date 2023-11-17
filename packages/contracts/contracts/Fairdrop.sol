// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Fairdrop {
    struct Deposit {
        address depositor;
        bytes32 hashedPassword;
        uint256 amount;
        address tokenAddress;
        uint256 withdrawableAt;
    }

    Deposit[] public deposits;

    // =========================== Events ==============================

    event DepositCreated(
        uint256 indexed _depositId,
        address indexed _senderAddress,
        uint256 _amount
    );

    event DepositClaimed(
        uint256 indexed _depositId,
        address indexed _recipientAddress,
        uint256 _amount
    );

    // =========================== User functions ==============================

    function createDeposit(
        bytes32 _hashedPassword,
        uint256 _withdrawableAt,
        address _tokenAddress,
        uint256 _tokenAmount
    ) public payable returns (uint256) {
        if (_tokenAddress != address(0)) {
            require(msg.value == 0, "Cannot deposit both ETH and ERC20 token");
            IERC20 token = IERC20(_tokenAddress);
            require(
                token.transferFrom(msg.sender, address(this), _tokenAmount),
                "Failed to transfer ERC20 token"
            );
        } else {
            require(msg.value > 0, "No ETH sent");
            _tokenAmount = msg.value;
        }

        deposits.push(
            Deposit({
                depositor: msg.sender,
                hashedPassword: _hashedPassword,
                amount: _tokenAmount,
                tokenAddress: _tokenAddress,
                withdrawableAt: _withdrawableAt
            })
        );
        uint256 depositId = deposits.length - 1;

        emit DepositCreated(depositId, msg.sender, _tokenAmount);

        return depositId;
    }

    function claimDeposit(uint256 _depositId, bytes32 _password) public {
        // check that the deposit exists and that it isn't already withdrawn
        require(_depositId < deposits.length, "Deposit doesn't exist");
        Deposit memory deposit = deposits[_depositId];

        console.logBytes32(deposit.hashedPassword);
        console.logBytes32(keccak256(abi.encodePacked(_password)));

        require(
            deposit.hashedPassword == keccak256(abi.encodePacked(_password)),
            "Invalid password"
        );

        emit DepositClaimed(_depositId, msg.sender, deposit.amount);
    }
}
