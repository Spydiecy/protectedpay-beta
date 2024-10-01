import React, { useEffect, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { getUserTransfers } from '@/utils/contract';
import { ethers } from 'ethers';

interface Transfer {
  sender: string;
  recipient: string;
  amount: string;
  timestamp: number;
  status: number;
}

const TransactionHistory: React.FC = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { address, signer } = useWallet();

  useEffect(() => {
    const fetchTransfers = async () => {
      if (!address || !signer) return;
      
      try {
        const userTransfers = await getUserTransfers(signer, address);
        setTransfers(userTransfers.map((transfer: any) => ({
          ...transfer,
          amount: ethers.utils.formatEther(transfer.amount)
        })));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch transfer history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransfers();
  }, [address, signer]);

  if (isLoading) return <p>Loading transaction history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transaction History</h2>
      {transfers.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-2">
          {transfers.map((transfer, index) => (
            <li key={index} className="bg-secondary p-4 rounded">
              <p>From: {transfer.sender}</p>
              <p>To: {transfer.recipient}</p>
              <p>Amount: {transfer.amount} GAS</p>
              <p>Date: {new Date(transfer.timestamp * 1000).toLocaleString()}</p>
              <p>Status: {['Pending', 'Claimed', 'Refunded'][transfer.status]}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;