import { NextApiRequest, NextApiResponse } from 'next'
import { getLocalProvider } from '../../utils/provider'

export default async function block(req: NextApiRequest, res: NextApiResponse) {
  const { number } = req.query

  const provider = getLocalProvider()
  const block = await provider.getBlock(
    number ? Number(number as string) : 'latest'
  )
  res.json([block])
}
