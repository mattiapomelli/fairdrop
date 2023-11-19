import {
  arbitrumGoerli,
  gnosisChiado,
  goerli,
  hardhat,
  mantleTestnet,
  optimismGoerli,
  polygon,
  polygonMumbai,
  polygonZkEvmTestnet,
  scrollSepolia,
} from "wagmi/chains";

import { env } from "@/env.mjs";
import HardhatIcon from "@/icons/hardhat.svg";
import PolygonIcon from "@/icons/polygon.svg";

export type ChainMap = { [chainId: number]: string };

const getChains = () => {
  switch (env.NEXT_PUBLIC_CHAIN) {
    case "localhost":
      return [
        hardhat,
        polygonMumbai,
        goerli,
        optimismGoerli,
        mantleTestnet,
        polygonZkEvmTestnet,
        gnosisChiado,
        scrollSepolia,
        arbitrumGoerli,
      ];
    case "testnet":
      return [
        polygonMumbai,
        goerli,
        optimismGoerli,
        mantleTestnet,
        polygonZkEvmTestnet,
        gnosisChiado,
        scrollSepolia,
        arbitrumGoerli,
      ];
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
  [goerli.id]: HardhatIcon,
  [optimismGoerli.id]: HardhatIcon,
  [mantleTestnet.id]: HardhatIcon,
  [polygonZkEvmTestnet.id]: HardhatIcon,
  [gnosisChiado.id]: HardhatIcon,
  [scrollSepolia.id]: HardhatIcon,
  [arbitrumGoerli.id]: HardhatIcon,
};
