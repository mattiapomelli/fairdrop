import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "./scripts/deploy";
import "./scripts/generate";

const mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const accounts = {
  mnemonic,
  count: 100,
};

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 31337,
      accounts,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts,
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts,
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts,
      gasPrice: 1000000000,
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts,
    },
    mantleTestnet: {
      url: "https://rpc.testnet.mantle.xyz",
      accounts,
    },
    polygonZkEVMTestnet: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts,
    },
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts,
      gasPrice: 1000000000,
    },
    lineaTestnet: {
      url: "https://rpc.goerli.linea.build",
      accounts,
    },
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia-blockscout.scroll.io/api",
          browserURL: "https://sepolia-blockscout.scroll.io/",
        },
      },
      {
        network: "mantleTestnet",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz",
        },
      },
      {
        network: "polygonZkEVMTestnet",
        chainId: 1442,
        urls: {
          apiURL: "https://testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com/",
        },
      },
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
      {
        network: "lineaTestnet",
        chainId: 59140,
        urls: {
          apiURL: "https://goerli.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build/",
        },
      },
    ],
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      chiado: process.env.GNOSISSCAN_API_KEY || "", // doesn't work
      gnosis: process.env.GNOSISSCAN_API_KEY || "", // doesn't work
      scrollSepolia: "abc", // doesn't work
      mantleTestnet: process.env.ETHERSCAN_API_KEY || "",
      polygonZkEVMTestnet: process.env.ETHERSCAN_API_KEY || "", // doesn't work
      baseGoerli: "PLACEHOLDER_STRING", // doesn't work
      lineaTestnet: process.env.LINEASCAN_API_KET || "",
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
