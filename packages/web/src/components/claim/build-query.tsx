"use client";

import { AxiomV2Callback } from "@axiom-crypto/core";
import { useAxiomCircuit } from "@axiom-crypto/react";
import { useEffect } from "react";
import { Abi } from "viem";

import { ClaimAirdropClient } from "./claim-airdrop-client";

import { Spinner } from "@/components/ui/spinner";
import { CircuitInputs } from "@/lib/axiom//circuit";

export function BuildQuery({
  inputs,
  callback,
  airdropAbi,
}: {
  inputs: CircuitInputs;
  callback: AxiomV2Callback;
  airdropAbi: Abi;
}) {
  const { build, builtQuery, payment, setParams, areParamsSet } = useAxiomCircuit();

  useEffect(() => {
    setParams(inputs, callback);
  }, [setParams, inputs, callback]);

  useEffect(() => {
    const buildQuery = async () => {
      if (!areParamsSet) {
        return;
      }
      await build();
    };
    buildQuery();
  }, [build, areParamsSet]);

  if (!builtQuery || !payment) {
    return (
      <div className="flex flex-row items-center gap-2 font-mono">
        {"Building Query"} <Spinner />
      </div>
    );
  }

  return <ClaimAirdropClient airdropAbi={airdropAbi} />;
}
