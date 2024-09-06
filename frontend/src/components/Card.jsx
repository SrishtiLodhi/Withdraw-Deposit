import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers'; // Import ethers
import {balance, balanceOfUSER, deposit, withdraw} from "./SmartContract/backend"

const Card = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [ethBalance, setethBalance] = useState(0);
  const [usdcbalance, setusdcbalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [balances, setBalances] = useState({ usdcBalance: 0, ethBalance: 0 });

  // Deposit handler
  const handleDeposit = async () => {
    const res = await deposit(depositAmount); //1

  };

  // Withdraw handler
  const handleWithdraw = async () => {
    const res = await withdraw(withdrawAmount); //0.1
  };

  const fetchContractBalance = async () => {
    let totaltokenBalance = await balance();
    setTotalAmount(totaltokenBalance);
  };

  const fetchUSERBalance = async () => {
    let userBalance = await balanceOfUSER();
    setethBalance(userBalance.ethBalance)
    setusdcbalance(userBalance.usdcBalance)
  };

  useEffect(() => {
    const fetchBalances = async () => {
      const balanceData = await balanceOfUSER();
      if (balanceData) {
        setBalances(balanceData);
      }
    };

    fetchContractBalance();
    fetchBalances();
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#282c34]">
      <div className="w-[400px] bg-[#26292b] text-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Account Info</h2>

        {/* Total Amount Box */}
        <div className="bg-[#9f9fe9] p-2 rounded-lg mb-6 text-center">
          <p className="text-lg">Total Amount: {totalAmount} ETH</p>
        </div>

        {/* Deposit Section */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold">Deposit Amount:</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="p-2 rounded w-full text-white bg-[#26292b] border border-[#9f9fe9] focus:outline-none focus:ring-2 focus:ring-[#9f9fe9]"
            placeholder="Enter deposit amount"
          />
          <button
            onClick={handleDeposit}
            className="mt-3 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Deposit
          </button>
        </div>

        {/* Withdraw Section */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold">Withdraw Amount:</label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="p-2 rounded w-full text-white bg-[#26292b] border border-[#9f9fe9] focus:outline-none focus:ring-2 focus:ring-[#9f9fe9]"
            placeholder="Enter withdrawal amount"
          />
          <button
            onClick={handleWithdraw}
            className="mt-3 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Withdrawal
          </button>

<div className='flex justify-center flex-col align-content-center mt-3'>
          <p>User USDC Balance: {balances.usdcBalance}</p>
          <p>User ETH Balance: {balances.ethBalance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;