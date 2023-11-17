export enum InputType {
  Block = 'block',
  Tx = 'tx',
  Address = 'address',
  Unknown = 'unknown',
}

export interface ParamInputs {
  [key: string]: string
}

interface Inputs {
  type: string
  hex: string
}

export interface DecodedInputs {
  method: string
  types: string[]
  inputs: (string | Inputs)[]
  names: string[]
}
