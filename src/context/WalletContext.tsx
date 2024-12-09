'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import { createConfig, WagmiProvider, useAccount } from 'wagmi';
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

// Define NeoX Testnet
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

const config = createConfig({
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

function WalletState({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<WalletContextType>({
    address: null,
    balance: null,
    signer: null,
    isConnected: false,
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initializeWallet = async () => {
      if ((typeof window !== 'undefined' && window.ethereum) || address) {
        try {
          let provider: ethers.providers.Provider;
          let signer: ethers.Signer | null = null;
          
          if (address && isConnected) {
            provider = new ethers.providers.JsonRpcProvider('https://neoxt4seed1.ngd.network/');
            // Using address directly for read operations
            const balance = await provider.getBalance(address);
            setState({
              address,
              balance: ethers.utils.formatEther(balance),
              signer: null, // For read-only operations
              isConnected: true,
            });
          } else if (window.ethereum) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
            signer = web3Provider.getSigner();
            const connectedAddress = await signer.getAddress();
            const balance = await web3Provider.getBalance(connectedAddress);
            
            setState({
              address: connectedAddress,
              balance: ethers.utils.formatEther(balance),
              signer,
              isConnected: true,
            });
          }
        } catch (error) {
          console.error('Error initializing wallet:', error);
          setState({
            address: null,
            balance: null,
            signer: null,
            isConnected: false,
          });
        }
      }
    };

    initializeWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', initializeWallet);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', initializeWallet);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, [mounted, address, isConnected]);

  if (!mounted) return null;

  return (
    <WalletContext.Provider value={state}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#22c55e',
            accentColorForeground: 'white',
          })}
        >
          <WalletState>{children}</WalletState>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWallet() {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export { useAccount } from 'wagmi';