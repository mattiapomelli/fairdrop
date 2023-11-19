import hre, { viem } from "hardhat";
import {
  DAI_ADDRESS,
  SPARKLEND_POOL_ADDRESS,
  networkHasSparkLend,
} from "../../utils/constants";
import { parseEther } from "viem";

async function main() {
  const [deployer, alice, bob, carol, dave] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const network = hre.network.name;
  console.log("Network:", network);

  // Get contracts
  const sparkLendPool = await viem.getContractAt(
    "contracts/interfaces/IPool.sol:IPool",
    SPARKLEND_POOL_ADDRESS[hre.network.config.chainId || 1]
  );

  const tokenAddress = DAI_ADDRESS[hre.network.config.chainId || 1];
  const token = await viem.getContractAt("ERC20", tokenAddress);

  // Approve
  const depositAmount = parseEther("0.01");
  const txHash = await token.write.approve(
    [sparkLendPool.address, depositAmount],
    {
      account: dave.account,
    }
  );

  // Wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  // Claim deposit
  const txHash2 = await sparkLendPool.write.supply(
    [
      DAI_ADDRESS[hre.network.config.chainId || 1],
      depositAmount,
      dave.account.address,
      0,
    ],
    {
      account: dave.account,
    }
  );

  // Wait for confirmation
  await publicClient.waitForTransactionReceipt({
    hash: txHash2,
  });

  console.log("Supplied");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
