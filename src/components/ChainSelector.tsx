// components/ChainSelector.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useWallet } from '@/context/WalletContext'

export interface ChainInfo {
    id: number
    hexId: string
    name: string
    icon: string
    symbol: string
    rpcUrl: string
    blockExplorerUrl: string
  }

  export const supportedChains: ChainInfo[] = [
    {
      id: 12227332,
      hexId: '0xBA9304',
      name: 'NeoX Testnet',
      icon: '/chains/neox.png',
      symbol: 'GAS',
      rpcUrl: 'https://neoxt4seed1.ngd.network/',
      blockExplorerUrl: 'https://xt4scan.ngd.network/'
    },
    {
      id: 656476,
      hexId: '0xA045C',
      name: 'EduChain Testnet',
      icon: '/chains/educhain.png',
      symbol: 'EDU',
      rpcUrl: 'https://open-campus-codex-sepolia.drpc.org/',
      blockExplorerUrl: 'https://opencampus-codex.blockscout.com/'
    }
  ] as const;

const ChainSelector = () => {
  const { isConnected } = useWallet()
  const [currentChainId, setCurrentChainId] = React.useState<number | null>(null)
  const [isSwitching, setIsSwitching] = React.useState(false)

  const handleSwitchNetwork = async (chainData: typeof supportedChains[number]) => {
    if (!window.ethereum || !isConnected || isSwitching) return;

    setIsSwitching(true);
    try {
      // First try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainData.hexId }],
      });
    } catch (switchError: unknown) {
      // If the error code is 4902, the chain hasn't been added to MetaMask
      if ((switchError as { code: number }).code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainData.hexId,
                chainName: chainData.name,
                nativeCurrency: {
                  name: chainData.symbol,
                  symbol: chainData.symbol,
                  decimals: 18
                },
                rpcUrls: [chainData.rpcUrl],
                blockExplorerUrls: [chainData.blockExplorerUrl]
              }
            ]
          });
        } catch (addError) {
          console.error('Error adding chain:', addError);
        }
      } else {
        console.error('Error switching chain:', switchError);
      }
    } finally {
      setIsSwitching(false);
    }
  };

  React.useEffect(() => {
    const getChainId = async () => {
      if (window.ethereum && isConnected) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setCurrentChainId(parseInt(chainId, 16));
        } catch (error) {
          console.error('Error getting chain ID:', error);
        }
      }
    };

    getChainId();

    const handleChainChanged = (chainId: string) => {
      setCurrentChainId(parseInt(chainId, 16));
      // Reload the page on chain change as recommended by MetaMask
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [isConnected]);

  const currentChain = supportedChains.find(c => c.id === currentChainId) || supportedChains[0];

  if (!isConnected) return null;

return (
    <div className="relative group mx-2">
        <motion.button
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-black/30 border border-green-500/20 hover:bg-black/40 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="w-6 h-6 relative">
                <Image
                    src={currentChain.icon}
                    alt={currentChain.name}
                    fill
                    className="rounded-full object-contain"
                />
            </div>
            <span className="text-green-400 font-medium hidden sm:inline">{currentChain.name}</span>
            <span className="text-green-400 font-medium sm:hidden">{currentChain.symbol}</span>
        </motion.button>

        <motion.div
            className="absolute top-full right-0 mt-2 w-48 py-2 bg-black/80 backdrop-blur-xl rounded-xl border border-green-500/20 shadow-xl overflow-hidden z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
            initial={false}
        >
            {supportedChains.map((chain) => (
                <motion.button
                    key={chain.id}
                    onClick={() => handleSwitchNetwork(chain)}
                    className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-green-500/10 transition-colors ${
                        chain.id === currentChainId ? 'text-green-400' : 'text-gray-400'
                    } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={{ x: 4 }}
                    disabled={isSwitching}
                >
                    <div className="w-5 h-5 relative flex-shrink-0">
                        <Image
                            src={chain.icon}
                            alt={chain.name}
                            fill
                            className="rounded-full object-contain"
                        />
                    </div>
                    <span className="truncate">{chain.name}</span>
                </motion.button>
            ))}
        </motion.div>
    </div>
)
}

export default ChainSelector