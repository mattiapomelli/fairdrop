#!make
include .env

# -------------- DEPLOYMENT -------------- #

deploy: 
	npx hardhat deploy --network $(NETWORK)

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

# -------------- VERIFICATION -------------- #

verify-scroll: 
	npx hardhat deploy --network scrollSepolia --verify

#-------------- PLAYGROUND ----------------#

withdraw:
	npx hardhat run scripts/playground/withdraw.ts --network $(NETWORK)

set-data:
	npx hardhat run scripts/playground/set-data.ts --network $(NETWORK)