import Blockies from "react-blockies";

import { cn } from "@/lib/utils";

interface AddressAvatarProps {
  address: `0x${string}`;
  size?: number;
  className?: string;
}

export const AddressAvatar = ({ address, size = 2.4, className }: AddressAvatarProps) => {
  return (
    <Blockies
      data-testid="avatar"
      seed={address}
      scale={size}
      size={8}
      className={cn("rounded-full", className)}
    />
  );
};
