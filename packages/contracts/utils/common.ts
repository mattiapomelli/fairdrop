import { toHex, zeroAddress, decodeAbiParameters } from "viem";

export function getWorldCoinClaimParams() {
  const proof = toHex(0, {
    size: 256,
  });
  const unpackedProof = decodeAbiParameters([{ type: "uint256[8]" }], proof)[0];
  return [zeroAddress, BigInt(0), BigInt(0), unpackedProof] as readonly [
    `0x${string}`,
    bigint,
    bigint,
    readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint],
  ];
}
