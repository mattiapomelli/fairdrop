"use client";

import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
// import { AbiCoder, BigNumber } from "ethers";
import { defaultAbiCoder as abi } from "ethers/lib/utils";
import { useState } from "react";
// import { decodeAbiParameters } from "viem";
import { decodeAbiParameters } from "viem";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import { Spinner } from "@/components/ui/spinner";
import { WorldcoinAbi } from "@/config/abis/worldcoin";
import contractAddressesJson from "@/config/addresses.json";
// import { getFairdropContractParams } from "@/config/contracts";
import { useChainId } from "@/lib/hooks/use-chain-id";

const contractAddresses = contractAddressesJson as Record<string, Record<number, `0x${string}`>>;

// const decode = <T extends any>(type: string, encodedString: string): T => {
//   const coder = AbiCoder.defaultAbiCoder();
//   return coder.decode([type], encodedString)[0];
// };

export const decode = <T extends any>(type: string, encodedString: string): T => {
  return abi.decode([type], encodedString)[0];
};

export default function Worldcoin() {
  const chainId = useChainId();
  const { address } = useAccount();
  const [proof, setProof] = useState<ISuccessResult | null>(null);

  // const params = getFairdropContractParams(chainId);

  const onSuccess = (result: ISuccessResult) => {
    console.log(result);
    setProof(result);
  };

  const { config } = usePrepareContractWrite({
    // ...params,
    address: contractAddresses.Worldcoin[chainId],
    abi: WorldcoinAbi,
    enabled: proof != null && address != null,
    functionName: "verifyAndExecute",
    args: [
      address!,
      proof?.merkle_root
        ? decodeAbiParameters([{ type: "uint256" }], proof.merkle_root as `0x${string}`)[0]
        : BigInt(0),
      proof?.nullifier_hash
        ? decodeAbiParameters([{ type: "uint256" }], proof.nullifier_hash as `0x${string}`)[0]
        : BigInt(0),
      proof?.proof
        ? decodeAbiParameters([{ type: "uint256[8]" }], proof.proof as `0x${string}`)[0]
        : [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)],
    ],
  });

  // const { config } = usePrepareContractWrite({
  //   // ...params,
  //   address: contractAddresses.Worldcoin[chainId],
  //   abi: WorldcoinAbi,
  //   enabled: proof != null && address != null,
  //   functionName: "verifyAndExecute",
  //   args: [
  //     address!,
  //     proof?.merkle_root
  //       ? decode<BigNumber>("uint256", proof?.merkle_root ?? "")
  //       : BigNumber.from(0),
  //     proof?.nullifier_hash
  //       ? decode<BigNumber>("uint256", proof?.nullifier_hash ?? "")
  //       : BigNumber.from(0),
  //     proof?.proof
  //       ? decode<
  //           [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
  //         >("uint256[8]", proof?.proof ?? "")
  //       : [
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //           BigNumber.from(0),
  //         ],
  //   ],
  // });

  const { write, isLoading } = useContractWrite(config);

  return (
    <div>
      {proof ? (
        <button onClick={write}>{isLoading ? <Spinner /> : "Verify"}</button>
      ) : (
        <IDKitWidget
          app_id="app_staging_0caea5b44fb78ba852926ffb770d4ef1" // must be an app set to on-chain
          action="claim-airdrop"
          signal={address} // prevents tampering with a message
          onSuccess={onSuccess}
          // no use for handleVerify, so it is removed
          // leave credential_types unspecified (orb-only by default), as phone credentials are not supported on-chain
          enableTelemetry
        >
          {({ open }) => <button onClick={open}>Verify with World ID</button>}
        </IDKitWidget>
      )}
    </div>
  );
}
