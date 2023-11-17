import { InputType } from '@/types/input'
import { parseInputType } from '@/utils/parse'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

const SubNav: FC = () => {
  const navigations = ['Dashboard', 'Blocks', 'Transactions', 'Contracts']
  const router = useRouter()
  const currentPath = router.pathname.split('/')[1]

  const [value, setValue] = useState('')

  const search = () => {
    const type = parseInputType(value)

    if (type !== InputType.Unknown) router.push(`/${type}/${value}`)
    else console.error('Unknown input type')

    setValue('')
  }

  return (
    <div className="bg-secondary sm:px-4">
      <div className="flex items-center justify-between mx-auto max-w-6xl sm:flex-col">
        <div className="flex items-center gap-12 min-h-[79px] sm:justify-center">
          {navigations.map((navigation) => {
            return (
              <Link key={navigation} href={`/${navigation.toLowerCase()}`}>
                <p className="font-bold text-sm relative cursor-pointer">
                  {navigation}
                  {(navigation.toLowerCase().includes(currentPath) ||
                    (currentPath === 'tx' &&
                      navigation === 'Transactions')) && (
                    <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-accent"></span>
                  )}
                </p>
              </Link>
            )
          })}
        </div>
        <div className="flex border border-solid w-[40%] border-outline h-full rounded-md hover:border-opacity-75 transition-all duration-300">
          <input
            className="p-3 bg-background w-full border-none focus:outline-none rounded-l-md text-sm placeholder:opacity-70"
            placeholder="Search for block height, hash, transaction, or address"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') search()
            }}
          />
          <button onClick={search}>
            <Image
              className="w-12 p-4 cursor-pointer bg-[#39434e] rounded-r-md"
              src={'/icons/search.svg'}
              alt={'search-icon'}
              height={24}
              width={24}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubNav
