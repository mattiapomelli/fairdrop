import { task } from "hardhat/config";
import { save } from "./utils/save";
import { verify } from "./utils/verify";

import { setDeploymentAddress } from "../deployment/deployment-manager";
import {
  AXIOM_CALLBACK_QUERY_SCHEMA,
  AXIOM_V2_QUERY_ADDRESS,
  SPARKLEND_POOL_ADDRESS,
  WORLD_ID_ROUTER_ADDRESS,
  networkHasSparkLend,
  networkHasWorldcoin,
} from "../utils/constants";
import { zeroAddress } from "viem";

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

    console.log("Axiom V2 query address: ", AXIOM_V2_QUERY_ADDRESS[chainId]);

    const balance = await publicClient.getBalance({
      address: deployer.account.address,
    });

    console.log(
      `📡 Deploying from ${deployer.account.address} with ${balance} ETH`
    );

    // Deploy Fairdrop
    const worldIdRouterAddress = networkHasWorldcoin(network.name)
      ? WORLD_ID_ROUTER_ADDRESS[chainId]
      : zeroAddress;
    const worldcoinAppId = networkHasWorldcoin(network.name)
      ? process.env.WORLDCOIN_APP_ID || ""
      : "";
    const worldcoinActionId = networkHasWorldcoin(network.name)
      ? process.env.WORLDCOIN_ACTION_ID || ""
      : "";

    const fairdrop = await viem.deployContract("Fairdrop", [
      worldIdRouterAddress,
      worldcoinAppId,
      worldcoinActionId,
    ]);
    console.log(
      `📰 Contract Fairdrop deployed to ${network.name} at ${fairdrop.address}`
    );

    setDeploymentAddress(network.name, "Fairdrop", fairdrop.address);
    if (args.save) {
      await save(chainId, "Fairdrop", fairdrop.address, fairdrop.abi);
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
        await save(chainId, "TestERC20", testErc20.address, testErc20.abi);
      }
      if (args.verify) {
        await verify(run, testErc20.address, [""]);
      }
    }

    if (networkHasSparkLend(network.name)) {
      // console.log("Axiom V2 query address: ", AXIOM_V2_QUERY_ADDRESS[chainId]);

      // Deploy SparkLendStrategy
      const sparkLendStrategy = await viem.deployContract(
        "contracts/strategies/SparkLendStrategy.sol:SparkLendStrategy",
        [
          fairdrop.address,
          SPARKLEND_POOL_ADDRESS[chainId],
          AXIOM_V2_QUERY_ADDRESS[chainId],
          BigInt(chainId),
          AXIOM_CALLBACK_QUERY_SCHEMA,
        ],
        {
          // Set high gas price for deployment
          // gasPrice: BigInt(100000000000), // For Goerli because it's freaking slow
        }
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
          "SparkLendStrategy",
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
        "contracts/test/DemoFiPool.sol:DemoFiPool",
        [],
        {
          // gasPrice: BigInt(100000000), // For Goerli because it's freaking slow
        }
      );
      console.log(
        `📰 Contract DemoFi deployed to ${network.name} at ${demoFi.address}`
      );

      setDeploymentAddress(network.name, "DemoFi", demoFi.address);
      if (args.save) {
        await save(chainId, "DemoFi", demoFi.address, demoFi.abi);
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
          "DemoFiStrategy",
          demoFiStrategy.address,
          demoFiStrategy.abi
        );
      }
      if (args.verify) {
        await verify(run, demoFiStrategy.address, [""]);
      }
    }
  });
