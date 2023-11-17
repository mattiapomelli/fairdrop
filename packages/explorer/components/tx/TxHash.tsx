import { Block, Transaction } from '@/types'
import { DecodedInputs } from '@/types/input'
import { calculateLines, calculateTransactionFee } from '@/utils/calculate'
import { copyToClipboard } from '@/utils/copy'
import { decode } from '@/utils/decode'
import { formatNumber, formatUnixTimestamp } from '@/utils/format'
import { prettyDecodedData } from '@/utils/pretty'
import { ethers } from 'ethers'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import Badge from '../common/Badge'
import Divider from '../common/Divider'
import GridItem from '../common/GridItem'

interface Props {
  transaction: Transaction
  block: Block
}

const TxHash: FC<Props> = ({ transaction, block }) => {
  const router = useRouter()

  const [expand, setExpand] = useState(false)
  const [rows, setRows] = useState(5)
  const [decodedData, setDecodedData] = useState<DecodedInputs>()

  const openAddress = (address: string) => router.push(`/address/${address}`)
  const openBlock = (block: number) => router.push(`/block/${block}`)
  const toggleExpand = () => setExpand(!expand)

  useEffect(() => {
    if (!transaction.to || transaction.data.length <= 2) return

    const sessionAbi = sessionStorage.getItem(transaction.to as string)

    if (sessionAbi) {
      const data = decode(sessionAbi, transaction.data)

      if (data) setDecodedData(data as DecodedInputs)
    }
  }, [transaction])

  useEffect(() => {
    const textarea = document.getElementById('dynamic-textarea')
    const lineHeight = parseInt(getComputedStyle(textarea!).lineHeight)
    const rowsNeeded = Math.ceil(textarea!.scrollHeight / lineHeight)

    setRows(rowsNeeded > 5 ? 5 : rowsNeeded)
  }, [decodedData])

  return (
    <div className="grid grid-cols-[auto,minmax(0px,1fr)] gap-x-8 gap-y-3 mx-10">
      <GridItem title={'Transaction Hash'}>
        <div className="flex items-center gap-2">
          <p>{transaction.hash}</p>
          <Image
            className="cursor-pointer"
            src={'/icons/copy.svg'}
            alt={'copy-icon'}
            height={16}
            width={16}
            onClick={() => copyToClipboard(transaction.hash)}
          />
        </div>
      </GridItem>

      <GridItem title={'Status'}>
        <Badge title={'Success'} icon={'success'} />
      </GridItem>

      <GridItem title={'Block'}>
        <div
          className="text-lightaccent cursor-pointer"
          onClick={() => openBlock(transaction.blockNumber)}
        >
          <div className="flex items-center gap-1">
            <Image
              src={'/icons/block.svg'}
              alt={'block-icon'}
              height={16}
              width={16}
            />
            <p>{transaction.blockNumber}</p>
          </div>
        </div>
      </GridItem>

      <GridItem title={'Timestamp'}>
        <div className="flex items-center gap-1">
          <Image
            src={'/icons/clock.svg'}
            alt={'clock-icon'}
            height={16}
            width={16}
          />
          <p>{formatUnixTimestamp(block.timestamp)}</p>
        </div>
      </GridItem>

      <Divider />
      <GridItem title={'From'}>
        <div
          className="text-lightaccent cursor-pointer"
          onClick={() => openAddress(transaction.from)}
        >
          {transaction.from}
        </div>
      </GridItem>

      <GridItem title={'To'}>
        <div>
          {transaction.to ? (
            <span
              className="flex items-center gap-2 text-lightaccent cursor-pointer"
              onClick={() => openAddress(transaction.to)}
            >
              {transaction.data.length > 2 && (
                <Image
                  src={'/icons/document.svg'}
                  alt={'document-icon'}
                  height={16}
                  width={16}
                />
              )}
              {transaction.to}
            </span>
          ) : (
            <p className="flex items-center gap-2">
              <Image
                src={'/icons/success.svg'}
                alt={'success-icon'}
                height={16}
                width={16}
              />
              <div className="flex items-center gap-1">
                [Contract
                <span
                  className="text-lightaccent cursor-pointer"
                  onClick={() =>
                    openAddress(
                      ethers.getCreateAddress({
                        from: transaction.from,
                        nonce: transaction.nonce,
                      })
                    )
                  }
                >
                  {ethers.getCreateAddress({
                    from: transaction.from,
                    nonce: transaction.nonce,
                  })}
                </span>
                created]
              </div>
            </p>
          )}
        </div>
      </GridItem>

      {decodedData && (
        <GridItem title={'Method'}>
          <Badge title={decodedData.method} />
        </GridItem>
      )}

      <Divider />
      <GridItem title={'Value'}>
        {ethers.formatEther(transaction.value)} ETH
      </GridItem>

      <GridItem title={'Transaction Fee'}>
        {calculateTransactionFee(transaction)} ETH
      </GridItem>

      <GridItem title={'Gas price'}>
        {ethers.formatUnits(transaction.gasPrice, 'gwei')} Gwei
      </GridItem>

      <GridItem title={'Gas usage & limit by txn'}>
        {formatNumber(Number(block.gasUsed))} |{' '}
        {formatNumber(Number(transaction.gasLimit))}
      </GridItem>

      <p
        className={`mt-3 border-b w-fit border-dotted cursor-pointer text-lightaccent col-span-2 transition-all duration-300 ${
          !expand ? '-mb-8' : ''
        }`}
        onClick={toggleExpand}
      >
        {!expand ? 'View' : 'Hide'} details
      </p>

      <GridItem
        className={`transition-all duration-300 overflow-hidden ${
          expand ? 'max-h-[30px]' : 'max-h-0'
        }`}
        title={'Txn Type'}
      >
        <div
          className={`transition-all duration-300 overflow-hidden ${
            expand ? 'max-h-[30px]' : 'max-h-0'
          }`}
        >
          {transaction.type} <span className="opacity-60">(EIP-1559)</span>
        </div>
      </GridItem>

      <GridItem
        className={`transition-all duration-300 overflow-hidden ${
          expand ? 'max-h-[30px]' : 'max-h-0'
        }`}
        title={'Nonce'}
      >
        <div
          className={`transition-all duration-300 overflow-hidden ${
            expand ? 'max-h-[30px]' : 'max-h-0'
          }`}
        >
          {transaction.nonce}
        </div>
      </GridItem>

      <GridItem
        className={`transition-all duration-300 overflow-hidden ${
          expand ? 'max-h-[30px]' : 'max-h-0'
        }`}
        title={'Raw Input'}
      >
        <textarea
          id="dynamic-textarea"
          className={`w-full resize-none bg-background rounded-md transition-all duration-300 focus:outline-none outline-none ${
            expand ? ' p-2' : 'h-0 overflow-hidden'
          }`}
          rows={rows}
          value={transaction.data}
          readOnly
        ></textarea>
      </GridItem>

      {decodedData && (
        <GridItem
          className={`transition-all duration-300 overflow-hidden ${
            expand ? 'max-h-[30px]' : 'max-h-0'
          }`}
          title={'Decoded Data'}
        >
          <textarea
            className={`w-full resize-none bg-background rounded-md transition-all duration-300 focus:outline-none outline-none ${
              expand ? 'p-2' : 'h-0 overflow-hidden'
            }`}
            value={prettyDecodedData(decodedData, transaction.data)}
            rows={calculateLines(
              prettyDecodedData(decodedData, transaction.data)
            )}
            readOnly
          ></textarea>
        </GridItem>
      )}
    </div>
  )
}

export default TxHash
