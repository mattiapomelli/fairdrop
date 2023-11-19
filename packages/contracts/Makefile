#!make
include .env

# -------------- DEPLOYMENT -------------- #

deploy: 
	npx hardhat deploy --network $(NETWORK)

deploy-localhost: 
	npx hardhat deploy --network localhost --save

deploy-mumbai:
	npx hardhat deploy --network mumbai --verify

deploy-gnosis:
	npx hardhat deploy --network mumbai --verify

deploy-chiado:
	npx hardhat deploy --network chiado --verify

deploy-scroll: 
	npx hardhat deploy --network scrollSepolia --verify

deploy-mantle: 
	npx hardhat deploy --network scrollSepolia --verify

deploy-polygon-zk-evm: 
	npx hardhat deploy --network polygonZkEVMTestnet --verify

deploy-base: 
	npx hardhat deploy --network baseGoerli --verify

deploy-linea: 
	npx hardhat deploy --network lineaTestnet --verify

deploy-devnet: 
	npx hardhat deploy --network devnet

deploy-goerli: 
	npx hardhat deploy --network goerli

deploy-optimism: 
	npx hardhat deploy --network optimismGoerli

deploy-worldcoin: 
	npx hardhat deploy-worldcoin --network optimismGoerli

# -------------- VERIFICATION -------------- #

verify-scroll: 
	npx hardhat deploy --network scrollSepolia --verify

verify-goerli: 
	npx hardhat verify --network goerli 0x5c97716b79d6146de6b2d1ffb238fae003d1244e "0x11cA3127182f7583EfC416a8771BD4d11Fae4334" "app_staging_0caea5b44fb78ba852926ffb770d4ef1" "claim-airdrop"

verify-optimism: 
	npx hardhat verify --network optimismGoerli 0x330e249d7ee36652932ef9667483e9415d82ca9c "0x515f06B36E6D3b707eAecBdeD18d8B384944c87f" "app_staging_0caea5b44fb78ba852926ffb770d4ef1" "claim-airdrop"

#-------------- PLAYGROUND ----------------#

create-deposit:
	npx hardhat run scripts/playground/0-create-deposit.ts --network $(NETWORK)

claim-deposit:
	npx hardhat run scripts/playground/1-claim-deposit.ts --network $(NETWORK)

withdraw-deposit:
	npx hardhat run scripts/playground/2-withdraw-deposit.ts --network $(NETWORK)

supply-sparklend:
	npx hardhat run scripts/playground/supply-sparklend.ts --network $(NETWORK)

get-sparklend-balance:
	npx hardhat run scripts/playground/get-sparklend-balance.ts --network goerli

verify-worldcoin:
	npx hardhat run scripts/playground/verify-worldcoin.ts --network $(NETWORK)

#-------------- SETUP ----------------#

setup: deploy create-deposit claim-deposit withdraw-deposit