const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ETH token
  const ETH = await ethers.getContractFactory("ETH");
  const eth = await ETH.deploy();
  await eth.waitForDeployment();
  console.log("ETH token deployed to:", eth.target);

  // Deploy USDC token
  const USDC = await ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();
  await usdc.waitForDeployment();
  console.log("USDC token deployed to:", usdc.target);

  // Deploy DepositWithdraw contract
  const DepositWithdraw = await ethers.getContractFactory("DepositWithdraw");
  const depositWithdraw = await DepositWithdraw.deploy(deployer.address, usdc.target, eth.target);
  await depositWithdraw.waitForDeployment();
  console.log("DepositWithdraw contract deployed to:", depositWithdraw.target);

  // Mint initial tokens to DepositWithdraw contract
  const initialMint = ethers.parseEther("1000");
  await eth.mint(depositWithdraw.target, initialMint);
  console.log(`Minted ${ethers.formatEther(initialMint)} ETH tokens to DepositWithdraw contract`);

  // Verify contracts on Etherscan
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contracts on Etherscan...");
    await hre.run("verify:verify", {
      address: eth.target,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: usdc.target,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: depositWithdraw.target,
      constructorArguments: [deployer.address, usdc.target, eth.target],
    });
  }

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });