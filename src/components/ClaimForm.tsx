import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { claimTransferByAddress, claimTransferByUsername, claimTransferById } from '@/utils/contract';
import { ethers } from 'ethers';

const ClaimForm: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signer } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer) {
      setError('Please connect your wallet first');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (ethers.utils.isAddress(input)) {
        await claimTransferByAddress(signer, input);
      } else if (input.startsWith('0x') && input.length === 66) {
        await claimTransferById(signer, input);
      } else {
        await claimTransferByUsername(signer, input);
      }
      setSuccess('Transfer claimed successfully!');
      setInput('');
    } catch (err) {
      setError('Failed to claim transfer. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="input" className="block mb-2">Sender Address, Username, or Transfer ID</label>
        <input
          type="text"
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button 
        type="submit" 
        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Claim Transfer'}
      </button>
    </form>
  );
};

export default ClaimForm;