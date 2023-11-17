import InputDataDecoder from 'ethereum-input-data-decoder'

export const decode = (abi: string, inputData: string) => {
  try {
    return new InputDataDecoder(abi).decodeData(inputData)
  } catch (error: any) {
    return false
  }
}
