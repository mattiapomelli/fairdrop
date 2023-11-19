import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { writeContract, readContract } from "@wagmi/core";
import { toHex, zeroAddress, decodeAbiParameters, TransactionReceipt } from "viem";
import { usePublicClient } from "wagmi";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { getFairdropContractParams } from "@/config/contracts";
import { useChainId } from "@/lib/hooks/use-chain-id";

function getWorldCoinClaimParams() {
  const proof = toHex(0, {
    size: 256,
  });
  const unpackedProof = decodeAbiParameters([{ type: "uint256[8]" }], proof)[0];
  return [zeroAddress, BigInt(0), BigInt(0), unpackedProof] as readonly [
    `0x${string}`,
    bigint,
    bigint,
    readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint],
  ];
}

export const claimDepositSchema = z.object({
  depositId: z.number().int(),
  password: z.string().min(1),
});

type ClaimAirdropData = z.infer<typeof claimDepositSchema>;

export function useClaimDeposit(
  options?: Omit<
    UseMutationOptions<TransactionReceipt, Error, ClaimAirdropData, unknown>,
    "mutationFn"
  >,
) {
  const chainId = useChainId();
  const publicClient = usePublicClient();

  return useMutation({
    mutationFn: async (data: ClaimAirdropData) => {
      const password = toHex(data.password, {
        size: 32,
      });

      // Claim
      const config = getFairdropContractParams(chainId);

      const deposit = await readContract({
        ...config,
        functionName: "deposits",
        args: [BigInt(data.depositId)],
      });

      console.log("Deposit:", deposit);
      console.log("Id: ", BigInt(data.depositId));
      console.log("Password: ", password);

      const result = await writeContract({
        ...config,
        functionName: "claimDeposit",
        args: [BigInt(data.depositId), password, ...getWorldCoinClaimParams()],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });

      return receipt;
    },
    onError(error) {
      console.log("Error");
      toast({
        title: "Something went wrong.",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
    ...options,
  });
}
