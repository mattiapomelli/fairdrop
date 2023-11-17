import Image from 'next/image'
import { FC } from 'react'

interface Props {
  title: string
  icon?: string
  color?: string
}

const Badge: FC<Props> = ({ title, icon, color = 'lightgreen' }) => {
  return (
    <div className={`flex items-center justify-center gap-2 px-2 w-max bg-lightgreen bg-opacity-[0.16] rounded-md`}>
      {icon && (
        <Image
          src={`/icons/${icon}.svg`}
          alt={`${icon}-icon`}
          height={16}
          width={16}
        />
      )}
        <p className={`text-lightgreen`}>{title}</p>
    </div>
  )
}

export default Badge
