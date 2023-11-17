import { task } from "hardhat/config";
import { save } from "./utils/save";
import { verify } from "./utils/verify";

import { setDeploymentAddress } from "../deployment/deployment-manager";

task("deploy", "📰 Deploys a contract, saves the artifact and verifies it.")
  .addParam("contract", "Name of the contract to deploy.", "Storage")
  .addFlag("save", "Flag to indicate whether to save the contract or not")
  .addFlag("verify", "Flag to indicate whether to verify the contract or not")
  .setAction(async (args, { viem, run, network }) => {
    const Contract = await viem.deployContract(args.contract, [""]);
    console.log(
      `📰 Contract ${Contract.address} deployed to ${network.name} successfully!`
    );

    setDeploymentAddress(network.name, args.contract, Contract.address);

    const chainId = (await viem.getPublicClient()).chain.id;

    if (args.save) {
      await save(chainId, args.contract, Contract.address, Contract.abi);
    }

    if (args.verify) {
      await verify(run, Contract.address, [""]);
    }
  });
