'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon, CurrencyDollarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@/context/WalletContext';
import { getUserTransfers, registerUsername, getUserByAddress } from '@/utils/contract';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

type Transfer = {
  sender: string;
  recipient: string;
  amount: number; // This will be in Wei
  timestamp: number;
  status: number; // This represents the TransferStatus enum
  transferId: string; // Add this field for the transaction ID
};

// Map transaction status numbers to user-friendly strings
const statusLabels: { [key: number]: string } = {
  0: 'Pending',
  1: 'Claimed',
  2: 'Refunded',
};

export default function ProfilePage() {
  const { address, balance, signer } = useWallet();
  const [username, setUsername] = useState('');
  const [registeredUsername, setRegisteredUsername] = useState('');
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (signer && address) {
      fetchTransfers();
      fetchUsername();
    }
  }, [signer, address]);

  const fetchTransfers = async () => {
    if (!signer || !address) return;
    try {
      const userTransfers = await getUserTransfers(signer, address);
      console.log(userTransfers); // Log the fetched transfers to check their structure

      // Convert amounts to Ether and map statuses
      const formattedTransfers = userTransfers.map((transfer: Transfer) => ({
        ...transfer,
        amount: (transfer.amount / 1e18).toFixed(18), // Convert Wei to Ether (GAS)
        status: statusLabels[transfer.status] || 'Unknown', // Map status to string
        transferId: transfer.transferId, // Ensure transaction ID is included
      }));

      setTransfers(formattedTransfers);
    } catch (err) {
      console.error('Failed to fetch transfers:', err);
    }
  };

  const fetchUsername = async () => {
    if (!signer || !address) return;
    try {
      const fetchedUsername = await getUserByAddress(signer, address);
      setRegisteredUsername(fetchedUsername);
    } catch (err) {
      console.error('Failed to fetch username:', err);
    }
  };

  const handleRegisterUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer) {
      setError('Please connect your wallet first');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await registerUsername(signer, username);
      setSuccess('Username registered successfully!');
      setRegisteredUsername(username);
      setUsername('');
      fetchUsername(); // Re-fetch username to update the state
    } catch (err) {
      setError('Failed to register username. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <motion.div 
        className="container mx-auto px-4"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-green-400"
          variants={fadeIn}
        >
          Your Profile
        </motion.h1>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" variants={fadeIn}>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2" />
              Account Information
            </h2>
            {registeredUsername && (
              <p className="mb-2"><span className="text-green-400">Username:</span> {registeredUsername}</p>
            )}
            <p className="mb-2"><span className="text-green-400">Address:</span> {address}</p>
            <p>
              <span className="text-green-400">Balance:</span> {balance ? (balance / 1e18).toFixed(18) : 'Loading...'} GAS
            </p>
          </div>

          {!registeredUsername ? (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
                <UserCircleIcon className="w-6 h-6 mr-2" />
                Register Username
              </h2>
              <form onSubmit={handleRegisterUsername} className="space-y-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full p-2 rounded bg-black border border-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                  disabled={registeredUsername !== ''} // Disable if username is registered
                />
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <motion.button 
                  type="submit" 
                  className="w-full bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading || registeredUsername !== ''} // Disable button if username is registered or loading
                >
                  {isLoading ? 'Processing...' : 'Register Username'}
                </motion.button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-green-400">Username Registered</p>
                <p className="text-gray-400 mt-2">Your username is set to: {registeredUsername}</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={fadeIn}>
          <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
            <ClockIcon className="w-6 h-6 mr-2" />
            Transaction History
          </h2>
          {transfers.length === 0 ? (
            <p className="text-gray-400">No transactions found.</p>
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer, index) => {
                console.log(transfer); // Log each transfer object
                return (
                  <motion.div 
                    key={index} 
                    className="bg-gray-900 p-4 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p><span className="text-green-400">Transaction ID:</span> {transfer.transferId}</p>
                    <p><span className="text-green-400">From:</span> {transfer.sender}</p>
                    <p><span className="text-green-400">To:</span> {transfer.recipient}</p>
                    <p><span className="text-green-400">Amount:</span> {transfer.amount} GAS</p>
                    <p><span className="text-green-400">Status:</span> {transfer.status}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
