# FrameETH

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts with balances.

Try running some of the following tasks:

```bash
# check linter issues using solhint plugin
npx hardhat check

# remove all compiled and deployed artifacts
npx hardhat clean

# compile contracts
npx hardhat compile

# opens a hardhat console
npx hardhat console

# check coverage using solidity-coverage plugin: supports hardhat network only
npx hardhat coverage --network hardhat

# deploy contract defined in tasks on specified network
npx hardhat deploy --save --verify --network localhost

# flattens and prints contracts and their dependencies
npx hardhat flatten

# generate a seed phrase with it's corresponding private and public keys.
npx hardhat generate --prefix 0x123

# show help
npx hardhat help

# starts local node
npx hardhat node

# unit tests including gas usage
npx hardhat test

# verify contract
npx hardhat verify --network <deployed network> <deployed contract address> "<constructor1>" "<constructor2>"

```
