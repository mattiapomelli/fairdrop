import { generateSuccess, throwNotification } from './notification'

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    throwNotification(generateSuccess('Text copied to clipboard!'))
    console.log('Text copied to clipboard: ' + text)
  } catch (err) {
    console.error('Failed to copy text to clipboard: ' + err)
  }
}
