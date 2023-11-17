export interface AbiInputs {
  name: string;
  type: string;
}

export interface Abi {
  constant?: string;
  inputs: AbiInputs[];
  name: string;
  outputs: AbiInputs[];
  stateMutability: string;
  type: string;
}

export const InitAbi: Abi = {
  name: "-- Choose a function --",
  constant: "",
  inputs: [],
  outputs: [],
  stateMutability: "",
  type: "",
};
