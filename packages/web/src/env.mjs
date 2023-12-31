import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_CHAIN: z.union([
      z.literal("localhost"),
      z.literal("testnet"),
      z.literal("mainnet"),
    ]),
    NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().min(1),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_ALCHEMY_URI_GOERLI: z.string().url(),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_WORLDCOIN_APP_ID: z.string().min(1),
    NEXT_PUBLIC_WORLDCOIN_ACTION_ID: z.string().min(1),
    NEXT_PUBLIC_AXIOM_IS_MOCK: z.string().regex(/^(true|false)$/),
  },
  // Only need to destructure client variables
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CHAIN: process.env.NEXT_PUBLIC_CHAIN,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_ALCHEMY_URI_GOERLI: process.env.NEXT_PUBLIC_ALCHEMY_URI_GOERLI,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_WORLDCOIN_APP_ID: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID,
    NEXT_PUBLIC_WORLDCOIN_ACTION_ID: process.env.NEXT_PUBLIC_WORLDCOIN_ACTION_ID,
    NEXT_PUBLIC_AXIOM_IS_MOCK: process.env.NEXT_PUBLIC_AXIOM_IS_MOCK,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
