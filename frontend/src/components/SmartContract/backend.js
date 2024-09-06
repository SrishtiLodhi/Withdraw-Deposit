import { ethers } from "ethers";
import contractData from "./contractData.json";
import ERC20ABI from "./ERC20Abi.json";

const contractAddress = contractData.DepositWithdraw.address;
const contractAbi = contractData.DepositWithdraw.abi;
const tokenAbi = ERC20ABI;
const eth = "0x3476600258b5F1EF7323F0025cb94042303ceAfD";
const usdcAddress = "0xBb763094231263c175A46dc457060dc69EF4B7f8";

export const checkNetwork = async () => {
  const targetNetworkId = "80002";

  if (window.ethereum) {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    localStorage.setItem("Current-Network-Id", currentChainId);

    if (currentChainId == targetNetworkId) return { success: true };

    // return false is network id is different
    return {
      success: false,
      msg: "Please Open Metamask and Connect The Amoy network",
    };
  }
};

export const requestAccount = async (metaMask) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      let provider = window.ethereum;
      // edge case if MM and CBW are both installed
      if (window.ethereum.providers?.length) {
        window.ethereum.providers.forEach(async (p) => {
          if (metaMask === true) {
            if (p.isMetaMask) provider = p;
          } else {
            if (p.isCoinbaseWallet) {
              provider = p;
            }
          }
        });
      }
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13882" }],
      });
      await provider.request({
        method: "eth_requestAccounts",
        params: [],
      });

      localStorage.setItem("Wallet-Check", true);

      return { success: true };
    } else {
      localStorage.setItem("Wallet-Check", false);

      return {
        success: false,
        msg: "please connect your wallet",
      };
    }
  } catch (error) {
    localStorage.setItem("Wallet-Check", false);

    return {
      success: false,
      msg: error.message,
    };
  }
};

export const switchToAmoy = async (provider, localStorageKeys) => {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13882" }],
    });

    localStorage.setItem(localStorageKeys.walletCheck, true);
  } catch (error) {
    console.error("Failed to switch to Amoy:", error);
  }
};

export const deposit = async (Amount) => {
  try {
    Amount = Amount * 1e18;
    const { success: connectSuccess } = await requestAccount();

    if (connectSuccess) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
      const signer = provider.getSigner();

      // Initialize your contract
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      // Initialize your contract
      const usdcContract = new ethers.Contract(
        usdcAddress,
        tokenAbi,
        signer
      );

      let accountAddress = await signer.getAddress();
      const deployerBalance = await usdcContract.balanceOf(accountAddress);
      const decimal = await usdcContract.decimals();
      console.log(decimal);
      const deployerallowance = await usdcContract.allowance(accountAddress, contractAddress);
      console.log(
        `Deployer balance: deployerBalanc USDC`, deployerBalance
      );
      if (parseInt(deployerallowance) < Amount) {
        // Approve USDC spend
        const aprovTx = await usdcContract.approve(contractAddress, deployerBalance);
        console.log("Approve transaction sent:", aprovTx.hash);

        let recipt = await aprovTx.wait();
      }

      Amount = `0x${Amount.toString(16)}`
      console.log(Amount);

      const Tx = await contract.deposit(Amount);
      await Tx.wait();

      return {
        success: true,
        message: " Created successfully!",
      };
    } else {
      return {
        success: false,
        message: "Please connect your wallet!",
      };
    }
  } catch (error) {
    let reason = "An error occurred. Please try again.";

    if (error.data && error.data.reason) {
      reason = error.data.reason;
    } else if (error.reason) {
      reason = error.reason;
    } else if (error.message && error.message.includes("execution reverted")) {
      reason = "Transaction failed: Execution reverted";
    }

    return {
      success: false,
      message: reason,
    };
  }
};

export const withdraw = async (Amount) => {
  try {
    Amount = Amount * 1e18;
    const { success: connectSuccess } = await requestAccount();

    if (connectSuccess) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Initialize your contract
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      // Initialize your contract
      const ethContract = new ethers.Contract(
        eth,
        tokenAbi,
        signer
      );

      let accountAddress = await signer.getAddress();
      const deployerBalance = await ethContract.balanceOf(accountAddress);
      const deployerallowance = await ethContract.allowance(accountAddress, contractAddress);
      console.log(
        `Deployer balance: deployerBalanc USDC`, deployerBalance
      );
      if (parseInt(deployerallowance) < Amount) {
        // Approve USDC spend
        const aprovTx = await ethContract.approve(contractAddress, deployerBalance);
        console.log("Approve transaction sent:", aprovTx.hash);

        let recipt = await aprovTx.wait();
      }

      Amount = `0x${Amount.toString(16)}`
      console.log(Amount);

      const Tx = await contract.withdraw(Amount);
      await Tx.wait();

      return {
        success: true,
        message: " Created successfully!",
      };
    } else {
      return {
        success: false,
        message: "Please connect your wallet!",
      };
    }
  } catch (error) {
    let reason = "An error occurred. Please try again.";

    if (error.data && error.data.reason) {
      reason = error.data.reason;
    } else if (error.reason) {
      reason = error.reason;
    } else if (error.message && error.message.includes("execution reverted")) {
      reason = "Transaction failed: Execution reverted";
    }

    return {
      success: false,
      message: reason,
    };
  }
};

export const balance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // Initialize your contract
  const EthTokenContract = new ethers.Contract(
    eth,
    tokenAbi,
    signer
  );

  let totalBalanceofContract = await EthTokenContract.balanceOf(contractAddress);
  totalBalanceofContract = totalBalanceofContract / 1e18;
  return totalBalanceofContract;
};

export const balanceOfUSER = async () => {

  const { success: connectSuccess } = await requestAccount();

  if (connectSuccess) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let accountAddress = await signer.getAddress();

    // Initialize your contract
    const EthTokenContract = new ethers.Contract(
      eth,
      tokenAbi,
      signer
    );

    const USDCTokenContract = new ethers.Contract(
      usdcAddress,
      tokenAbi,
      signer
    );

    let balanceOfUSDC = await USDCTokenContract.balanceOf(accountAddress);
    balanceOfUSDC = balanceOfUSDC/1e18
    let balanceOfETH = await EthTokenContract.balanceOf(accountAddress);
    balanceOfETH = balanceOfETH/1e18

    return {
      usdcBalance : balanceOfUSDC,
      ethBalance : balanceOfETH
    };
  }
};