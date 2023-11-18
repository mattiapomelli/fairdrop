import hre, { viem } from "hardhat";
import { getDeploymentAddress } from "../../deployment/deployment-manager";
import { decodeAbiParameters } from "viem";

// import { defaultAbiCoder as abi } from 'ethers/lib/utils'

async function main() {
  const [deployer, alice, bob] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const worldcoin = await viem.getContractAt(
    "Fairdrop",
    getDeploymentAddress(network, "Worldcoin")
  );

  console.log("Fairdrop address: ", worldcoin.address);

  const merkleRoot =
    "0x03937852f985472a5f6f386557a73cdc267363a9b5d2f297d4cd70e8f3d3ba86";
  const nullifierHash =
    "0x12994e70419bfed3f67a814670fc199aa7ed0fc80d8ec583d61ff1fa75969ab9";
  const proof =
    "0x11e67c5001195b148d3df3521e02eec8ac980c1326ff2fae52f04b2bef2bd0d82a4b90676343ebb0f1b688ecf88bec1001d818534c635b1e66fe1b818f7a6459194e944556f88cca7fc8365657807414b4da6ba11bddcea0178c556d23495a4d165c8a3b26f12900e26bd887c9781612f91699ad364f52bb9816986c87f994a00e997a2663a5637eabccf5ed37f963f8db4775d74bd0e6cdc0254d51c2ed2e3612644055a8423aef48ba051e4714ae57eae9a1c22023255ad5e8fa50d13a9c9620f231821297c202eb9407683ed8fe87b7a31730533a70cd5c8862f9b435905315af89abacfd99ea10121c0f66acf46c18a24fcd57e88e9a289896d816d053ab";

  const decodedMerkleRoot = decodeAbiParameters(
    [{ type: "uint256" }],
    merkleRoot
  )[0];
  const decodedNullifierHash = decodeAbiParameters(
    [{ type: "uint256" }],
    nullifierHash
  )[0];
  const decodedProof = decodeAbiParameters([{ type: "uint256[8]" }], proof)[0];

  console.log("decodedMerkleRoot:", decodedMerkleRoot);
  console.log("decodedNullifierHash:", decodedNullifierHash);
  console.log("decodedProof:", decodedProof);

  const txHash = await worldcoin.write.verifyAndExecute(
    [
      bob.account.address,
      decodedMerkleRoot,
      decodedNullifierHash,
      decodedProof,
    ],
    {
      account: bob.account,
    }
  );

  // Wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  console.log("Worldcoin verified");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
