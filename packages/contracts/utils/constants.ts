import { toHex, toBytes } from "viem";
import { goerli, mainnet, optimismGoerli } from "viem/chains";

export const SPARKLEND_POOL_ADDRESS: Record<number, `0x${string}`> = {
  [mainnet.id]: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
  [goerli.id]: "0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d", // Goerli
};

export const DAI_ADDRESS: Record<number, `0x${string}`> = {
  [mainnet.id]: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  [goerli.id]: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844", // Goerli
};

export const networkHasSparkLend = (network: string) => {
  return network === "devnet" || network === "goerli" || network === "gnosis";
};

export const networkHasWorldcoin = (network: string) => {
  return (
    network === "devnet" || network === "goerli" || network === "optimismGoerli"
  );
};

const AXIOM_V2_QUERY_ADDRESS_MOCK_GOERLI =
  "0xf15cc7B983749686Cd1eCca656C3D3E46407DC1f";
const AXIOM_V2_QUERY_ADDRESS_PRODUCTION_GOERLI =
  "0xBd5307B0Bf573E3F2864Af960167b24Aa346952b";

export const AXIOM_V2_QUERY_ADDRESS: Record<number, `0x${string}`> = {
  [mainnet.id]: "0x0000000000000000000000000000000000000000",
  [goerli.id]:
    process.env.AXIOM_IS_MOCK === "true"
      ? AXIOM_V2_QUERY_ADDRESS_MOCK_GOERLI
      : AXIOM_V2_QUERY_ADDRESS_PRODUCTION_GOERLI,
};

export const AXIOM_CALLBACK_QUERY_SCHEMA = toHex(
  toBytes("0xf6c2707e6b22ba0577261edc0c18ddbb1e3ec11ee5b5980682914bad2c2e6750")
);

export const WORLD_ID_ROUTER_ADDRESS: Record<number, `0x${string}`> = {
  [mainnet.id]: "0x163b09b4fE21177c455D850BD815B6D583732432",
  [goerli.id]: "0x11cA3127182f7583EfC416a8771BD4d11Fae4334",
  [optimismGoerli.id]: "0x515f06B36E6D3b707eAecBdeD18d8B384944c87f",
};
