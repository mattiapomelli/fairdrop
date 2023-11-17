declare global {
  interface Window {
    ethereum: any
  }
}

export interface Block {
  _type: string
  baseFeePerGas: string
  difficulty: string
  extraData: string
  gasLimit: string
  gasUsed: string
  hash: string
  miner: string
  nonce: string
  number: number
  parentHash: string
  timestamp: number
  transactions: string[]
}

interface Signature {
  _type: string
  networkV: any
  r: string
  s: string
  v: number
}

export interface Transaction {
  _type: string
  accessList: any[]
  blockNumber: number
  blockHash: string
  chainId: string
  data: string
  from: string
  gasLimit: string
  gasPrice: string
  hash: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  nonce: number
  signature: Signature
  to: any
  type: number
  value: string
}

export interface Address {
  address: string
  balance: string
  transactionCount: number
  bytecode: string
}

export type TableData = (string | number)[][]
