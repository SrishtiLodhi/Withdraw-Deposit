const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying and interacting with contracts using account:", deployer.address);

  // // Deploy ETH token
  // const ETH = await ethers.getContractFactory("ETH");
  // const eth = await ETH.deploy();
  // await eth.waitForDeployment();
  // console.log("ETH token deployed to:", eth.target);

  // // Deploy USDC token
  // const USDC = await ethers.getContractFactory("USDC");
  // const usdc = await USDC.deploy();
  // await usdc.waitForDeployment();
  // console.log("USDC token deployed to:", usdc.target);

  // // Deploy DepositWithdraw contract
  // const DepositWithdraw = await ethers.getContractFactory("DepositWithdraw");
  // const depositWithdraw = await DepositWithdraw.deploy(deployer.address, usdc.target, eth.target);
  // await depositWithdraw.waitForDeployment();
  // console.log("DepositWithdraw contract deployed to:", depositWithdraw.target);

  const eth = "0x0e8A205C2fE2b0BEBE70c99fDfe3ccaD6d7656B4"
  const usdcAddress = "0xBb763094231263c175A46dc457060dc69EF4B7f8"
  const despositWithdrawAddress = "0x20506f52Ef1f8FD25ac8C56081dFa4D4aC4Caa2A"

    // Get the ERC20 token contract instance
    const USDC = await ethers.getContractFactory("USDC"); 
    const usdc = USDC.attach(usdcAddress);

  // Mint initial tokens
  const initialMint = ethers.parseEther("1000");
  await usdc.mint(deployer.address, initialMint);
  console.log(`Minted ${ethers.formatEther(initialMint)} USDC tokens to deployer`);

  // // Allocate ETH tokens to DepositWithdraw contract
  // await eth.mint(depositWithdraw.target, initialMint);
  // console.log(`Allocated ${ethers.formatEther(initialMint)} ETH tokens to DepositWithdraw contract`);

  // Amount to deposit
  const depositAmount = ethers.parseEther("10");

  const depositWITHDRAW = await ethers.getContractFactory("DepositWithdraw"); 
  const depositWithdraw = depositWITHDRAW.attach(despositWithdrawAddress);

  // Approve USDC spend
  await usdc.approve(depositWithdraw, depositAmount);
  console.log(`Approved ${ethers.formatEther(depositAmount)} USDC tokens for DepositWithdraw contract`);

  // Perform deposit
  console.log("Depositing tokens...");
  const deployerBalance = await usdc.balanceOf(deployer.address);
  console.log(`Deployer balance: ${ethers.utils.formatEther(deployerBalance)} USDC`);
  const depositTx = await depositWithdraw.deposit(depositAmount, {from: deployer});
  await depositTx.wait();
  console.log(`Deposited ${ethers.formatEther(depositAmount)} USDC tokens`);

  // Check final balances
  const userUsdcBalance = await usdc.balanceOf(deployer.address);
  const userEthBalance = await eth.balanceOf(deployer.address);
  const contractUsdcBalance = await usdc.balanceOf(depositWithdraw.target);
  const contractEthBalance = await eth.balanceOf(depositWithdraw.target);

  console.log(`Final User USDC balance: ${ethers.formatEther(userUsdcBalance)} USDC`);
  console.log(`Final User ETH balance: ${ethers.formatEther(userEthBalance)} ETH`);
  console.log(`Final Contract USDC balance: ${ethers.formatEther(contractUsdcBalance)} USDC`);
  console.log(`Final Contract ETH balance: ${ethers.formatEther(contractEthBalance)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
// // scripts/mint.js

// const { ethers } = require("hardhat");

// async function main() {
//   // Get the deployer account
//   const [deployer] = await ethers.getSigners();

//   // Addresses
//   const contractAddress = "0x3873AB2fB59E062Ab1B8AB2c0593F79a1954132e";
//   const tokenAddress = "0x61F5Bf56C96800B04E4D6Fa38B083798979D5E93"; // Replace with your ERC20 token contract address

//   // Get the ERC20 token contract instance
//   const Token = await ethers.getContractFactory("ETH"); // Replace with your token contract name
//   const token = Token.attach(tokenAddress);

//   // Define amount to mint and send
//   const mintAmount = ethers.parseEther("1000");

//   // Approve the contract to spend tokens
//   const approveTx = await token.connect(deployer).approve(contractAddress, mintAmount);
//   await approveTx.wait();
//   console.log(`Approved ${ethers.formatEther(mintAmount)} tokens for contract at ${contractAddress}`);

//   // Check contract balance before depositing ETH
//   const contractTokenBalance = await token.balanceOf(contractAddress);
//   console.log(`Contract token balance before deposit: ${ethers.utils.formatEther(contractTokenBalance)} tokens`);

//   // Define amount of ETH to send
//   const ethAmount = ethers.parseEther("1000"); // Adjust the amount as needed

//   // Create a transaction to send ETH to the contract
//   const tx = {
//     to: contractAddress,
//     value: ethAmount,
//   };

//   // Send the transaction
//   const txResponse = await deployer.sendTransaction(tx);
//   await txResponse.wait(); // Wait for the transaction to be mined
//   console.log(`ETH Transaction successful: ${txResponse.hash}`);

//   // Check contract balance after depositing ETH
//   const contractEthBalance = await ethers.provider.getBalance(contractAddress);
//   console.log(`Contract ETH balance after deposit: ${ethers.utils.formatEther(contractEthBalance)} ETH`);
// }

// // Execute the script
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
