import { Abi } from '@/types/abi'
import { Listbox, Transition } from '@headlessui/react'
import Image from 'next/image'
import { FC, Fragment } from 'react'
import Badge from '../common/Badge'

interface Props {
  selected: Abi
  parsedAbi: Abi[]
  setSelected: (abi: Abi) => void
}

const Dropdown: FC<Props> = ({ selected, parsedAbi, setSelected }) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-background p-2 text-left focus:outline-none">
          <span>{selected.name}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Image
              className="cursor-pointer"
              src={'/icons/up-down.svg'}
              alt={'up-down-icon'}
              height={20}
              width={20}
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-outline border">
            {parsedAbi.map((abi, abiIndex) => (
              <Listbox.Option
                key={abiIndex}
                className={`relative cursor-pointer select-none py-2 pl-10 pr-4 bg-background hover:bg-[#2c303a]`}
                value={abi}
              >
                {({ selected }) => (
                  <>
                    <div
                      className={`flex items-center justify-between ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      <p>{abi.name}</p>
                      <Badge title={abi.stateMutability} />
                    </div>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Image
                          src={'/icons/success.svg'}
                          alt={'success-icon'}
                          height={16}
                          width={16}
                        />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default Dropdown
