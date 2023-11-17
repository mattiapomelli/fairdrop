import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";

import { WalletDropdown } from "./wallet-dropdown";

export const WalletStatus = () => {
  const { open } = useWeb3Modal();

  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return <WalletDropdown address={address} />;
  }

  return <Button onClick={() => open()}>Connect Wallet</Button>;
};
