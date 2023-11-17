import { Abi } from '@/types/abi'
import { ParamInputs } from '@/types/input'
import { iNotification } from '@/types/notification'
import { ContractTransactionResponse, ethers } from 'ethers'
import { generateError, isError } from './notification'
import { parseArray, parseParams } from './parse'

export const transact = async (
  paramInput: ParamInputs | [],
  selected: Abi,
  address: string,
  abi: string,
  value: string
): Promise<string | iNotification> => {
  const getTransactResult = async (): Promise<
    ContractTransactionResponse | iNotification
  > => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])

      const signer = await provider.getSigner()
      const contractInstance = new ethers.Contract(address, abi, signer)

      if (selected.stateMutability === 'payable')
        return await contractInstance[selected.name](
          ...(parsedParams as string[]),
          { value }
        )
      return await contractInstance[selected.name](
        ...(parsedParams as [])
      )
    } catch (e) {
      if (e instanceof Error) return generateError(e.message.split('(')[0])

      return generateError('Transaction failed with no error message')
    }
  }
  const parsedParams = parseParams(paramInput)
  if (isError(parsedParams)) return parsedParams

  if (
    selected.inputs.length !== Object.keys(paramInput).length ||
    parsedParams.length !== selected.inputs.length
  )
    return generateError(
      "The length of parameters doesn't match the number of parameters required"
    )

  switch (selected.stateMutability) {
    case 'view':
      const result = await getTransactResult()
      if (isError(result)) return result
      if (!Array.isArray(result)) return result.toString()
      return JSON.stringify(parseArray([...result]), null, 2)
    case 'payable':
    case 'nonpayable':
      const tx = await getTransactResult()
      if (isError(tx)) return tx
      await tx.wait()
      return tx.hash
    default:
      return generateError(
        'Invalid state mutability: ' + selected.stateMutability
      )
  }
}
