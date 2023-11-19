"use client";

import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

import { AxiomVerification } from "@/components/axiom/axiom-verification";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import contractAddressesJson from "@/config/addresses.json";
import { env } from "@/env.mjs";
import { useClaimDeposit } from "@/lib/deposit/use-claim-deposit";
import { useDeposit } from "@/lib/deposit/use-deposit";
import { useIsEligible } from "@/lib/deposit/use-is-eligible";
import { useChainId } from "@/lib/hooks/use-chain-id";

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

interface Params {
  slug: string;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

const contractAddresses = contractAddressesJson as Record<string, Record<number, `0x${string}`>>;

const getProtocolFromStrategy = (strategyAddress: string, chainId: number) => {
  console.log(strategyAddress, chainId);

  const protocol = Object.entries(contractAddresses).find(([, addresses]) => {
    return (addresses[chainId] || "").toLowerCase() === strategyAddress.toLowerCase();
  });

  if (protocol === undefined) {
    return "";
  }

  return protocol[0].replace("Strategy", "");
};

export default function ClaimPage({ searchParams }: PageProps) {
  const password = (searchParams?.password as string) ?? "";
  const depositId = (searchParams?.depositId as string) ?? "";

  const [proof, setProof] = useState<ISuccessResult | null>(null);
  const { address } = useAccount();
  const chainId = useChainId();

  const { data: deposit } = useDeposit({
    depositId: Number(depositId),
    enabled: depositId !== undefined && depositId !== "",
  });
  const { data: isEligible, isPending: isPendingEligible } = useIsEligible({
    strategyAddress: deposit?.strategy || "0x",
    enabled: deposit !== undefined,
  });

  const { mutate, isPending } = useClaimDeposit({
    onSuccess() {
      toast({
        title: "Position claimed!",
        description: "Position claimed successfully!",
        variant: "default",
      });
    },
  });

  const onClaim = () => {
    mutate({
      depositId: Number(depositId),
      password,
      worldIdVerificationParams:
        deposit?.worldIdVerification && proof
          ? {
              merkleRoot: proof.merkle_root,
              nullifierHash: proof.nullifier_hash,
              proof: proof.proof,
            }
          : undefined,
    });
  };

  const onSuccess = (result: ISuccessResult) => {
    console.log(result);
    setProof(result);
  };

  if (!deposit || isPendingEligible) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (deposit.claimed) {
    return <div className="flex justify-center py-20">This deposit has already been claimed.</div>;
  }

  return (
    <div className="container mt-20 flex max-w-xl flex-col gap-4">
      <h1 className="text-3xl font-bold">
        Activate a position on {getProtocolFromStrategy(deposit.strategy, chainId)}
      </h1>
      <p className="text-lg">This position was airdropped to you by the protocol.</p>
      <div className="flex flex-col gap-3">
        <p className="text-lg">
          <b>Amount</b>: {formatEther(deposit.amount)}
        </p>
        <p className="text-lg">
          <b>Withdrawable at: </b>
          {deposit.withdrawableAt
            ? new Date(Number(deposit.withdrawableAt) * 1000).toLocaleString()
            : "N/A"}
        </p>
      </div>

      {deposit.worldIdVerification && !proof && (
        <IDKitWidget
          app_id={env.NEXT_PUBLIC_WORLDCOIN_APP_ID} // must be an app set to on-chain
          action={env.NEXT_PUBLIC_WORLDCOIN_ACTION_ID}
          signal={address} // prevents tampering with a message
          onSuccess={onSuccess}
          // no use for handleVerify, so it is removed
          // leave credential_types unspecified (orb-only by default), as phone credentials are not supported on-chain
          enableTelemetry
        >
          {({ open }) => <button onClick={open}>Verify with World ID</button>}
        </IDKitWidget>
      )}

      {deposit.checkEligibility && !isEligible && <AxiomVerification />}

      {((!deposit.worldIdVerification && !deposit.checkEligibility) ||
        (deposit.worldIdVerification && proof) ||
        (deposit.checkEligibility && isEligible)) && (
        <Button onClick={() => onClaim()} disabled={isPending} loading={isPending} size="lg">
          Activate
        </Button>
      )}
    </div>
  );
}
