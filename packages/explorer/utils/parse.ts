import { Block, Transaction } from "@/types";
import { Abi } from "@/types/abi";
import { InputType, ParamInputs } from "@/types/input";
import { iNotification } from "@/types/notification";
import { formatAddress } from "./format";
import { generateError } from "./notification";
import { validateAbi } from "./validate";

export const parseBlocks = (blocks: Block[]) => {
  const data = blocks.map((block) => {
    const height = block.number;
    const timestamp = new Date(block.timestamp * 1000).toLocaleString(); // Convert Unix timestamp to a readable date and time
    const transactions = block.transactions.length;
    const blockhash = formatAddress(block.hash);
    const gasUsed = parseFloat(block.gasUsed);
    const baseFeePerGas = parseFloat(block.baseFeePerGas);
    const blockReward = (gasUsed * baseFeePerGas) / 10 ** 18;

    return [height, timestamp, transactions, blockhash, blockReward];
  });

  return data;
};

export const parseTransactions = (
  transactions: Transaction[],
  block: Block
) => {
  const data = transactions.map((transaction) => {
    const value = Number(transaction.value);
    const transactionHash = transaction.hash;
    const from = formatAddress(transaction.from);
    const to = transaction.to
      ? formatAddress(transaction.to)
      : "Contract Creation";
    const valueSent = value > 0 ? (value / 10 ** 18).toFixed(4) : value;
    const timestamp = new Date(block.timestamp * 1000).toLocaleString();

    return [transactionHash, from, to, valueSent, timestamp];
  });

  return data;
};

export const parseInputType = (input: string): InputType => {
  const blockNumberPattern = /^\d+$/;
  const txHashPattern = /^0x([A-Fa-f0-9]{64})$/;
  const addressPattern = /^0x([A-Fa-f0-9]{40})$/;

  if (blockNumberPattern.test(input)) return InputType.Block;
  else if (txHashPattern.test(input)) return InputType.Tx;
  else if (addressPattern.test(input)) return InputType.Address;
  else return InputType.Unknown;
};

const parseAbi = <T>(abi: T) => {
  if (!validateAbi(abi)) return false;

  const jsonAbi = JSON.parse(abi as string);

  return jsonAbi
    .map((x: Abi) => {
      return {
        name: x.name,
        type: x.type,
        inputs: x.inputs,
        outputs: x.outputs,
        stateMutability: x.stateMutability,
        constant: x.constant,
      };
    })
    .filter((x: { type: string }) => x.type === "function");
};

export const parseNewAbi = (newAbi: string) => {
  try {
    JSON.parse(newAbi);
  } catch (e) {
    return undefined;
  }

  const data = parseAbi(newAbi);

  return data ? data : undefined;
};

export const parseParams = (
  paramInput: ParamInputs | []
): string[] | iNotification => {
  let parsedParams: any[] = [];

  if (paramInput) {
    try {
      Object.entries(paramInput).forEach(([_key, value], _) => {
        try {
          const parsedArray = JSON.parse(value);
          if (Array.isArray(parsedArray)) parsedParams.push(parsedArray);
        } catch (e) {
          parsedParams.push(value);
        }
      });
    } catch (e) {
      if (e instanceof Error) return generateError(e.message);
    }
  }

  return parsedParams;
};

export const parseArray = (arr: any): any[] => {
  let newArr = [];

  for (let i = 0; i < arr.length; i++) {
    let val;
    if (Array.isArray(arr[i])) {
      val = parseArray(arr[i]);
    } else {
      val = arr[i].toString();
    }
    newArr.push(val);
  }
  return newArr;
};
