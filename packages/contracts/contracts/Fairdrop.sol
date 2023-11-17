// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IStrategy} from "./IStrategy.sol";

import "hardhat/console.sol";

contract Fairdrop {
    struct Deposit {
        address depositor;
        bytes32 hashedPassword;
        uint256 amount;
        address tokenAddress;
        IStrategy strategy;
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

    /**
     * @dev Create a new deposit
     * @param _hashedPassword Hash of the password
     * @param _withdrawableAt Timestamp after which the deposit can be withdrawn
     * @param _tokenAddress Address of the ERC20 token to deposit
     * @param _tokenAmount Amount of the ERC20 token to deposit
     */
    function createDeposit(
        bytes32 _hashedPassword,
        uint256 _withdrawableAt,
        address _tokenAddress,
        uint256 _tokenAmount,
        IStrategy _strategy
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
                withdrawableAt: _withdrawableAt,
                strategy: _strategy
            })
        );
        uint256 depositId = deposits.length - 1;

        emit DepositCreated(depositId, msg.sender, _tokenAmount);

        return depositId;
    }

    /**
     * @dev Claim a deposit, supplying the tokens to the strategy
     * @param _depositId ID of the deposit to claim
     * @param _password Password to claim the deposit
     */
    function claimDeposit(uint256 _depositId, bytes32 _password) public {
        // Check that the deposit exists and that it isn't already claimed
        require(_depositId < deposits.length, "Deposit doesn't exist");
        Deposit memory deposit = deposits[_depositId];

        require(
            deposit.hashedPassword == keccak256(abi.encodePacked(_password)),
            "Invalid password"
        );

        IStrategy strategy = deposit.strategy;
        IERC20 token = IERC20(deposit.tokenAddress);

        // Approve strategy to use tokens
        token.approve(address(strategy), deposit.amount);
        strategy.supply(address(token), deposit.amount);

        emit DepositClaimed(_depositId, msg.sender, deposit.amount);
    }
}
