import { viem } from "hardhat";
import { WalletClient, keccak256, toHex, hexToBigInt } from "viem";
import { expect } from "chai";

describe("Fairdrop", () => {
  let deployer: WalletClient,
    alice: WalletClient,
    bob: WalletClient,
    fairdropAddress: `0x${string}`,
    testErc20Address: `0x${string}`;

  before(async () => {
    [deployer, alice, bob] = await viem.getWalletClients();

    const fairdrop = await viem.deployContract("Fairdrop", []);
    fairdropAddress = fairdrop.address;

    const testErc20 = await viem.deployContract("TestERC20", [
      [alice.account?.address as `0x${string}`],
    ]);
    testErc20Address = testErc20.address;
  });

  describe("Create deposit", async () => {
    let hashedPassword: `0x${string}`;
    const amount = BigInt(100);
    let withdrawableAt: bigint;

    before(async () => {
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
      const testErc20 = await viem.getContractAt("TestERC20", testErc20Address);
      const password = toHex("password", {
        size: 32,
      });
      hashedPassword = keccak256(password);

      // Get current block timestamp
      const publicClient = await viem.getPublicClient();
      const block = await publicClient.getBlock();
      withdrawableAt = BigInt(block.timestamp) + BigInt(100);

      // Approve tokens
      await testErc20.write.approve([fairdropAddress, amount], {
        account: alice.account,
      });

      // Check allowance
      const allowance = await testErc20.read.allowance([
        alice.account?.address as `0x${string}`,
        fairdropAddress,
      ]);

      expect(allowance).to.equal(amount);

      await fairdrop.write.createDeposit(
        [hashedPassword, withdrawableAt, testErc20.address, amount],
        {
          account: alice.account,
        }
      );
    });

    it("should create a deposit", async () => {
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
      const depositId = hexToBigInt(toHex(0));

      const deposit = await fairdrop.read.deposits([depositId]);

      // Check depositor matches
      expect(deposit[0].toLowerCase()).to.equal(
        alice.account?.address.toLowerCase()
      );
      // Check hashed password matches
      expect(deposit[1].toLowerCase()).to.equal(hashedPassword);
      // Check amount matches
      expect(deposit[2]).to.equal(amount);
      // Check token address
      expect(deposit[3].toLowerCase()).to.equal(testErc20Address.toLowerCase());
      // Check withdrawableAt matches
      expect(deposit[4]).to.equal(withdrawableAt);
    });

    it("should transfer the deposit amount to the contract", async () => {
      const testErc20 = await viem.getContractAt("TestERC20", testErc20Address);

      const depositAmount = await testErc20.read.balanceOf([fairdropAddress]);
      expect(depositAmount).to.equal(amount);
    });
  });

  describe("Claim deposit", async () => {
    const amount = BigInt(100);
    const depositId = BigInt(0);

    it("fails if deposit doesn't exist", async () => {
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
      const password = toHex("password", {
        size: 32,
      });
      const depositId = BigInt(1);

      const tx = fairdrop.write.claimDeposit([depositId, password], {
        account: bob.account,
      });
      await expect(tx).to.be.rejectedWith("Deposit doesn't exist");
    });

    it("fails if password is incorrect", async () => {
      const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
      const password = toHex("wrongpassword", {
        size: 32,
      });

      const tx = fairdrop.write.claimDeposit([depositId, password], {
        account: bob.account,
      });
      await expect(tx).to.be.rejectedWith("Invalid password");
    });

    describe("Successful claim", async () => {
      before(async () => {
        const fairdrop = await viem.getContractAt("Fairdrop", fairdropAddress);
        const password = toHex("password", {
          size: 32,
        });
        await fairdrop.write.claimDeposit([depositId, password], {
          account: bob.account,
        });
      });

      it("should create a deposit", async () => {});
    });
  });
});
