import hre, { viem } from "hardhat";
import {
  DAI_ADDRESS_MAINNET,
  SPARKLEND_POOL_ADDRESS_MAINNET,
} from "../../utils/constants";

async function main() {
  const [deployer, alice, bob] = await viem.getWalletClients();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const sparkLendPool = await viem.getContractAt(
    "ISparkLendPool",
    SPARKLEND_POOL_ADDRESS_MAINNET
  );

  // Claim deposit
  const depositAmount = BigInt(0);
  await sparkLendPool.write.supply(
    [DAI_ADDRESS_MAINNET, depositAmount, alice.account.address, 0],
    {
      account: alice.account,
    }
  );

  console.log("Claimed deposit");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
