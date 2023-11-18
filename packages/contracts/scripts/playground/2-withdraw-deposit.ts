import hre, { viem } from "hardhat";
import { getDeploymentAddress } from "../../deployment/deployment-manager";
import { parseEther } from "viem";

async function main() {
  const [deployer, alice, bob] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const fairdrop = await viem.getContractAt(
    "Fairdrop",
    getDeploymentAddress(network, "Fairdrop")
  );

  // Claim deposit
  const depositId = BigInt(0);
  // const deposit = await fairdrop.read.deposits([depositId]);
  // console.log("Deposit: ", deposit);

  const withdrawAmount = parseEther("0.04");
  const txHash = await fairdrop.write.withdrawDeposit(
    [depositId, withdrawAmount],
    {
      account: bob.account,
    }
  );

  // Wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  console.log("Withdrawn deposit");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
