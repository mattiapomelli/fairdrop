export const SPARKLEND_POOL_ADDRESS: Record<number, `0x${string}`> = {
  1: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
  5: "0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d", // Goerli
};

export const DAI_ADDRESS: Record<number, `0x${string}`> = {
  1: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  5: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844", // Goerli
};

export const networkHasSparkLend = (network: string) => {
  return network === "devnet" || network === "goerli" || network === "gnosis";
};
