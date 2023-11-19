"use client";

import { useAxiomCircuit } from "@axiom-crypto/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import { Button } from "@/components/ui/button";

export function AxiomClient() {
  const { address } = useAccount();

  const { axiom, builtQuery, payment } = useAxiomCircuit();
  const [showExplorerLink, setShowExplorerLink] = useState(false);

  const axiomQueryAbi = axiom.getAxiomQueryAbi();
  const axiomQueryAddress = axiom.getAxiomQueryAddress();

  console.log("Axiom query address: ", axiomQueryAddress);

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

  // console.log("Claim params: ", claimParams);

  // Prepare hook for the sendQuery transaction
  const { config } = usePrepareContractWrite({
    address: axiomQueryAddress as `0x${string}`,
    abi: axiomQueryAbi,
    functionName: "sendQuery",
    args: claimParams,
    value: BigInt(payment ?? 0),
    onSuccess() {
      console.log("Success!!");
    },
  });
  const { isLoading, isSuccess, write } = useContractWrite(config);

  // console.log("Write: ", write);

  // Check that the user has not claimed the airdrop yet
  // const { data: hasClaimed } = useContractRead({
  //   address: Constants.AXIOM_CLIENT_CONTRACT as `0x${string}`,
  //   abi: airdropAbi,
  //   functionName: "hasClaimed",
  //   args: [address],
  // });
  // console.log("hasClaimed?", hasClaimed);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setShowExplorerLink(true);
      }, 30000);
    }
  }, [isSuccess, setShowExplorerLink]);

  // const proofGeneratedAction = useCallback(() => {
  //   router.push(`success/?address=${address}`);
  // }, [router, address]);

  // Monitor contract for `ClaimAirdrop` or `ClaimAirdropError` events
  // useContractEvent({
  //   address: Constants.AXIOM_CLIENT_CONTRACT as `0x${string}`,
  //   abi: airdropAbi,
  //   eventName: "ClaimAirdrop",
  //   listener(log) {
  //     console.log("Claim airdrop success");
  //     console.log(log);
  //     proofGeneratedAction();
  //   },
  // });

  return (
    <div className="flex flex-col items-center gap-2">
      <Button disabled={isLoading || isSuccess} onClick={() => write?.()}>
        {isSuccess && "Waiting for callback..."}
        {isLoading && "Confirm transaction in wallet..."}
        {!isLoading && !isSuccess && "Generate proof"}
      </Button>
      <div className="flex flex-col items-center gap-2 text-sm">
        <div>
          {isSuccess
            ? "Proof generation may take up to 3 minutes"
            : `Generating the proof for the claim costs ${formatEther(
                BigInt(payment ?? 0),
              ).toString()}ETH`}
        </div>
        {showExplorerLink && (
          <Link href={`https://explorer.axiom.xyz/v2/goerli/mock`} target="_blank">
            View status on Axiom Explorer
          </Link>
        )}
      </div>
    </div>
  );
}
