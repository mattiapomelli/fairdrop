import { Transaction } from '@/types'
import { ethers } from 'ethers'

export const calculateTransactionFee = (transaction: Transaction) => {
  return ethers.formatEther(
    Number(transaction.gasLimit) * Number(transaction.maxFeePerGas)
  )
}

export const calculateRowsForJSONString = <T>(transaction: T) => {
  const jsonString = JSON.stringify(transaction, null, 4)
  return jsonString.split('\n').length
}

export const calculateLines = (str: string) => str.split('\n').length
