import { Block, TableData } from '@/types'
import { fetchBlock, fetchBlocks, fetchTransactions } from '@/utils/fetch'
import { getLocalProvider } from '@/utils/provider'
import { FC, ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Navigation from './navigation'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const [blockData, setBlockData] = useState<TableData>([])
  const [transactionData, setTransactionData] = useState<TableData>(
    []
  )

  useEffect(() => {
    ;(async () => {
      const blocks = await fetchBlocks()

      if (blocks) {
        const transactions = await fetchTransactions(
          blocks[1] as unknown as Block[]
        )
        if (transactions) setTransactionData(transactions)
        setBlockData(blocks[0])
      }
    })()

    const provider = getLocalProvider()
    provider.on('block', async (blockNumber) => {
      const block = await fetchBlock(blockNumber)
      if (block) {
        const transactions = await fetchTransactions(
          block[1] as unknown as Block[]
        )
        if (transactions)
          setTransactionData((prevTransactionData) => [
            ...transactions,
            ...prevTransactionData,
          ])

        setBlockData((prevBlockData) => [...block[0], ...prevBlockData])
      }
    })
  }, [])

  useEffect(
    () => sessionStorage.setItem('blocks', JSON.stringify(blockData)),
    [blockData]
  )

  useEffect(
    () =>
      sessionStorage.setItem('transactions', JSON.stringify(transactionData)),
    [transactionData]
  )

  return (
    <div className="bg-background h-screen overflow-y-scroll">
      <Toaster position="bottom-right" />
      <Navigation />
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  )
}

export default Layout
