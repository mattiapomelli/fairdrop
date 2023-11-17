import { AbiInputs } from '@/types/abi'
import { FC } from 'react'
import Subheading from '../common/Subheading'

interface Props {
  title: string
  inputs: AbiInputs[]
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Inputs: FC<Props> = ({ title, inputs, handleInput }) => {
  return (
    <>
      {inputs.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          <Subheading title={title} />
          <div className="flex flex-col gap-2">
            {inputs.map((input, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className="w-full bg-background p-2 rounded-md"
                    name={index.toString()}
                    type="text"
                    placeholder={`[${index}] ${input.name} (${input.type})`}
                    onChange={handleInput}
                  />
                  {/* {input.type === 'uint256' && (
                    <div className="p-2 bg-background rounded-md cursor-pointer" onClick={() => parseEther(index.toString())}>
                      1e18
                    </div>
                  )} */}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default Inputs
