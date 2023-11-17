import Table from '@/components/common/Table'
import { TableData } from '@/types'
import { FC, useEffect, useState } from 'react'

const Transactions: FC = () => {
  const [transactionData, setTransactionData] = useState<TableData>(
    []
  )
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    const sessionTransactions = sessionStorage.getItem('transactions')
    if (sessionTransactions)
      setTransactionData(JSON.parse(sessionTransactions).slice(0, limit))
  }, [limit])

  const increaseLimit = () => setLimit(limit + 5)

  return (
    <Table
      title="Latest Transactions"
      headers={['Transaction ID', 'From', 'To', 'Value']}
      data={transactionData}
      cellColors={['#00ccff']}
      link={'/tx/'}
      loadMore={transactionData.length >= limit ? increaseLimit : undefined}
    />
  )
}

export default Transactions
