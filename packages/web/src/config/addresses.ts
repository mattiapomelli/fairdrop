import { goerli, mainnet } from "viem/chains";

export const DAI_ADDRESS: Record<number, `0x${string}`> = {
  [mainnet.id]: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  [goerli.id]: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844", // Goerli
};
