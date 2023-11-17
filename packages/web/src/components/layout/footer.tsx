import { Command } from "lucide-react";
import * as React from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Command />
          <p className="text-center text-sm leading-loose md:text-left">Web3 Starter</p>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  );
}
