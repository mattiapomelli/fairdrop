import { goerli } from "viem/chains";

import contractAddresses from "@/config/addresses.json";

export const Constants = Object.freeze({
  EXPLORER_BASE_URL: "https://explorer.axiom.xyz/v2/goerli/query/",
  SPARKLEND_POOL_ADDRESS_GOERLI: contractAddresses.SparkLendPool[goerli.id].toLowerCase(),
  EVENT_SCHEMA: "0x2b627736bca15cd5381dcf80b0bf11fd197d01a037c52b927a881a10fb73ba61",
  ELIGIBLE_BLOCK_HEIGHT: 9000000,
  AXIOM_CLIENT_CONTRACT: contractAddresses.SparkLendStrategy[goerli.id],
  // FAIRDROP_CONTRACT: "0xb8249737191E1e2480C5c48CbE36bd47dD7Ece79",
});
