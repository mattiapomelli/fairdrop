import { JsonRpcProvider } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'
import { getLocalProvider } from '../../utils/provider'

export default async function transactions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const provider = getLocalProvider()
  try {
    const allTransactions = await getAllTransactions(provider)
    res.json(allTransactions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}

async function getAllTransactions(provider: JsonRpcProvider) {
  const allTransactions = []

  let latestBlockNumber = await provider.getBlockNumber()

  while (latestBlockNumber >= 0) {
    const block = await provider.getBlock(latestBlockNumber)
    const transactions = block!.transactions

    const fullTransactions = await Promise.all(
      transactions.map(async (txHash) => await provider.getTransaction(txHash))
    )

    allTransactions.push(...fullTransactions)

    latestBlockNumber--
  }

  return allTransactions
}
