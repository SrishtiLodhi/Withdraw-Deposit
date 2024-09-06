require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: "https://polygon-amoy.infura.io/v3/82ee588404864a7499ce6ac8c3a88cdf", 
      accounts: ["2fb57e1a3521ac42751e18657cfd2f46237faf4e25bdf2f96ee92ee3776a816a"],
      gasPrice: 25000000000, // Adjust as necessary
      gas: 8000000
    }
  }
};
