import Image from 'next/image'
import { FC } from 'react'

const Nav: FC = () => {
  return (
    <div className="flex flex-row items-center justify-between min-h-[100px] z-10 mx-auto max-w-6xl sm:px-4">
      <div className="flex items-center gap-4">
        <Image
          src={'/logo/logo.svg'}
          alt={'header-logo'}
          height={50}
          width={50}
        />
        <h1 className="font-extrabold text-xl">
          LocalBlock{' '}
          <span className="opacity-60 text-sm font-light italic">Explorer</span>
        </h1>
      </div>
      <div className="flex items-center gap-2 py-2 px-4 border border-solid border-accent h-12 cursor-pointer hover:border-opacity-60 rounded-md transition-all duration-300">
        <Image
          src={'/logo/hardhat.svg'}
          alt={'hardhat-logo'}
          height={24}
          width={24}
        />
        <p className="text-sm font-semibold">Localhost</p>
      </div>
    </div>
  )
}

export default Nav
