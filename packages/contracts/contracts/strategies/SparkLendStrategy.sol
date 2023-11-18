// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import {IStrategy} from "../interfaces/IStrategy.sol";
import {IPool} from "../interfaces/IPool.sol";
import {AxiomV2Client} from "../AxiomV2Client.sol";

import "hardhat/console.sol";

contract SparkLendStrategy is IStrategy, AxiomV2Client, Ownable {
    IPool private pool;

    address private fairdropAddress;

    // Whether users have to prove they have interacted with the SparkLend pool to claim the airdrop
    bool public verificationEnabled;

    // =========================== Axiom ==============================

    bytes32 public constant SUPPLY_EVENT_SCHEMA =
        0x2b627736bca15cd5381dcf80b0bf11fd197d01a037c52b927a881a10fb73ba61;

    uint64 public callbackSourceChainId;
    bytes32 public axiomCallbackQuerySchema;

    mapping(address => bool) public isVerified;

    event AxiomCallbackQuerySchemaUpdated(bytes32 axiomCallbackQuerySchema);

    // =========================== Constructor ==============================

    constructor(
        address _fairdropAddress,
        address _pool,
        address _axiomV2QueryAddress,
        uint64 _callbackSourceChainId,
        bytes32 _axiomCallbackQuerySchema,
        bool _verificationEnabled
    ) AxiomV2Client(_axiomV2QueryAddress) Ownable(msg.sender) {
        fairdropAddress = _fairdropAddress;
        pool = IPool(_pool);
        callbackSourceChainId = _callbackSourceChainId;
        axiomCallbackQuerySchema = _axiomCallbackQuerySchema;
        verificationEnabled = _verificationEnabled;
    }

    // =========================== Strategy Functions ==============================

    function supply(address asset, uint256 amount, address user) external {
        // Check if user is verified
        if (verificationEnabled) {
            require(
                isVerified[user],
                "SparkLendStrategy: User is not verified"
            );
        }

        // Send tokens to this contract
        IERC20(asset).transferFrom(msg.sender, address(this), amount);

        // Approve SparkLend pool to spend tokens
        if (IERC20(asset).allowance(address(this), address(pool)) < amount) {
            IERC20(asset).approve(address(pool), amount);
        }

        pool.supply(asset, amount, fairdropAddress, 0);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        // Get aTokens from sender
        IERC20 aToken = IERC20(getYieldAssetFromUnderlying(asset));

        // uint balance = aToken.balanceOf(msg.sender);
        aToken.transferFrom(msg.sender, address(this), amount);

        uint256 withdrawnAmount = pool.withdraw(asset, amount, to);
        return withdrawnAmount;
    }

    function getYieldAssetFromUnderlying(
        address asset
    ) public view returns (address) {
        return pool.getReserveData(asset).aTokenAddress;
    }

    // =========================== Owner functions ==============================

    function setVerificationEnabled(
        bool _verificationEnabled
    ) external onlyOwner {
        verificationEnabled = _verificationEnabled;
    }

    // =========================== Axiom functions ==============================

    function updateCallbackQuerySchema(
        bytes32 _axiomCallbackQuerySchema
    ) public onlyOwner {
        axiomCallbackQuerySchema = _axiomCallbackQuerySchema;
        emit AxiomCallbackQuerySchemaUpdated(_axiomCallbackQuerySchema);
    }

    function _axiomV2Callback(
        uint64 /* sourceChainId */,
        address callerAddr,
        bytes32 /* querySchema */,
        uint256 /* queryId */,
        bytes32[] calldata axiomResults,
        bytes calldata /* extraData */
    ) internal virtual override {
        // require(
        //     !hasClaimed[callerAddr],
        //     "Autonomous Airdrop: User has already claimed this airdrop"
        // );

        bytes32 eventSchema = axiomResults[0];
        address userEventAddress = address(uint160(uint256(axiomResults[1])));
        uint32 blockNumber = uint32(uint256(axiomResults[2]));
        address sparkLendPoolAddress = address(
            uint160(uint256(axiomResults[3]))
        );

        // Validate the results
        require(eventSchema == SUPPLY_EVENT_SCHEMA, "Invalid event schema");
        require(
            userEventAddress == callerAddr,
            "Invalid user address for event"
        );
        require(
            blockNumber >= 9000000,
            "Block number for transaction receipt must be 9000000 or greater"
        );
        require(
            sparkLendPoolAddress == address(pool),
            "Transaction `to` address is not the SparkLend pool address"
        );

        isVerified[callerAddr] = true;
    }

    function _validateAxiomV2Call(
        uint64 sourceChainId,
        address /* callerAddr */,
        bytes32 querySchema
    ) internal virtual override {
        require(
            sourceChainId == callbackSourceChainId,
            "AxiomV2: caller sourceChainId mismatch"
        );
        require(
            querySchema == axiomCallbackQuerySchema,
            "AxiomV2: query schema mismatch"
        );
    }
}
