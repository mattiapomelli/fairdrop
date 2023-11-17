import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Chain, useNetwork } from "wagmi";

import { Button, buttonVariants } from "@/components/ui/button";
import { CHAIN_ICON } from "@/config/chains";
import { cn } from "@/lib/utils";

interface ChainIconProps {
  chain: Chain;
  className?: string;
}

const ChainIcon = ({ chain, className }: ChainIconProps) => {
  const Icon = CHAIN_ICON[chain.id];
  return <Icon className={cn("h-4 w-4", className)} />;
};

export const ChainSwitch = () => {
  const { chain } = useNetwork();
  const { open } = useWeb3Modal();

  return (
    <button onClick={() => open({ view: "Networks" })}>
      {!chain || chain.unsupported ? (
        <Button size="sm" className="bg-red-400 hover:bg-red-500">
          Unsupported network
        </Button>
      ) : (
        <span className={cn(buttonVariants({ variant: "secondary" }), "gap-2 px-4")}>
          <ChainIcon chain={chain} className="h-4 w-4" />
          <span className="hidden sm:block">{chain?.name}</span>
        </span>
      )}
    </button>
  );
};
