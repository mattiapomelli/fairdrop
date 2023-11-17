import hre, { viem } from "hardhat";
import { getDeploymentAddress } from "../../deployment/deployment-manager";
import { keccak256, toHex } from "viem";

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
  const password = toHex("password", {
    size: 32,
  });
  await fairdrop.write.claimDeposit([depositId, password], {
    account: bob.account,
  });

  console.log("Claimed deposit");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
