"use client";

import { AxiomV2Callback } from "@axiom-crypto/core";
import { useAxiomCircuit } from "@axiom-crypto/react";
import { useEffect } from "react";

import { AxiomClient } from "@/components/axiom/axiom-client";
import { Spinner } from "@/components/ui/spinner";
import { CircuitInputs } from "@/lib/axiom//circuit";

export function AxiomBuildQuery({
  inputs,
  callback,
}: {
  inputs: CircuitInputs;
  callback: AxiomV2Callback;
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
      <div className="flex flex-row items-center gap-2">
        Building Axiom Query <Spinner />
      </div>
    );
  }

  return <AxiomClient />;
}
