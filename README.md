# 🖼️ Frame-ETH

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, tRPC, Prisma, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

## Getting Started

To get started with `frame-eth`, follow the steps below:

1. Clone this repo & install dependencies:

```bash
git clone https://github.com/frame-eth/frame-eth.git my-app
cd my-app
yarn install
```

2. Run a local network in the first terminal:

```bash
yarn run node
```

3. On a second terminal, deploy the contracts:

```bash
yarn deploy --network localhost
```

4. On a third terminal, start your app:

```bash
yarn dev
```

## Usage

It's by design to be able to run all commands for either packages within the root directory. You can run any command as you would regularly within the packages... eg. `yarn deploy` will run the equivalent of `cd packages/contracts && npx hardhat`.

You have two options to run a script thats not declared in the `packages.json`. Firstly, you could use the generics `web` and `contracts` with `yarn web remove ...`. The second option is to create a script in the packages' corresponding `packages.json` and adding it to the root `packages.json`.
