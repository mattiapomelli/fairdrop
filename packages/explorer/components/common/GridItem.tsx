import Image from 'next/image'
import { FC, ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  className?: string
}

const GridItem: FC<Props> = ({ title, children, className }) => {
  return (
    <>
      <div className={`flex items-center gap-1 ${className ? className : ''}`}>
        <Image
          src={'/icons/tooltip.svg'}
          alt={'tooltip-icon'}
          height={16}
          width={16}
        />
        <p className="opacity-75">{title}</p>
      </div>

      {children}
    </>
  )
}

export default GridItem
