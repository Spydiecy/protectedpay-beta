import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { refundTransfer } from '@/utils/contract';

const RefundForm: React.FC = () => {
  const [transferId, setTransferId] = useState('');
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
      await refundTransfer(signer, transferId);
      setSuccess('Transfer refunded successfully!');
      setTransferId('');
    } catch (err) {
      setError('Failed to refund transfer. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="transferId" className="block mb-2">Transfer ID</label>
        <input
          type="text"
          id="transferId"
          value={transferId}
          onChange={(e) => setTransferId(e.target.value)}
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
        {isLoading ? 'Processing...' : 'Refund Transfer'}
      </button>
    </form>
  );
};

export default RefundForm;