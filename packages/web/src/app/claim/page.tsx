"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useClaimDeposit } from "@/lib/deposit/use-claim-deposit";

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

interface Params {
  slug: string;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default function ClaimPage({ searchParams }: PageProps) {
  const password = (searchParams?.password as string) ?? "";
  const depositId = (searchParams?.depositId as string) ?? "";

  const { mutate, isPending } = useClaimDeposit({
    onSuccess() {
      toast({
        title: "Position claimed!",
        description: "Position claimed successfully!",
        variant: "default",
      });
    },
  });

  const onClaim = () => {
    mutate({
      depositId: Number(depositId),
      password,
    });
  };

  return (
    <div className="container">
      <h1 className="mb-4 text-3xl font-bold">Claim your position!</h1>
      <Button onClick={() => onClaim()} disabled={isPending} loading={isPending}>
        Claim
      </Button>
    </div>
  );
}
