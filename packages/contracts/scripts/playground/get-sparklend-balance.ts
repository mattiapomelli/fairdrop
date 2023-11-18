import hre, { viem } from "hardhat";
import { SPARKLEND_POOL_ADDRESS } from "../../utils/constants";
import { getDeploymentAddress } from "../../deployment/deployment-manager";

async function main() {
  const [deployer, alice, bob] = await viem.getWalletClients();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const sparkLendPool = await viem.getContractAt(
    "contracts/interfaces/ISparkLendPool.sol:ISparkLendPool",
    SPARKLEND_POOL_ADDRESS[hre.network.config.chainId || 1]
  );

  const fairdrop = await viem.getContractAt(
    "Fairdrop",
    getDeploymentAddress(network, "Fairdrop")
  );

  const sparkLendStrategy = await viem.getContractAt(
    "contracts/strategies/SparkLendStrategy.sol:SparkLendStrategy",
    getDeploymentAddress(network, "SparkLendStrategy")
  );

  // Get balances
  const fairdropAccountData = await sparkLendPool.read.getUserAccountData([
    fairdrop.address,
  ]);
  console.log("Fairdrop Account data: ", fairdropAccountData);

  const strategyAccountData = await sparkLendPool.read.getUserAccountData([
    sparkLendStrategy.address,
  ]);
  console.log("Strategy Account data: ", strategyAccountData);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
