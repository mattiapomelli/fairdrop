"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LinkRow } from "@/components/link-row";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { DAI_ADDRESS } from "@/config/addresses";
import contractAddressesJson from "@/config/addresses.json";
import { createAirdropSchema, useCreateDeposit } from "@/lib/deposit/use-create-deposit";
import { useChainId } from "@/lib/hooks/use-chain-id";

const contractAddresses = contractAddressesJson as Record<string, Record<number, `0x${string}`>>;

type CreateAirdropData = z.infer<typeof createAirdropSchema>;

export default function Home() {
  const form = useForm<CreateAirdropData>({
    resolver: zodResolver(createAirdropSchema),
    defaultValues: {
      worldIdVerification: false,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = form;

  const protocol = watch("protocol");

  const chainId = useChainId();

  const [links, setLinks] = useState<string[]>([
    // "https://demo-fi.vercel.app/airdrop/"
  ]);

  const { mutate, isPending } = useCreateDeposit({
    onSuccess(links) {
      setLinks(links);
      reset();
      toast({
        title: "Airdrop created!",
        description: "Airdrop created successfully!",
        variant: "default",
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    mutate(data);
  });

  const isSparkLendAvailable = chainId === 1 || chainId === 5 || chainId === 100;

  return (
    <div className="container max-w-xl ">
      <h1 className="mb-4 text-3xl font-bold">Create new airdrop</h1>
      <p className="mb-4 text-xl">
        Don&apos;t airdrop token that will be dumped instantly. Airdrop DeFi positions into your own
        protocol and keep your users involved.
      </p>
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="quantity" className="mb-1 block">
              Quantity (number of positions to airdrop)
            </Label>
            <Input
              id="quantity"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              // disabled={isPending}
              {...register("quantity", {
                valueAsNumber: true,
              })}
            />
            {errors?.quantity && (
              <p className="text-destructive px-1 text-xs">{errors.quantity.message}</p>
            )}
          </div>

          <FormField
            control={form.control}
            name={"protocol"}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-foreground">Protocol</FormLabel>
                <div className="flex flex-col gap-2">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"DemoFi"}>
                        DemoFi {isSparkLendAvailable ? " (Not available on this chain)" : ""}
                      </SelectItem>
                      <SelectItem value={"SparkLend"}>
                        SparkLend {!isSparkLendAvailable ? " (Not available on this chain)" : ""}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div>
            <Label htmlFor="amount" className="mb-1 block">
              Amount (tokens per position)
            </Label>
            <Input
              id="amount"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              // disabled={isPending}
              {...register("amount", {
                valueAsNumber: true,
              })}
            />
            {errors?.amount && (
              <p className="text-destructive px-1 text-xs">{errors.amount.message}</p>
            )}
          </div>

          <FormField
            control={form.control}
            name={"token"}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-foreground">Token</FormLabel>
                <div className="flex flex-col gap-2">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={contractAddresses.TestERC20[chainId]}>
                        {contractAddresses.TestERC20[chainId] || "Not available on this chain"}{" "}
                        (TestERC20)
                      </SelectItem>
                      <SelectItem value={DAI_ADDRESS[chainId]}>
                        {DAI_ADDRESS[chainId] || "Not available on this chain"} (DAI)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div>
            <Label htmlFor="lockedDays" className="mb-1 block">
              Locked days (days before users can claim their position)
            </Label>
            <Input
              id="lockedDays"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              // disabled={isPending}
              {...register("lockedDays", {
                valueAsNumber: true,
              })}
            />
            {errors?.lockedDays && (
              <p className="text-destructive px-1 text-xs">{errors.lockedDays.message}</p>
            )}
          </div>
          <FormField
            control={form.control}
            name="worldIdVerification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>World ID Verification</FormLabel>
                  <FormDescription>
                    Require users to verify their World ID to claim their position. This ensures
                    that only verified humans can claim and that a user can only claim a single
                    position.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {protocol === "SparkLend" && (
            <FormField
              control={form.control}
              name="checkEligibility"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Require previous interactions (powered by Axiom)</FormLabel>
                    <FormDescription>
                      Requires users to have previously interacted with SparkLend to be eligible for
                      the airdrop.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          )}

          <Button disabled={isPending} loading={isPending}>
            Create
          </Button>
        </form>
      </Form>
      {links.length > 0 && (
        <div>
          <h3 className="mb-4 mt-10 text-xl font-bold">Airdrop Links</h3>
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <LinkRow key={link} link={link} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
