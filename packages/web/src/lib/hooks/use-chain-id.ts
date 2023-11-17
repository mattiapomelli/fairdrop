import { useNetwork } from "wagmi";

import { CHAINS } from "@/config/chains";

export const useChainId = () => {
  const { chain, chains } = useNetwork();
  const chainId = chain?.id || chains[0]?.id || CHAINS[0].id;
  return chainId;
};
