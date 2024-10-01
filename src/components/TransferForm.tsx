import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { sendToAddress, sendToUsername } from '@/utils/contract';
import { ethers } from 'ethers';

const TransferForm: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
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
      if (ethers.utils.isAddress(recipient)) {
        await sendToAddress(signer, recipient, amount);
      } else {
        await sendToUsername(signer, recipient, amount);
      }
      setSuccess('Transfer initiated successfully!');
      setRecipient('');
      setAmount('');
    } catch (err) {
      setError('Failed to initiate transfer. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="recipient" className="block mb-2">Recipient (address or username)</label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className="block mb-2">Amount (GAS)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
          min="0"
          step="0.000000000000000001"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button 
        type="submit" 
        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Transfer'}
      </button>
    </form>
  );
};

export default TransferForm;