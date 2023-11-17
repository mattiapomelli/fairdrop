import { DecodedInputs } from '@/types/input'

export const prettyPrint = (text: string) => {
  try {
    var obj = JSON.parse(text)
    return JSON.stringify(obj, undefined, 2)
  } catch (error) {
    return text
  }
}

export const prettyDecodedData = (data: DecodedInputs, rawData: string) => {
  let result = ''

  result += `Function: ${data.method}(`
  if (data.inputs && data.inputs.length > 0) {
    data.inputs.forEach((input, index) => {
      result += `${data.types[index]} ${data.names[index]} ${input.toString()}`

      if (index < data.inputs.length - 1) result += ', '
    })
  }
  result += ')'

  if (data.inputs && data.inputs.length > 0) {
    result += `\n\nMethodID: ${rawData.slice(0, 10)}\n`

    result += data.inputs
      .map(
        (input, index) =>
          `[${index}]:  ${input.toString()} ${
            index + 1 >= data.inputs.length ? '' : '\n'
          }`
      )
      .join('')
  }

  return result
}
