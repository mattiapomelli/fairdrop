import { AxiomV2Callback, bytes32 } from "@axiom-crypto/core";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";

import { CircuitInputs } from "@/lib/axiom/circuit";
import { Constants } from "@/lib/axiom/constants";
import { findMostRecentSparkLendTx } from "@/lib/axiom/parse-recent-tx";

interface IsEligibleResult {
  eligible: boolean;
  inputs: CircuitInputs | undefined;
  callback: AxiomV2Callback | undefined;
}

export function useAxiomIsEligible() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  return useQuery<IsEligibleResult>({
    queryKey: ["isEligible", address],
    queryFn: async () => {
      if (!address) {
        return {
          eligible: false,
          inputs: undefined,
          callback: undefined,
        };
      }
      const lastSparkTxn = await findMostRecentSparkLendTx(address);
      if (lastSparkTxn === null) {
        return {
          eligible: false,
          inputs: undefined,
          callback: undefined,
        };
      }

      const log = lastSparkTxn?.log;
      const txHash = log?.transactionHash;
      const blockNumber = log?.blockNumber;
      const logIdx = lastSparkTxn?.logIdx;

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
        extraData: bytes32(address),
      };

      return {
        eligible: true,
        inputs,
        callback,
      };
    },
    enabled: !!address,
  });
}
