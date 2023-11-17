import Container from '@/components/common/Container'
import Wrapper from '@/components/common/Wrapper'
import TxHash from '@/components/tx/TxHash'
import { Block, Transaction } from '@/types'
import { calculateRowsForJSONString } from '@/utils/calculate'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

const Transaction: FC = () => {
  const options = ['Overview', 'Raw Trace']
  const [selectedOption, setSelectedOption] = useState('Overview')
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<Transaction | undefined>()
  const [block, setBlock] = useState<Block | undefined>()

  const router = useRouter()

  const { hash } = router.query

  useEffect(() => {
    if (!hash) return
    fetch(`/api/transaction?hash=${hash}`)
      .then((response) => response.json())
      .then((data: Transaction | { error: string }) => {
        if ('error' in data) console.error(data.error)
        else setTransaction(data)
      })
      .catch((error) => console.error(error))

    if (transaction?.blockNumber)
      fetch(`/api/block?number=${transaction?.blockNumber}`)
        .then((response) => response.json())
        .then((data: Block[]) => {
          setBlock(data[0])

          setLoading(false)
        })
        .catch((error) => console.error(error))
  }, [hash, transaction?.blockNumber])

  return (
    <Container title={'Transaction Details'}>
      {transaction && block ? (
        <>
          <div className="flex items-center gap-3 w-full mx-10 mb-8">
            {options.map((option) => {
              return (
                <p
                  className="px-2 text-sm relative cursor-pointer transition-all duration-300 font-semibold"
                  onClick={() => setSelectedOption(option)}
                  key={option}
                >
                  {option}
                  {selectedOption === option && (
                    <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-accent"></span>
                  )}
                </p>
              )
            })}
          </div>
          {selectedOption === 'Overview' ? (
            <TxHash transaction={transaction} block={block} />
          ) : (
            <Wrapper>
              <textarea
                className={`w-full resize-none bg-background rounded-md transition-all duration-300 p-2`}
                value={JSON.stringify(transaction, null, 4)}
                readOnly
                rows={calculateRowsForJSONString(transaction)}
              ></textarea>
            </Wrapper>
          )}
        </>
      ) : !loading ? (
        <Wrapper>
          Sorry, We are unable to locate this transaction hash. 😔
        </Wrapper>
      ) : undefined}
    </Container>
  )
}

export default Transaction
