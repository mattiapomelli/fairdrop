import contractAddressesJson from "./addresses.json";

import { FairdropAbi } from "@/config/abis/fairdrop";

const contractAddresses = contractAddressesJson as Record<string, Record<number, `0x${string}`>>;

export const getFairdropContractParams = (chainId: number) => ({
  address: contractAddresses.Fairdrop[chainId],
  abi: FairdropAbi,
});
