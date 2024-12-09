'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import { createConfig, WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { http } from 'viem';
import { 
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme 
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const neoXTestnet = {
  id: 12227332,
  name: 'NeoX Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'GAS',
    symbol: 'GAS',
  },
  rpcUrls: {
    default: {
      http: ['https://neoxt4seed1.ngd.network/']
    }
  },
  blockExplorers: {
    default: {
      name: 'NeoX Scan',
      url: 'https://xt4scan.ngd.network/'
    }
  },
  testnet: true,
} as const;

const projectId = 'b8ad206ba9492e6096fa0aa0f868586c';

const { wallets } = getDefaultWallets({
  appName: 'ProtectedPay',
  projectId,
});

const connectors = connectorsForWallets([
  ...wallets,
], {
  appName: 'ProtectedPay',
  projectId,
});

const wagmiConfig = createConfig({
  connectors,
  chains: [neoXTestnet],
  transports: {
    [neoXTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

interface WalletContextType {
  address: string | null;
  balance: string | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
}

const WalletContext = React.createContext<WalletContextType>({
  address: null,
  balance: null,
  signer: null,
  isConnected: false,
});

export function useWallet() {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<WalletContextType>({
    address: null,
    balance: null,
    signer: null,
    isConnected: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const initializeWallet = async () => {
      // Check for MetaMask or other injected providers
      const provider = detectProvider();
      if (!provider) return;

      try {
        // Request accounts access
        await provider.request({ method: 'eth_requestAccounts' });
        
        // Initialize ethers provider
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        
        // Get signer and address
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        const balance = ethers.utils.formatEther(await ethersProvider.getBalance(address));

        // Update state
        setState({
          address,
          balance,
          signer,
          isConnected: true,
        });
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
        setState({
          address: null,
          balance: null,
          signer: null,
          isConnected: false,
        });
      }
    };

    // Provider detection helper
    function detectProvider() {
      if (typeof window !== 'undefined') {
        if (window.ethereum) {
          return window.ethereum;
        }
        // Check for MetaMask specifically
        if (window.ethereum?.isMetaMask) {
          return window.ethereum;
        }
        // Fall back to generic provider
        const provider = window.ethereum || (window as any).web3?.currentProvider;
        return provider;
      }
      return null;
    }

    if (mounted) {
      initializeWallet();
    }

    // Set up event listeners
    const provider = detectProvider();
    if (provider) {
      provider.on('accountsChanged', () => {
        initializeWallet();
      });

      provider.on('chainChanged', () => {
        window.location.reload();
      });

      provider.on('connect', () => {
        initializeWallet();
      });

      provider.on('disconnect', () => {
        setState({
          address: null,
          balance: null,
          signer: null,
          isConnected: false,
        });
      });

      return () => {
        provider.removeListener('accountsChanged', initializeWallet);
        provider.removeListener('chainChanged', () => window.location.reload());
        provider.removeListener('connect', initializeWallet);
        provider.removeListener('disconnect', () => setState({
          address: null,
          balance: null,
          signer: null,
          isConnected: false,
        }));
      };
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#22c55e',
            accentColorForeground: 'white',
          })}
        >
          <WalletContext.Provider value={state}>
            {children}
          </WalletContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';