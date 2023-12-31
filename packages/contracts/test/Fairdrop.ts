import { viem } from "hardhat";
import {
  WalletClient,
  keccak256,
  toHex,
  hexToBigInt,
  createTestClient,
  http,
  zeroAddress,
  decodeAbiParameters,
  fromHex,
} from "viem";
import { expect } from "chai";
import { hardhat } from "viem/chains";
import { getWorldCoinClaimParams } from "../utils/common";

describe("Fairdrop", () => {
  let deployer: WalletClient,
    alice: WalletClient,
    bob: WalletClient,
    carol: WalletClient,
    fairdropAddress: `0x${string}`,
    testErc20Address: `0x${string}`,
    demoFiPoolAddress: `0x${string}`,
    demoFiStrategyAddress: `0x${string}`,
    depositAmount = BigInt(100),
    withdrawableAt: bigint,
    passwords: string[],
    depositIds: bigint[];

  const depositsNumber = 2;
  const totalDepositAmount = depositAmount * BigInt(depositsNumber);

  const testClient = createTestClient({
    chain: hardhat,
    mode: "hardhat",
    transport: http(),
  });

  before(async () => {
    [deployer, alice, bob, carol] = await viem.getWalletClients();

    // Deploy Fairdrop
    const fairdrop = await viem.deployContract("Fairdrop", [
      zeroAddress,
      "",
      "",
    ]);
    fairdropAddress = fairdrop.address;

    // Deploy TestERC20
    const testErc20 = await viem.deployContract(
      "contracts/test/TestERC20.sol:TestERC20",
      [[alice.account?.address as `0x${string}`]]
    );
    testErc20Address = testErc20.address;

    // Deploy DemoFi
    const demoFi = await viem.deployContract(
      "contracts/test/DemoFiPool.sol:DemoFiPool",
      []
    );
    demoFiPoolAddress = demoFi.address;

    // Deploy DemoFiStrategy
    const demoFiStrategy = await viem.deployContract(
      "contracts/strategies/DemoFiStrategy.sol:DemoFiStrategy",
      [fairdrop.address, demoFiPoolAddress]
    );
    demoFiStrategyAddress = demoFiStrategy.address;
  });

  describe("Create deposit", async () => {
    let hashedPasswords: `0x${string}`[];
    let aliceBalanceBefore: bigint;

    before(async () => {
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
      const testErc20 = await viem.getContractAt(
        "contracts/test/TestERC20.sol:TestERC20",
        testErc20Address
      );
      // Generate a password for each deposit
      passwords = Array.from(
        { length: depositsNumber },
        (_, i) => `password${i}`
      );
      hashedPasswords = passwords.map((password) =>
        keccak256(toHex(password, { size: 32 }))
      );

      // Get current block timestamp
      const publicClient = await viem.getPublicClient();
      const block = await publicClient.getBlock();
      withdrawableAt = BigInt(block.timestamp) + BigInt(100);

      // Approve tokens
      await testErc20.write.approve([fairdropAddress, totalDepositAmount], {
        account: alice.account,
      });

      // Check allowance
      const allowance = await testErc20.read.allowance([
        alice.account?.address as `0x${string}`,
        fairdropAddress,
      ]);

      expect(allowance).to.equal(totalDepositAmount);

      // Check alice balance
      aliceBalanceBefore = await testErc20.read.balanceOf([
        alice.account?.address as `0x${string}`,
      ]);

      const txHash = await fairdrop.write.createDeposits(
        [
          hashedPasswords,
          withdrawableAt,
          testErc20.address,
          depositAmount,
          demoFiStrategyAddress,
          false,
          false,
        ],
        {
          account: alice.account,
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      // Get deposit ids from logs (Skip first event since is Transfer)
      depositIds = receipt.logs.slice(1).map((log) => {
        const depositId = log.topics[1] as `0x${string}`;
        return fromHex(depositId, {
          to: "bigint",
        });
      });
    });

    it("should create a deposit", async () => {
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);

      depositIds.forEach(async (depositId, index) => {
        const deposit = await fairdrop.read.deposits([depositId]);

        // Check depositor matches
        expect(deposit[0].toLowerCase()).to.equal(
          alice.account?.address.toLowerCase()
        );
        // Check hashed password matches
        expect(deposit[1]).to.equal(hashedPasswords[index]);
        // Check amount matches
        expect(deposit[2]).to.equal(depositAmount);
        // Check token address
        expect(deposit[3].toLowerCase()).to.equal(
          testErc20Address.toLowerCase()
        );
        // Check strategy matches
        expect(deposit[4].toLowerCase()).to.equal(
          demoFiStrategyAddress.toLowerCase()
        );
        // Check withdrawableAt matches
        expect(deposit[5]).to.equal(withdrawableAt);
        // Check claimed matches
        expect(deposit[6]).to.equal(false);
        // Check checkEligibility matches
        expect(deposit[7]).to.equal(false);
        // Check worldIdVerification matches
        expect(deposit[8]).to.equal(false);
        // Check batchId matches
        expect(deposit[9]).to.equal(1);
      });
    });

    it("should transfer the deposit amount to the contract", async () => {
      const testErc20 = await viem.getContractAt(
        "contracts/test/TestERC20.sol:TestERC20",
        testErc20Address
      );

      const balance = await testErc20.read.balanceOf([fairdropAddress]);
      expect(balance).to.equal(totalDepositAmount);

      // const aliceBalance = await testErc20.read.balanceOf([
      //   alice.account?.address as `0x${string}`,
      // ]);
      // const expectedAliceBalance = aliceBalanceBefore - totalDepositAmount;
      // expect(aliceBalance).to.equal(expectedAliceBalance);
    });
  });

  describe("Claim deposit", async () => {
    it("fails if deposit doesn't exist", async () => {
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
      const password = toHex(passwords[0], {
        size: 32,
      });
      const unexistingDepositId = BigInt(10);

      const tx = fairdrop.write.claimDeposit(
        [unexistingDepositId, password, ...getWorldCoinClaimParams()],
        {
          account: bob.account,
        }
      );
      await expect(tx).to.be.rejectedWith("Deposit doesn't exist");
    });

    it("fails if password is incorrect", async () => {
      const depositId = depositIds[0];
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
      const password = toHex("wrongpassword", {
        size: 32,
      });

      const tx = fairdrop.write.claimDeposit(
        [depositId, password, ...getWorldCoinClaimParams()],
        {
          account: bob.account,
        }
      );
      await expect(tx).to.be.rejectedWith("Invalid password");
    });

    describe("Successful claim", async () => {
      before(async () => {
        const depositId = depositIds[0];
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
        const password = toHex(passwords[0], {
          size: 32,
        });
        await fairdrop.write.claimDeposit(
          [depositId, password, ...getWorldCoinClaimParams()],
          {
            account: bob.account,
          }
        );
      });

      it("Should deposit the tokens into the protocol of the strategy", async () => {
        const demoFiPool = await viem.getContractAt(
          "contracts/test/DemoFiPool.sol:DemoFiPool",
          demoFiPoolAddress
        );
        const testErc20 = await viem.getContractAt(
          "contracts/test/TestERC20.sol:TestERC20",
          testErc20Address
        );

        // Check tokens were transferred to DemoFi
        const demoFiBalance = await testErc20.read.balanceOf([
          demoFiPool.address,
        ]);
        expect(demoFiBalance).to.equal(depositAmount);
      });

      it("Should mark the deposit as claimed", async () => {
        const depositId = depositIds[0];
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
        const deposit = await fairdrop.read.deposits([depositId]);

        expect(deposit[6]).to.equal(true);
      });

      it("Should send the yield token to the fairdrop contract", async () => {
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
        const demoFiPool = await viem.getContractAt(
          "contracts/test/DemoFiPool.sol:DemoFiPool",
          demoFiPoolAddress
        );

        const reserveData = await demoFiPool.read.getReserveData([
          testErc20Address,
        ]);
        const yieldToken = await viem.getContractAt(
          "ERC20",
          reserveData.aTokenAddress
        );

        // Get yield token balance of fairdrop contract
        const fairdropYieldTokenBalance = await yieldToken.read.balanceOf([
          fairdrop.address,
        ]);

        expect(fairdropYieldTokenBalance).to.equal(depositAmount);
      });

      it("Should mint an NFT to the claimer", async () => {
        const depositId = depositIds[0];
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);

        const depositOwner = await fairdrop.read.ownerOf([depositId]);
        expect(depositOwner.toLowerCase()).to.equal(
          bob.account?.address.toLowerCase()
        );
      });

      it("Deposit can't be claimed again", async () => {
        const depositId = depositIds[0];
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);

        const password = toHex("password", {
          size: 32,
        });
        const tx = fairdrop.write.claimDeposit(
          [depositId, password, ...getWorldCoinClaimParams()],
          {
            account: bob.account,
          }
        );
        await expect(tx).to.be.rejectedWith("Deposit already claimed");
      });
    });
  });

  describe("Withdraw deposit", async () => {
    const withdrawAmount = BigInt(40);

    it("fails if deposit doesn't exist", async () => {
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
      const depositId = BigInt(10);

      const tx = fairdrop.write.withdrawDeposit([depositId, withdrawAmount], {
        account: bob.account,
      });
      await expect(tx).to.be.rejectedWith("Deposit doesn't exist");
    });

    it("fails if deposit is not withdrawable yet", async () => {
      const depositId = depositIds[0];
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);

      const tx = fairdrop.write.withdrawDeposit([depositId, withdrawAmount], {
        account: bob.account,
      });
      await expect(tx).to.be.rejectedWith("Deposit not yet withdrawable");
    });

    it("fails if sender is not owner of the deposit NFT", async () => {
      const depositId = depositIds[0];
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);

      const tx = fairdrop.write.withdrawDeposit([depositId, withdrawAmount], {
        account: carol.account,
      });
      await expect(tx).to.be.rejectedWith("Not owner of deposit");
    });

    describe("Successful withdraw", async () => {
      before(async () => {
        const depositId = depositIds[0];
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);

        // Go ahead in time to the time the deposit is withdrawable
        await testClient.setNextBlockTimestamp({
          timestamp: withdrawableAt,
        });

        await fairdrop.write.withdrawDeposit([depositId, withdrawAmount], {
          account: bob.account,
        });
      });

      it("Should update deposit amount", async () => {
        const depositId = depositIds[0];
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
        const deposit = await fairdrop.read.deposits([depositId]);

        expect(deposit[2]).to.equal(depositAmount - withdrawAmount);
      });

      it("Should send the tokens to the withdrawer", async () => {
        const testErc20 = await viem.getContractAt(
          "contracts/test/TestERC20.sol:TestERC20",
          testErc20Address
        );

        const bobBalance = await testErc20.read.balanceOf([
          bob.account?.address as `0x${string}`,
        ]);
        expect(bobBalance).to.equal(withdrawAmount);
      });

      it("Should burn the yield token from faidrop contract and strategy contract", async () => {
        const demoFiPool = await viem.getContractAt(
          "contracts/test/DemoFiPool.sol:DemoFiPool",
          demoFiPoolAddress
        );

        const reserveData = await demoFiPool.read.getReserveData([
          testErc20Address,
        ]);
        const yieldToken = await viem.getContractAt(
          "ERC20",
          reserveData.aTokenAddress
        );

        // Get yield token balance of fairdrop contract
        const fairdropYieldTokenBalance = await yieldToken.read.balanceOf([
          fairdropAddress,
        ]);

        expect(fairdropYieldTokenBalance).to.equal(
          depositAmount - withdrawAmount
        );

        // Get yield token balance of strategy contract
        const fairdropStrategyYieldTokenBalance =
          await yieldToken.read.balanceOf([demoFiStrategyAddress]);

        expect(fairdropStrategyYieldTokenBalance).to.equal(BigInt(0));
      });

      it("Should fail if trying to withdraw more than available", async () => {
        const depositId = depositIds[0];
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);

        const tx = fairdrop.write.withdrawDeposit(
          [depositId, depositAmount - withdrawAmount + BigInt(10)],
          {
            account: bob.account,
          }
        );

        await expect(tx).to.be.rejectedWith("Not enough funds");
      });

      it("Should claim rest of deposit", async () => {
        const depositId = depositIds[0];
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
        const demoFiPool = await viem.getContractAt(
          "contracts/test/DemoFiPool.sol:DemoFiPool",
          demoFiPoolAddress
        );

        await fairdrop.write.withdrawDeposit(
          [depositId, depositAmount - withdrawAmount],
          {
            account: bob.account,
          }
        );

        const reserveData = await demoFiPool.read.getReserveData([
          testErc20Address,
        ]);
        const yieldToken = await viem.getContractAt(
          "ERC20",
          reserveData.aTokenAddress
        );

        // Get yield token balance of fairdrop contract
        const fairdropYieldTokenBalance = await yieldToken.read.balanceOf([
          fairdropAddress,
        ]);

        expect(fairdropYieldTokenBalance).to.equal(BigInt(0));
      });
    });
  });
});
