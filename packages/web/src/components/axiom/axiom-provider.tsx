"use client";

import { AxiomCircuitProvider } from "@axiom-crypto/react";
import { useEffect, useState } from "react";

import { env } from "@/env.mjs";
import { circuit } from "@/lib/axiom/circuit";

export function AxiomProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <AxiomCircuitProvider
      circuit={circuit}
      providerUri={process.env.NEXT_PUBLIC_ALCHEMY_URI_GOERLI as string}
      chainId={5}
      mock={env.NEXT_PUBLIC_AXIOM_IS_MOCK === "true"}
    >
      {mounted && children}
    </AxiomCircuitProvider>
  );
}
