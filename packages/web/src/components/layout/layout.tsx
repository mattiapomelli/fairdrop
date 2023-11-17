"use client";

import { useAccount } from "wagmi";

import { Footer } from "@/components/layout/footer";
import { MainNav } from "@/components/layout/main-nav";
import { marketingConfig } from "@/config/marketing";

import { ChainSwitch } from "../chain-switch";
import { WalletStatus } from "../wallet/wallet-status";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isConnecting, isReconnecting } = useAccount();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          {!isReconnecting && !isConnecting && (
            <nav className="flex items-center gap-4 duration-100 animate-in fade-in">
              <ChainSwitch />
              <WalletStatus />
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
