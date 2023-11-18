import { task } from "hardhat/config";
import { save } from "./utils/save";
import { verify } from "./utils/verify";

import { setDeploymentAddress } from "../deployment/deployment-manager";
import {
  SPARKLEND_POOL_ADDRESS,
  networkHasSparkLend,
} from "../utils/constants";

task(
  "deploy",
  "📰 Deploy all the contracts contract, saves the artifacts and verifies them."
)
  .addFlag("save", "Flag to indicate whether to save the contract or not")
  .addFlag("verify", "Flag to indicate whether to verify the contract or not")
  .setAction(async (args, { viem, run, network }) => {
    // Get balance of dpeloyer
    const [deployer, alice] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();
    const chainId = publicClient.chain.id;

    const balance = await publicClient.getBalance({
      address: deployer.account.address,
    });

    console.log(
      `📡 Deploying from ${deployer.account.address} with ${balance} ETH`
    );

    // Deploy Fairdrop
    const fairdrop = await viem.deployContract("Fairdrop", []);
    console.log(
      `📰 Contract Fairdrop deployed to ${network.name} at ${fairdrop.address}`
    );

    setDeploymentAddress(network.name, "Fairdrop", fairdrop.address);
    if (args.save) {
      await save(chainId, args.contract, fairdrop.address, fairdrop.abi);
    }
    if (args.verify) {
      await verify(run, fairdrop.address, [""]);
    }

    if (!networkHasSparkLend(network.name)) {
      // Deploy TestERC20
      const testErc20 = await viem.deployContract(
        "contracts/test/TestERC20.sol:TestERC20",
        [
          [
            deployer.account?.address as `0x${string}`,
            alice.account?.address as `0x${string}`,
          ],
        ]
      );
      console.log(
        `📰 Contract TestERC20 deployed to ${network.name} at ${testErc20.address}`
      );

      setDeploymentAddress(network.name, "TestERC20", testErc20.address);
      if (args.save) {
        await save(chainId, args.contract, testErc20.address, testErc20.abi);
      }
      if (args.verify) {
        await verify(run, testErc20.address, [""]);
      }
    }

    if (networkHasSparkLend(network.name)) {
      // Deploy SparkLendStrategy
      const sparkLendStrategy = await viem.deployContract(
        "contracts/strategies/SparkLendStrategy.sol:SparkLendStrategy",
        [fairdrop.address, SPARKLEND_POOL_ADDRESS[chainId]]
      );
      console.log(
        `📰 Contract SparkLendStrategy deployed to ${network.name} at ${sparkLendStrategy.address}`
      );

      setDeploymentAddress(
        network.name,
        "SparkLendStrategy",
        sparkLendStrategy.address
      );
      if (args.save) {
        await save(
          chainId,
          args.contract,
          sparkLendStrategy.address,
          sparkLendStrategy.abi
        );
      }
      if (args.verify) {
        await verify(run, sparkLendStrategy.address, [""]);
      }
    } else {
      // Deploy DemoFi
      const demoFi = await viem.deployContract(
        "contracts/test/DemoFi.sol:DemoFi",
        []
      );
      console.log(
        `📰 Contract DemoFi deployed to ${network.name} at ${demoFi.address}`
      );

      setDeploymentAddress(network.name, "DemoFi", demoFi.address);
      if (args.save) {
        await save(chainId, args.contract, demoFi.address, demoFi.abi);
      }
      if (args.verify) {
        await verify(run, demoFi.address, [""]);
      }

      // Deploy DemoFiStrategy
      const demoFiStrategy = await viem.deployContract(
        "contracts/strategies/DemoFiStrategy.sol:DemoFiStrategy",
        [fairdrop.address, demoFi.address]
      );
      console.log(
        `📰 Contract DemoFiStrategy deployed to ${network.name} at ${demoFiStrategy.address}`
      );

      setDeploymentAddress(
        network.name,
        "DemoFiStrategy",
        demoFiStrategy.address
      );
      if (args.save) {
        await save(
          chainId,
          args.contract,
          demoFiStrategy.address,
          demoFiStrategy.abi
        );
      }
      if (args.verify) {
        await verify(run, demoFiStrategy.address, [""]);
      }
    }
  });
