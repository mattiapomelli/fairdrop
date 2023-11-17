import { twMerge } from "tailwind-merge";

import { cn } from "@/lib/utils";

interface AddressProps {
  address: `0x${string}`;
  className?: string;
}

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const Address = ({ address, className }: AddressProps) => {
  return <span className={twMerge(cn("font-medium", className))}>{formatAddress(address)}</span>;
};
