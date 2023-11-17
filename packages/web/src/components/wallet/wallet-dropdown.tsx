import { CopyIcon, ExternalLinkIcon, LogOutIcon } from "lucide-react";
import { useChainId, useDisconnect } from "wagmi";

import { Address } from "@/components/address";
import { AddressAvatar } from "@/components/address-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getAddressExplorerLink } from "@/config/urls";
import { copyToClipboard } from "@/lib/utils";

interface WalletDropdownProps {
  address: `0x${string}`;
}

export const WalletDropdown = ({ address }: WalletDropdownProps) => {
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-full items-center gap-2 rounded-lg px-4 py-1.5">
        <AddressAvatar address={address} className="sm:hidden" />
        <AddressAvatar address={address} className="hidden sm:inline-flex" />
        <Address address={address} className="hidden sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => copyToClipboard(address)}
          className="flex cursor-pointer gap-2 px-4 py-2"
        >
          <CopyIcon className="h-4 w-4" />
          Copy address
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={getAddressExplorerLink(chainId, address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer gap-2 px-4 py-2"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            See in explorer
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => disconnect()}
          className="flex cursor-pointer gap-2 px-4 py-2"
        >
          <LogOutIcon className="h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
