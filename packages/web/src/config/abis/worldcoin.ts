export const WorldcoinAbi = [
  {
    inputs: [
      {
        internalType: "contract IWorldID",
        name: "_worldId",
        type: "address",
      },
      {
        internalType: "string",
        name: "_appId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_actionId",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidNullifier",
    type: "error",
  },
  {
    inputs: [],
    name: "externalNullifier",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "groupId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nullifierHashes",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signal",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "root",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nullifierHash",
        type: "uint256",
      },
      {
        internalType: "uint256[8]",
        name: "proof",
        type: "uint256[8]",
      },
    ],
    name: "verifyAndExecute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "worldId",
    outputs: [
      {
        internalType: "contract IWorldID",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
