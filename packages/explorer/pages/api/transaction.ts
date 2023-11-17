import { NextApiRequest, NextApiResponse } from 'next'
import { getLocalProvider } from '../../utils/provider'

export default async function transaction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { hash } = req.query

  const provider = getLocalProvider()

  try {
    const transaction = await provider.getTransaction(hash as string)

    if (!transaction) res.status(404).json({ error: 'Transaction not found' })
    else res.json(transaction)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}
