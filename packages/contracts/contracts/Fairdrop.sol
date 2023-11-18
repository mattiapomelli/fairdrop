// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {IStrategy} from "./interfaces/IStrategy.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {ByteHasher} from "./libraries/ByteHasher.sol";

import "hardhat/console.sol";

contract Fairdrop is ERC721 {
    using ByteHasher for bytes;

    struct Deposit {
        address depositor;
        bytes32 hashedPassword;
        uint256 amount;
        address tokenAddress;
        IStrategy strategy;
        uint256 withdrawableAt;
        bool claimed;
        bool checkEligibility; // Whether to check eligibility to claim the deposit or anyone can claim it
        bool worldIdVerification; // Whether the users have to be verified by World ID to claim the deposit
        uint256 batchId; // The batch ID of the deposit
    }

    uint256 batchIdCounter = 0;

    Deposit[] public deposits;

    // =========================== Worldcoin ==============================

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID public immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 public immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 public immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already for a specific batch of deposits.
    /// Used to guarantee a person can only claim a single deposit per batch.
    /// nullifierHash => batchId => used
    mapping(uint256 => mapping(uint256 => bool)) public nullifierHashes;

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

    // =========================== Constructor ==============================

    /**
     * @param _worldId The WorldID instance that will verify the proofs
     * @param _appId The World ID app ID
     * @param _actionId The World ID action ID
     */
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) ERC721("Fairdrop", "FAR") {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    // =========================== User functions ==============================

    /**
     * @dev Create a new deposit
     * @param _hashedPasswords Hash of the password
     * @param _withdrawableAt Timestamp after which the deposit can be withdrawn
     * @param _tokenAddress Address of the ERC20 token to deposit
     * @param _tokenAmount Amount of the ERC20 token to deposit
     * @param _strategy Strategy to use for the deposit
     * @param _checkEligibility Whether to check eligibility to claim the deposit or anyone can claim it
     * @param _worldIdVerification Whether the users have to be verified by World ID to claim the deposit
     */
    function createDeposits(
        bytes32[] memory _hashedPasswords,
        uint256 _withdrawableAt,
        address _tokenAddress,
        uint256 _tokenAmount,
        IStrategy _strategy,
        bool _checkEligibility,
        bool _worldIdVerification
    ) public payable {
        require(_hashedPasswords.length > 0, "No hashed passwords provided");
        require(_tokenAmount > 0, "Token amount must be greater than zero");

        batchIdCounter += 1;
        uint256 _batchId = batchIdCounter;

        if (_tokenAddress != address(0)) {
            require(msg.value == 0, "Cannot deposit both ETH and ERC20 token");
            IERC20 token = IERC20(_tokenAddress);
            require(
                token.transferFrom(
                    msg.sender,
                    address(this),
                    _tokenAmount * _hashedPasswords.length
                ),
                "Failed to transfer ERC20 token"
            );
        } else {
            require(msg.value > 0, "No ETH sent");
            _tokenAmount = msg.value;
        }

        for (uint256 i = 0; i < _hashedPasswords.length; i++) {
            deposits.push(
                Deposit({
                    depositor: msg.sender,
                    hashedPassword: _hashedPasswords[i],
                    amount: _tokenAmount,
                    tokenAddress: _tokenAddress,
                    withdrawableAt: _withdrawableAt,
                    strategy: _strategy,
                    claimed: false,
                    checkEligibility: _checkEligibility,
                    worldIdVerification: _worldIdVerification,
                    batchId: _batchId
                })
            );
            uint256 depositId = deposits.length - 1;

            emit DepositCreated(depositId, msg.sender, _tokenAmount);
        }
    }

    /**
     * @dev Claim a deposit, supplying the tokens to the strategy
     * @param _depositId ID of the deposit to claim
     * @param _password Password to claim the deposit
     * @param signal An arbitrary input from the user that cannot be tampered with. In this case, it is the user's wallet address.
     * @param root The root (returned by the IDKit widget).
     * @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the IDKit widget).
     * @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the IDKit widget).
     */
    function claimDeposit(
        uint256 _depositId,
        bytes32 _password,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        // Check that the deposit exists and that it isn't already claimed
        require(_depositId < deposits.length, "Deposit doesn't exist");
        Deposit storage deposit = deposits[_depositId];

        require(!deposit.claimed, "Deposit already claimed");
        deposit.claimed = true;

        require(
            deposit.hashedPassword == keccak256(abi.encodePacked(_password)),
            "Invalid password"
        );

        IStrategy strategy = deposit.strategy;

        // Check if user is verified with WorldId
        if (deposit.worldIdVerification && address(worldId) != address(0)) {
            _verifyWorldId(signal, root, nullifierHash, proof, deposit.batchId);
        }

        // Check user is eligible to claim the deposit
        if (deposit.checkEligibility) {
            require(strategy.isEligible(msg.sender), "User not eligible");
        }

        IERC20 token = IERC20(deposit.tokenAddress);

        // Approve strategy to use tokens
        token.approve(address(strategy), deposit.amount);
        strategy.supply(address(token), deposit.amount);

        // Mint NFT to sender
        _safeMint(msg.sender, _depositId);

        emit DepositClaimed(_depositId, msg.sender, deposit.amount);
    }

    function withdrawDeposit(uint256 _depositId, uint256 _amount) public {
        // Check that the deposit exists and that it isn't already claimed
        require(_depositId < deposits.length, "Deposit doesn't exist");
        Deposit storage deposit = deposits[_depositId];

        // Check user owns the NFT for the deposit
        require(ownerOf(_depositId) == msg.sender, "Not owner of deposit");

        require(deposit.claimed, "Deposit must be claimed before withdrawal");
        require(deposit.amount >= _amount, "Not enough funds");

        deposit.amount -= _amount;

        require(
            block.timestamp >= deposit.withdrawableAt,
            "Deposit not yet withdrawable"
        );

        IStrategy strategy = deposit.strategy;

        // Approve strategy to use yieldToken (needed for withdraw)
        address yieldToken = strategy.getYieldAssetFromUnderlying(
            deposit.tokenAddress
        );
        IERC20(yieldToken).approve(address(strategy), _amount);

        strategy.withdraw(deposit.tokenAddress, _amount, msg.sender);

        emit DepositClaimed(_depositId, msg.sender, _amount);
    }

    function testWorldcoin(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        uint256 batchId
    ) public {
        _verifyWorldId(signal, root, nullifierHash, proof, batchId);
    }

    // =========================== Internal functions ==============================

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
    /// @param root The root of the Merkle tree (returned by the JS widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
    /// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
    function _verifyWorldId(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        uint256 batchId
    ) internal {
        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash][batchId]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        // We now record the user has done this, so they can't do it again (proof of uniqueness)
        nullifierHashes[nullifierHash][batchId] = true;

        // Finally, execute your logic here, for example issue a token, NFT, etc...
        // Make sure to emit some kind of event afterwards!
    }
}
