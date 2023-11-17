import contractAddressesJson from "./addresses.json";

import { StorageAbi } from "@/config/abis/storage";

const contractAddresses = contractAddressesJson as Record<string, Record<number, `0x${string}`>>;

export const getStorageConfig = (chainId: number) => ({
  address: contractAddresses["Storage"][chainId],
  abi: StorageAbi,
});
