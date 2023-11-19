"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const chainId = useChainId();

  const [links, setLinks] = useState<string[]>([]);

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

  return (
    <div className="container">
      <h1 className="mb-4 text-3xl font-bold">Create new airdrop</h1>
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
                      <SelectItem value={"DemoFi"}>DemoFi</SelectItem>
                      <SelectItem value={"SparkLend"}>SparkLend</SelectItem>
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
                        {contractAddresses.TestERC20[chainId]}
                      </SelectItem>
                      <SelectItem value={DAI_ADDRESS[chainId]}>
                        {DAI_ADDRESS[chainId]} (DAI)
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
              Locked days
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
          <Button disabled={isPending} loading={isPending}>
            Create
          </Button>
        </form>
      </Form>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <div key={link}>{link}</div>
        ))}
      </div>
    </div>
  );
}
