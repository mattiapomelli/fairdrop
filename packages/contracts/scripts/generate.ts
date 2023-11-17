import { task } from 'hardhat/config'
import {
  english,
  generateMnemonic,
  mnemonicToAccount,
  privateKeyToAccount,
} from 'viem/accounts'

type address = `0x${string}`

task(
  'generate',
  "🌱 Generate a seed phrase with it's corresponding private and public keys."
)
  .addOptionalParam(
    'prefix',
    'Prefix the private key with a specific pattern... i.e. 0x1234'
  )
  .setAction(async (args) => {
    let privateKey: address, account: address, mnemonic: string

    do {
      mnemonic = generateMnemonic(english)
      privateKey = `0x${Buffer.from(
        mnemonicToAccount(mnemonic).getHdKey().privateKey!
      ).toString('hex')}`
      account = privateKeyToAccount(privateKey).address
      if (!args.prefix) break
    } while (
      !args.prefix ||
      !account.toLowerCase().startsWith(args.prefix.toLowerCase())
    )

    console.log(`
✨ Accounts Generated ✨
-------------------------
Mnemonic Phrase: \x1B[32m${mnemonic}\x1B[0m
Private Key: \x1B[32m${privateKey}\x1B[0m
Public Key: \x1B[32m${account}\x1B[0m
`)
  })
