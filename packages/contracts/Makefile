#!make
include .env

# -------------- DEPLOYMENT -------------- #

deploy: 
	npx hardhat deploy --network localhost

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

# -------------- VERIFICATION -------------- #

verify-scroll: 
	npx hardhat deploy --network scrollSepolia --verify

#-------------- PLAYGROUND ----------------#

create-deposit:
	npx hardhat run scripts/playground/0-create-deposit.ts --network $(NETWORK)

claim-deposit:
	npx hardhat run scripts/playground/1-claim-deposit.ts --network $(NETWORK)

supply-sparklend:
	npx hardhat run scripts/playground/supply-sparklend.ts --network $(NETWORK)

get-sparklend-balance:
	npx hardhat run scripts/playground/get-sparklend-balance.ts --network $(NETWORK)