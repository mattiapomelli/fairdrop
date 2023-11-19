import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { useAccount } from "wagmi";

import { StrategyAbi } from "@/config/abis/strategy";

export function useIsEligible({
  strategyAddress,
  enabled,
}: {
  strategyAddress: `0x${string}`;
  enabled?: boolean;
}) {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["is-verified", address],
    queryFn: async () => {
      if (!address) return false;

      return await readContract({
        address: strategyAddress,
        abi: StrategyAbi,
        functionName: "isEligible",
        args: [address],
      });
    },
    enabled,
  });
}
