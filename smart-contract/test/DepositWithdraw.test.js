const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DepositWithdraw", function () {
  let ETH, USDC, DepositWithdraw;
  let eth, usdc, depositWithdraw;
  let owner, user1, user2;
  let initialMint, depositAmount;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy tokens
    ETH = await ethers.getContractFactory("ETH");
    eth = await ETH.deploy();
    await eth.waitForDeployment();

    USDC = await ethers.getContractFactory("USDC");
    usdc = await USDC.deploy();
    await usdc.waitForDeployment();

    // Deploy DepositWithdraw
    DepositWithdraw = await ethers.getContractFactory("DepositWithdraw");
    depositWithdraw = await DepositWithdraw.deploy(owner.address, usdc.target, eth.target);
    await depositWithdraw.waitForDeployment();

    // Setup initial amounts
    initialMint = ethers.parseEther("10000");
    depositAmount = ethers.parseEther("1000");

    // Mint tokens
    await eth.mint(owner.address, initialMint);
    await usdc.mint(owner.address, initialMint);
    await eth.mint(depositWithdraw.target, initialMint);

    // Approve USDC spend for owner
    await usdc.approve(depositWithdraw.target, depositAmount);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await depositWithdraw.admin()).to.equal(owner.address);
    });

    it("Should set the right token addresses", async function () {
      expect(await depositWithdraw.tokenAddress()).to.equal(usdc.target);
      expect(await depositWithdraw.ethToken()).to.equal(eth.target);
    });
  });

  describe("Deposits", function () {
    it("Should transfer USDC from user to contract", async function () {
      await depositWithdraw.deposit(depositAmount);
      expect(await usdc.balanceOf(depositWithdraw.target)).to.equal(depositAmount);
    });

    it("Should transfer ETH from contract to user", async function () {
      const initialBalance = await eth.balanceOf(owner.address);
      await depositWithdraw.deposit(depositAmount);
      const finalBalance = await eth.balanceOf(owner.address);
      expect(finalBalance - initialBalance).to.equal(depositAmount/10n); // Assuming price is 10
    });

    it("Should fail if user has insufficient USDC balance", async function () {
      await expect(depositWithdraw.connect(user1).deposit(depositAmount)).to.be.reverted;
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      await depositWithdraw.deposit(depositAmount);
    });

    it("Should transfer ETH from user to contract", async function () {
      const withdrawAmount = ethers.parseEther("100");
      await eth.approve(depositWithdraw.target, withdrawAmount);
      await depositWithdraw.withdraw(withdrawAmount);
      expect(await eth.balanceOf(depositWithdraw.target)).to.equal((initialMint - (depositAmount/10n))+ (withdrawAmount));
    });

    it("Should transfer USDC from contract to user", async function () {
      const withdrawAmount = ethers.parseEther("100");
      await eth.approve(depositWithdraw.target, withdrawAmount);
      const initialBalance = await usdc.balanceOf(owner.address);
      await depositWithdraw.withdraw(withdrawAmount);
      const finalBalance = await usdc.balanceOf(owner.address);
      expect(finalBalance - initialBalance).to.equal(withdrawAmount * 10n); // Assuming price is 10
    });

    it("Should fail if contract has insufficient USDC balance", async function () {
      const largeWithdrawAmount = ethers.parseEther("2000");
      await eth.approve(depositWithdraw.target, largeWithdrawAmount);
      await expect(depositWithdraw.withdraw(largeWithdrawAmount)).to.be.reverted;
    });
  });

  describe("Admin functions", function () {
    it("Should allow admin to withdraw ETH", async function () {
      const withdrawAmount = ethers.parseEther("100");
      await depositWithdraw.withdrawAdmin(withdrawAmount);
      expect(await eth.balanceOf(owner.address)).to.equal(initialMint + withdrawAmount);
    });

    it("Should not allow non-admin to withdraw ETH", async function () {
      const withdrawAmount = ethers.parseEther("100");
      await expect(depositWithdraw.connect(user1).withdrawAdmin(withdrawAmount)).to.be.reverted;
    });
  });
});