import { NextApiRequest, NextApiResponse } from 'next'
import { getLocalProvider } from '../../utils/provider'

export default async function blocks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const provider = getLocalProvider()

  try {
    const latestBlockNumber = await provider.getBlockNumber()

    const blockNumbers = Array.from(
      { length: latestBlockNumber + 1 },
      (_, index) => latestBlockNumber - index
    )

    const blocksData = await Promise.all(
      blockNumbers.map(
        async (blockNumber) => await provider.getBlock(blockNumber)
      )
    )

    res.json(blocksData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}
