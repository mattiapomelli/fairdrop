import { AxiomV2Callback, bytes32 } from "@axiom-crypto/core";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

import { BuildQuery } from "@/components/claim/build-query";
import { FairdropAbi } from "@/config/abis/fairdrop";
import { CircuitInputs } from "@/lib/axiom/circuit";
import { Constants } from "@/lib/axiom/constants";

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

export default async function Claim({ searchParams }: PageProps) {
  const connected = (searchParams?.connected as string) ?? "";
  const txHash = (searchParams?.txHash as string) ?? "";
  const blockNumber = (searchParams?.blockNumber as string) ?? "";
  const logIdx = (searchParams?.logIdx as string) ?? "";

  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  });

  const tx = await publicClient.getTransaction({
    hash: txHash as `0x${string}`,
  });
  const txIdx = tx.transactionIndex.toString();

  const inputs: CircuitInputs = {
    blockNumber: Number(blockNumber),
    txIdx: Number(txIdx),
    logIdx: Number(logIdx),
  };
  const callback: AxiomV2Callback = {
    target: Constants.AXIOM_CLIENT_CONTRACT as `0x${string}`,
    extraData: bytes32(connected),
  };

  return (
    <div className="container">
      <h1 className="text-xl font-bold">Claim airdrop</h1>
      <div className="text-center">
        Please wait while we generate a compute proof in wasm for the Axiom Query. Once complete,
        you can click the buttom below to claim your UselessToken airdrop. UselessToken is purely
        used for testing purposes and holds no financial or nonmonetary value.
      </div>
      <div className="flex flex-col items-center gap-2">
        <BuildQuery inputs={inputs} callback={callback} airdropAbi={FairdropAbi} />
      </div>
    </div>
  );
}
