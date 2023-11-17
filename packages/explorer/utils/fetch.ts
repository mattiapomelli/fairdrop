import { Block, TableData, Transaction } from "@/types";
import { parseBlocks, parseTransactions } from "./parse";
import { getLocalProvider } from "./provider";

export const fetchBlocks = async (): Promise<[TableData, Block[]] | false> => {
  try {
    const response = await fetch(`/api/blocks`);
    const rawData: Block[] = await response.json();
    return [parseBlocks(rawData), rawData];
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const fetchBlock = async (
  blockNumber: string
): Promise<[TableData, Block[]] | false> => {
  try {
    const response = await fetch(`/api/block?number=${blockNumber}`);
    const rawData: Block[] = await response.json();
    return [parseBlocks(rawData), rawData];
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const fetchTransactions = async (
  blocks: Block[]
): Promise<TableData | false> => {
  try {
    const provider = getLocalProvider();
    const allTransactions: any[] = [];
    const allParsedTransactions: any[] = [];

    for (const block of blocks) {
      const transactions = block.transactions;
      await Promise.all(
        transactions.map(async (txHash) => {
          const tx = await provider.getTransaction(txHash);
          allTransactions.push(tx);
        })
      );

      const parsedTransactions = parseTransactions(
        allTransactions as unknown as Transaction[],
        block
      );
      allParsedTransactions.push(...parsedTransactions);
    }

    return allParsedTransactions;
  } catch (error) {
    console.error(error);
    return false;
  }
};
