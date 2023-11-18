"use client";

import { useAxiomCircuit } from "@axiom-crypto/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Abi, formatEther } from "viem";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

import { Button } from "@/components/ui/button";
import { Constants } from "@/lib/axiom/constants";

export function ClaimAirdropClient({ airdropAbi }: { airdropAbi: Abi }) {
  const { address } = useAccount();
  const router = useRouter();
  const { axiom, builtQuery, payment } = useAxiomCircuit();
  const [showExplorerLink, setShowExplorerLink] = useState(false);

  const axiomQueryAbi = axiom.getAxiomQueryAbi();
  const axiomQueryAddress = axiom.getAxiomQueryAddress();

  console.log("Axiom query address: ", axiomQueryAddress);
  console.log("Axiom query abi: ", axiomQueryAbi);

  const claimParams = [
    builtQuery?.sourceChainId,
    builtQuery?.dataQueryHash,
    builtQuery?.computeQuery,
    builtQuery?.callback,
    builtQuery?.userSalt,
    builtQuery?.maxFeePerGas,
    builtQuery?.callbackGasLimit,
    address,
    builtQuery?.dataQuery,
  ];

  console.log("Claim params: ", claimParams);

  // Prepare hook for the sendQuery transaction
  const { config } = usePrepareContractWrite({
    address: axiomQueryAddress as `0x${string}`,
    abi: axiomQueryAbi,
    functionName: "sendQuery",
    args: claimParams,
    value: BigInt(payment ?? 0),
  });
  const { isLoading, isSuccess, write } = useContractWrite(config);

  console.log("Write: ", write);

  // Check that the user has not claimed the airdrop yet
  const { data: hasClaimed } = useContractRead({
    address: Constants.AXIOM_CLIENT_CONTRACT as `0x${string}`,
    abi: airdropAbi,
    functionName: "hasClaimed",
    args: [address],
  });
  console.log("hasClaimed?", hasClaimed);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setShowExplorerLink(true);
      }, 30000);
    }
  }, [isSuccess, setShowExplorerLink]);

  const proofGeneratedAction = useCallback(() => {
    router.push(`success/?address=${address}`);
  }, [router, address]);

  // const proofValidationFailedAction = useCallback(() => {
  //   if (isError) {
  //     router.push(`fail/?address=${address}`);
  //   }
  // }, [isError, router, address]);

  // Monitor contract for `ClaimAirdrop` or `ClaimAirdropError` events
  useContractEvent({
    address: Constants.AXIOM_CLIENT_CONTRACT as `0x${string}`,
    abi: airdropAbi,
    eventName: "ClaimAirdrop",
    listener(log) {
      console.log("Claim airdrop success");
      console.log(log);
      proofGeneratedAction();
    },
  });

  // useContractEvent({
  //   address: Constants.AUTO_AIRDROP_ADDR as `0x${string}`,
  //   abi: abi,
  //   eventName: 'ClaimAirdropError',
  //   listener(log) {
  //     console.log("Claim airdrop error");
  //     console.log(log);
  //     proofValidationFailedAction();
  //   },
  // });

  const renderButtonText = () => {
    if (isSuccess) {
      return "Waiting for callback...";
    }
    if (isLoading) {
      return "Confrm transaction in wallet...";
    }
    if (!!hasClaimed) {
      return "Airdrop already claimed";
    }
    return "Claim 100 UT";
  };

  const renderClaimProofText = () => {
    return `Generating the proof for the claim costs ${formatEther(
      BigInt(payment ?? 0),
    ).toString()}ETH`;
  };

  const renderExplorerLink = () => {
    if (!showExplorerLink) {
      return null;
    }
    return (
      <Link href={`https://explorer.axiom.xyz/v2/goerli/mock`} target="_blank">
        View status on Axiom Explorer
      </Link>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button disabled={isLoading || isSuccess || !!hasClaimed} onClick={() => write?.()}>
        {renderButtonText()}
      </Button>
      <div className="flex flex-col items-center gap-2 text-sm">
        <div>
          {isSuccess ? "Proof generation may take up to 3 minutes" : renderClaimProofText()}
        </div>
        {renderExplorerLink()}
      </div>
    </div>
  );
}
