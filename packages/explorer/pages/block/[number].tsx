import Container from '@/components/common/Container'
import Wrapper from '@/components/common/Wrapper'
import { Block } from '@/types'
import { calculateRowsForJSONString } from '@/utils/calculate'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

const Block: FC = () => {
  const router = useRouter()
  const { number } = router.query

  const [block, setBlock] = useState<Block | undefined>()

  useEffect(() => {
    if (!number) return
    fetch(`/api/block?number=${number}`)
      .then((response) => response.json())
      .then((data: Block) => {
        setBlock(data)
      })
      .catch((error) => console.error(error))
  }, [number])

  return (
    <Container title={'Block Details'}>
      {block && (
        <Wrapper>
          <textarea
            className={`w-full resize-none bg-background rounded-md transition-all duration-300 p-2`}
            value={JSON.stringify(block, null, 4)}
            readOnly
            rows={calculateRowsForJSONString(block)}
          ></textarea>
        </Wrapper>
      )}
    </Container>
  )
}

export default Block
