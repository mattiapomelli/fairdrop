import Table from '@/components/common/Table'
import { TableData } from '@/types'
import { FC, useEffect, useState } from 'react'

const Blocks: FC = () => {
  const [blockData, setBlockData] = useState<TableData>([])
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    const sessionBlocks = sessionStorage.getItem('blocks')
    if (sessionBlocks) setBlockData(JSON.parse(sessionBlocks).slice(0, limit))
  }, [limit])

  const increaseLimit = () => setLimit(limit + 5)

  return (
    <Table
      title="Latest Blocks"
      headers={[
        'Height',
        'Timestamp',
        'Transactions',
        'Block Hash',
        'Block Reward (ΞTH)',
      ]}
      data={blockData}
      cellColors={['#00ccff', '', '', '#00ccff', '']}
      link={'/block/'}
      loadMore={blockData.length >= limit ? increaseLimit : undefined}
    />
  )
}

export default Blocks
