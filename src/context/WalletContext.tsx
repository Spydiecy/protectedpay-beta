'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Declare ethereum property on window object
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  address: string | null;
  balance: string | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Check if we're on the correct network (NeoX testnet)
        const network = await provider.getNetwork();
        if (network.chainId !== 12227332) { // NeoX testnet chain ID
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xBA9304' }], // 12227332 in hexadecimal
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xBA9304',
                  chainName: 'NeoX Testnet',
                  nativeCurrency: {
                    name: 'GAS',
                    symbol: 'GAS',
                    decimals: 18
                  },
                  rpcUrls: ['https://neoxt4seed1.ngd.network/'],
                  blockExplorerUrls: ['https://xt4scan.ngd.network/']
                }],
              });
            } else {
              throw switchError;
            }
          }
        }
        
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = ethers.utils.formatEther(await provider.getBalance(address));
        
        setAddress(address);
        setBalance(balance);
        setSigner(signer);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
    setSigner(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        disconnectWallet();
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', disconnectWallet);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ address, balance, signer, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};