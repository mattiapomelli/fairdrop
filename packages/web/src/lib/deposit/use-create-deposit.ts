import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { keccak256, toHex, parseEther, fromHex } from "viem";
import { usePublicClient, erc20ABI } from "wagmi";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import contractAddressesJson from "@/config/addresses.json";
import { getFairdropContractParams } from "@/config/contracts";
import { env } from "@/env.mjs";
import { useChainId } from "@/lib/hooks/use-chain-id";

const contractAddresses = contractAddressesJson as Record<string, Record<number, `0x${string}`>>;

const getStrategyFromProtocol = (protocol: string, chainId: number) => {
  return contractAddresses[`${protocol}Strategy`][chainId];
};

export const createAirdropSchema = z.object({
  quantity: z.number().positive().int(),
  amount: z.number().positive(),
  token: z.string().min(1),
  protocol: z.string().min(1),
  lockedDays: z.number().int(),
});

type CreateAirdropData = z.infer<typeof createAirdropSchema>;

export function useCreateDeposit(
  options?: Omit<UseMutationOptions<string[], Error, CreateAirdropData, unknown>, "mutationFn">,
) {
  const chainId = useChainId();
  const publicClient = usePublicClient();

  return useMutation({
    mutationFn: async (data: CreateAirdropData) => {
      // Generate random strings as passwords
      const passwords = Array.from({ length: data.quantity }, () => {
        return Math.random().toString(36).slice(2);
      });

      const hexPasswords = passwords.map((password) => toHex(password, { size: 32 }));

      const hashedPasswords = hexPasswords.map((password) => keccak256(password));

      // Get date of withdraw in seconds
      const withdrawableAt = BigInt(Math.floor(Date.now() / 1000) + data.lockedDays * 86400);

      // Get token address
      const tokenAddress = data.token as `0x${string}`;

      // Get deposit amount
      const depositAmount = parseEther(data.amount.toString());

      // Get strategy address
      const strategyAddress = getStrategyFromProtocol(data.protocol, chainId);

      // Approve if allowance is not enough

      const totalDepositAmount = depositAmount * BigInt(data.quantity);

      const result = await writeContract({
        address: tokenAddress,
        functionName: "approve",
        abi: erc20ABI,
        args: [getFairdropContractParams(chainId).address, totalDepositAmount],
      });

      await publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });

      // Deposit
      const config = getFairdropContractParams(chainId);
      const result2 = await writeContract({
        ...config,
        functionName: "createDeposits",
        args: [
          hashedPasswords,
          withdrawableAt,
          tokenAddress,
          depositAmount,
          strategyAddress,
          false,
          false,
        ],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: result2.hash,
      });

      const depositIds = receipt.logs.slice(1).map((log) => {
        const depositId = log.topics[1] as `0x${string}`;
        return fromHex(depositId, {
          to: "bigint",
        });
      });

      console.log("Deposit ids: ", depositIds);

      // Create links
      const links = depositIds.map((depositId, index) => {
        const siteUrl = env.NEXT_PUBLIC_SITE_URL;
        const password = passwords[index];
        const link = `${siteUrl}/claim?depositId=${depositId}&password=${password}`;
        return link;
      });

      return links;
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
