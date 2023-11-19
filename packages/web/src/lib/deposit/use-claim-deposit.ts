import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { toHex, zeroAddress, decodeAbiParameters, TransactionReceipt } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { getFairdropContractParams } from "@/config/contracts";
import { useChainId } from "@/lib/hooks/use-chain-id";

type WorldIdVerificationParams = readonly [
  `0x${string}`,
  bigint,
  bigint,
  readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint],
];

function getWorldIdVerificationZeroParams(): WorldIdVerificationParams {
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
  worldIdVerificationParams: z
    .object({
      merkleRoot: z.string().min(1),
      nullifierHash: z.string().min(1),
      proof: z.string().min(1),
    })
    .optional(),
});

type ClaimAirdropData = z.infer<typeof claimDepositSchema>;

export function useClaimDeposit(
  options?: Omit<
    UseMutationOptions<TransactionReceipt, Error, ClaimAirdropData, unknown>,
    "mutationFn"
  >,
) {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  return useMutation({
    mutationFn: async (data: ClaimAirdropData) => {
      if (!address) throw new Error("No address");

      const password = toHex(data.password, {
        size: 32,
      });

      let worldIdVerificationParams: WorldIdVerificationParams | undefined;
      if (data.worldIdVerificationParams) {
        const merkleRoot = decodeAbiParameters(
          [{ type: "uint256" }],
          data.worldIdVerificationParams.merkleRoot as `0x${string}`,
        )[0];
        const nullifierHash = decodeAbiParameters(
          [{ type: "uint256" }],
          data.worldIdVerificationParams.nullifierHash as `0x${string}`,
        )[0];
        const proof = decodeAbiParameters(
          [{ type: "uint256[8]" }],
          data.worldIdVerificationParams.proof as `0x${string}`,
        )[0];
        worldIdVerificationParams = [address, merkleRoot, nullifierHash, proof];
      } else {
        worldIdVerificationParams = getWorldIdVerificationZeroParams();
      }

      // Claim
      const config = getFairdropContractParams(chainId);
      const result = await writeContract({
        ...config,
        functionName: "claimDeposit",
        args: [BigInt(data.depositId), password, ...worldIdVerificationParams],
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
