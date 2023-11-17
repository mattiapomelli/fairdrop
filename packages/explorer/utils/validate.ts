export const validateInput = (input: string, type?: string) => {
  if (!type) return false

  if (type === 'address') {
    return /^(0x)?[0-9a-f]{40}$/i.test(input)
  // } else if (type.startsWith('uint') || type.startsWith('int')) {
  //   return /^\d+$/i.test(input)
  } else if (type === 'string' || type === 'tuple') {
    return true
  } else {
    return true
  }
}

export const validateAbi = (rawAbi: any) => {
  let abi: JSON

  try {
    abi = JSON.parse(rawAbi)
  } catch (error) {
    return false
  }

  return Array.isArray(abi) && abi.length > 0 && abi.every((x) => x.type)
}