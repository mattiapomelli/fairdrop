import { hardhat, polygon, polygonMumbai } from "wagmi/chains";

export const EXPLORER_URL: Record<number, string> = {
  [hardhat.id]: "",
  [polygonMumbai.id]: "https://mumbai.polygonscan.com",
  [polygon.id]: "https://polygonscan.com",
};

export const getAddressExplorerLink = (chainId: number, address: string) => {
  return `${EXPLORER_URL[chainId]}/address/${address}`;
};
