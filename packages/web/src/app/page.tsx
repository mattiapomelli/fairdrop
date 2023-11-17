"use client";

import { useContractRead } from "wagmi";

import { getStorageConfig } from "@/config/contracts";
import { useChainId } from "@/lib/hooks/use-chain-id";

export default function Home() {
  const chainId = useChainId();
  const config = getStorageConfig(chainId);

  console.log("Chain id: ", chainId);

  const { data } = useContractRead({
    ...config,
    functionName: "getData",
  });

  console.log("Data: ", data);

  return <div>Home</div>;
}
