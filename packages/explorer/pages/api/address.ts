import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'
import { getLocalProvider } from '../../utils/provider'

export default async function address(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query

  const provider = getLocalProvider()

  try {
    const balance = await provider.getBalance(address as string)

    const transactionCount = await provider.getTransactionCount(
      address as string
    )

    const bytecode = await provider.getCode(address as string)

    res.json({
      address,
      balance: ethers.formatEther(balance),
      transactionCount,
      bytecode,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}
