import hre, { viem } from "hardhat";
import { getDeploymentAddress } from "../../deployment/deployment-manager";
import { keccak256, toHex } from "viem";
import { DAI_ADDRESS, networkHasSparkLend } from "../../utils/constants";

async function main() {
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const sparkLendStrategy = await viem.getContractAt(
    "contracts/strategies/SparkLendStrategy.sol:SparkLendStrategy",
    getDeploymentAddress(network, "SparkLendStrategy")
  );

  // Claim deposit
  const verificationEnabled = false;
  const txHash = await sparkLendStrategy.write.setVerificationEnabled(
    [verificationEnabled],
    {
      account: deployer.account,
    }
  );

  // Wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  console.log("Set verification enabled to", verificationEnabled);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
