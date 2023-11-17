import { hardhat, polygon, polygonMumbai } from "wagmi/chains";

import { env } from "@/env.mjs";
import HardhatIcon from "@/icons/hardhat.svg";
import PolygonIcon from "@/icons/polygon.svg";

export type ChainMap = { [chainId: number]: string };

const getChains = () => {
  switch (env.NEXT_PUBLIC_CHAIN) {
    case "localhost":
      return [hardhat, polygonMumbai];
    case "testnet":
      return [polygonMumbai];
    case "mainnet":
      throw [polygon];
    default:
      throw new Error("Invalid NEXT_PUBLIC_CHAIN value");
  }
};

export const CHAINS = getChains();

type Icon = (className: { className?: string }) => JSX.Element;

export const CHAIN_ICON: { [chainId: number]: Icon } = {
  [hardhat.id]: HardhatIcon,
  [polygonMumbai.id]: PolygonIcon,
  [polygon.id]: PolygonIcon,
};
