import { ethers } from 'ethers';

export function getProvider() {
  if (typeof window !== 'undefined') {
    if (window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
    // Fallback RPC provider for NeoX testnet
    return new ethers.providers.JsonRpcProvider('https://neoxt4seed1.ngd.network/');
  }
  return null;
}

export async function getSigner() {
  const provider = getProvider();
  if (!provider) return null;
  
  try {
    const signer = provider.getSigner();
    await signer.getAddress(); // Verify signer is working
    return signer;
  } catch (error) {
    console.error('Error getting signer:', error);
    return null;
  }
}