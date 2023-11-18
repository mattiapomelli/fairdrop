import hre, { viem } from "hardhat";
import { getDeploymentAddress } from "../../deployment/deployment-manager";
import { keccak256, toHex, parseEther } from "viem";
import { DAI_ADDRESS, networkHasSparkLend } from "../../utils/constants";

async function main() {
  const [, alice] = await viem.getWalletClients();

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
  await token.write.approve([fairdrop.address, depositAmount], {
    account: alice.account,
  });

  // Create deposit
  const password = toHex("password", {
    size: 32,
  });
  const hashedPassword = keccak256(password);
  const publicClient = await viem.getPublicClient();
  const block = await publicClient.getBlock();
  // const withdrawableAt = BigInt(block.timestamp) + BigInt(100);
  const withdrawableAt = BigInt(block.timestamp);

  await fairdrop.write.createDeposit(
    [
      hashedPassword,
      withdrawableAt,
      token.address,
      depositAmount,
      strategy.address,
    ],
    {
      account: alice.account,
    }
  );

  console.log("Created deposit");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
