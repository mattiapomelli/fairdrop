import hre, { viem } from "hardhat";
import {
  DAI_ADDRESS,
  SPARKLEND_POOL_ADDRESS,
  networkHasSparkLend,
} from "../../utils/constants";
import { getDeploymentAddress } from "../../deployment/deployment-manager";

async function main() {
  const [deployer, alice, bob] = await viem.getWalletClients();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const sparkLendPool = await viem.getContractAt(
    "contracts/interfaces/IPool.sol:IPool",
    SPARKLEND_POOL_ADDRESS[hre.network.config.chainId || 1]
  );

  console.log("Sparklend pool address: ", sparkLendPool.address);

  const fairdrop = await viem.getContractAt(
    "Fairdrop",
    getDeploymentAddress(network, "Fairdrop")
  );

  // const sparkLendStrategy = await viem.getContractAt(
  //   "contracts/strategies/SparkLendStrategy.sol:SparkLendStrategy",
  //   getDeploymentAddress(network, "SparkLendStrategy")
  // );

  // Get balances
  const fairdropAccountData = await sparkLendPool.read.getUserAccountData([
    fairdrop.address,
  ]);
  console.log("Fairdrop Account data: ", fairdropAccountData);

  // const strategyAccountData = await sparkLendPool.read.getUserAccountData([
  //   sparkLendStrategy.address,
  // ]);
  // console.log("Strategy Account data: ", strategyAccountData);

  // Get token balance
  const tokenAddress = DAI_ADDRESS[hre.network.config.chainId || 1];

  console.log("Token address: ", tokenAddress);

  const reserveData = await sparkLendPool.read.getReserveData([tokenAddress]);
  const yieldToken = await viem.getContractAt(
    "ERC20",
    reserveData.aTokenAddress
  );

  const fairdropYieldTokenBalance = await yieldToken.read.balanceOf([
    fairdrop.address,
  ]);
  console.log("Fairdrop Yield Token Balance: ", fairdropYieldTokenBalance);

  // const strategyYieldTokenBalance = await yieldToken.read.balanceOf([
  //   sparkLendStrategy.address,
  // ]);
  // console.log("Strategy Yield Token Balance: ", strategyYieldTokenBalance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
