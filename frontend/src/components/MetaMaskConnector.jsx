import React, { useState, useEffect } from 'react';
import { useSDK } from '@metamask/sdk-react';

const MetaMaskConnector = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const { sdk } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setConnected(true);
      }
    } catch (err) {
      console.warn('Failed to connect:', err);
    }
  };

  const disconnect = async () => {
    try {
      await sdk?.disconnect();
      setAddress('');
      setConnected(false);
    } catch (err) {
      console.warn('Failed to disconnect:', err);
    }
  };

  useEffect(() => {
    // Check if already connected on component mount
    const checkConnection = async () => {
      try {
        const accounts = await sdk?.getAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
        }
      } catch (err) {
        console.warn('Failed to check connection:', err);
      }
    };

    checkConnection();
  }, [sdk]);

  return (
    <div>
      {connected ? (
        <div>
          <button 
            onClick={disconnect} 
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            {`${address.slice(0, 4)}...${address.slice(-4)}`}
          </button>
        </div>
      ) : (
        <button 
          onClick={connect} 
          className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default MetaMaskConnector;
