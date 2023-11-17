import { RunTaskFunction } from "hardhat/types";

export const verify = async (
  run: RunTaskFunction,
  address: string,
  constructorArguments: any[]
) => {
  while (true) {
    try {
      await run("verify:verify", {
        address,
        constructorArguments,
      });
      console.log(`✅ Contract ${address} has been verified successfully`);
      break;
    } catch {
      console.log(`🔄️ Verification failed, trying again in 10 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
};
