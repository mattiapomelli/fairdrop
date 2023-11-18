import hre, { viem } from "hardhat";
import { getDeploymentAddress } from "../../deployment/deployment-manager";
import { parseEther } from "viem";

async function main() {
  const [deployer, alice, bob] = await viem.getWalletClients();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const fairdrop = await viem.getContractAt(
    "Fairdrop",
    getDeploymentAddress(network, "Fairdrop")
  );

  // Claim deposit
  const depositId = BigInt(0);
  const withdrawAmount = parseEther("0.04");
  await fairdrop.write.withdrawDeposit([depositId, withdrawAmount], {
    account: bob.account,
  });

  console.log("Withdrawn deposit");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
