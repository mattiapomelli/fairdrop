import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";

import { getFairdropContractParams } from "@/config/contracts";
import { useChainId } from "@/lib/hooks/use-chain-id";

// interface Deposit {
//   depositor: string;
//   hashedPassword: string;
//   amount: bigint;
//   tokenAddress: string;
//   strategy: number;
//   withdrawableAt: number;
//   claimed: boolean;
//   checkEligibility: boolean;
//   worldIdVerified: boolean;
//   batchId: number;
// }

interface UseDepositOptions {
  depositId: number;
  enabled?: boolean;
}

export function useDeposit({ depositId, enabled }: UseDepositOptions) {
  const chainId = useChainId();

  return useQuery({
    queryKey: ["deposit", depositId],
    queryFn: async () => {
      const config = getFairdropContractParams(chainId);
      const deposit = await readContract({
        ...config,
        functionName: "deposits",
        args: [BigInt(depositId)],
      });

      return {
        depositor: deposit[0],
        hashedPassword: deposit[1],
        amount: deposit[2],
        tokenAddress: deposit[3],
        strategy: deposit[4],
        withdrawableAt: deposit[5],
        claimed: deposit[6],
        checkEligibility: deposit[7],
        worldIdVerification: deposit[8],
        batchId: deposit[9],
      };
    },
    enabled,
  });
}
