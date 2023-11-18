import hre, { viem } from "hardhat";
import { getDeploymentAddress } from "../../deployment/deployment-manager";
import { keccak256, toHex, parseEther } from "viem";
import { DAI_ADDRESS, networkHasSparkLend } from "../../utils/constants";

async function main() {
  const [, alice] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const fairdrop = await viem.getContractAt(
    "Fairdrop",
    getDeploymentAddress(network, "Fairdrop")
  );

  const tokenAddress = networkHasSparkLend(network)
    ? DAI_ADDRESS[hre.network.config.chainId || 1]
    : getDeploymentAddress(network, "TestERC20");
  const token = await viem.getContractAt("ERC20", tokenAddress);

  // console.log("Token address: ", tokenAddress);

  const strategyAddress = getDeploymentAddress(
    network,
    networkHasSparkLend(network) ? "SparkLendStrategy" : "DemoFiStrategy"
  );
  const strategy = await viem.getContractAt(
    "contracts/interfaces/IStrategy.sol:IStrategy",
    strategyAddress
  );

  // Approve tokens
  const depositAmount = parseEther("0.1");
  const txHash = await token.write.approve([fairdrop.address, depositAmount], {
    account: alice.account,
  });

  // Wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  // const balance = await token.read.balanceOf([alice.account.address]);
  // console.log("Balance: ", balance);

  // const allowance = await token.read.allowance([
  //   alice.account.address,
  //   fairdrop.address,
  // ]);
  // console.log("Allowance: ", allowance.toString());

  // Create deposit
  const password = toHex("password", {
    size: 32,
  });
  const hashedPassword = keccak256(password);
  const block = await publicClient.getBlock();
  // const withdrawableAt = BigInt(block.timestamp) + BigInt(100);
  const withdrawableAt = BigInt(block.timestamp);
  const checkElibility = false;
  const worldcoinVerification = false;
  const batchId = BigInt(1);

  const txHash2 = await fairdrop.write.createDeposit(
    [
      hashedPassword,
      withdrawableAt,
      token.address,
      depositAmount,
      strategy.address,
      checkElibility,
      worldcoinVerification,
      batchId,
    ],
    {
      account: alice.account,
    }
  );

  // Wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash: txHash2,
  });

  console.log("Created deposit");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
