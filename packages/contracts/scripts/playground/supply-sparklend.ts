import hre, { viem } from "hardhat";
import { DAI_ADDRESS, SPARKLEND_POOL_ADDRESS } from "../../utils/constants";

async function main() {
  const [deployer, alice, bob] = await viem.getWalletClients();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const sparkLendPool = await viem.getContractAt(
    "contracts/interfaces/ISparkLendPool.sol:ISparkLendPool",
    SPARKLEND_POOL_ADDRESS[hre.network.config.chainId || 1]
  );

  // Claim deposit
  const depositAmount = BigInt(0);
  await sparkLendPool.write.supply(
    [
      DAI_ADDRESS[hre.network.config.chainId || 1],
      depositAmount,
      alice.account.address,
      0,
    ],
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
