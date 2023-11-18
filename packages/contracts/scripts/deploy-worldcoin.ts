import { task } from "hardhat/config";

import {
  WORLD_ID_ROUTER_ADDRESS,
  networkHasWorldcoin,
} from "../utils/constants";
import { zeroAddress } from "viem";
import { setDeploymentAddress } from "../deployment/deployment-manager";

task("deploy-worldcoin", "📰 Deploy example Worldcoin verification contract")
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

    const worldIdRouterAddress = networkHasWorldcoin(network.name)
      ? WORLD_ID_ROUTER_ADDRESS[chainId]
      : zeroAddress;

    const worldcoinAppId = networkHasWorldcoin(network.name)
      ? process.env.WORLDCOIN_APP_ID || ""
      : "";
    const worldcoinActionId = networkHasWorldcoin(network.name)
      ? process.env.WORLDCOIN_ACTION_ID || ""
      : "";

    console.log("worldIdRouterAddress: ", worldIdRouterAddress);
    console.log("worldcoinAppId: ", worldcoinAppId);
    console.log("worldcoinActionId: ", worldcoinActionId);

    const worldcoin = await viem.deployContract(
      "contracts/Worldcoin.sol:Contract",
      [worldIdRouterAddress, worldcoinAppId, worldcoinActionId]
    );
    console.log(
      `📰 Contract Worldcoin deployed to ${network.name} at ${worldcoin.address}`
    );

    setDeploymentAddress(network.name, "Worldcoin", worldcoin.address);
  });
