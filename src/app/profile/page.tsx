'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, ClockIcon, CheckCircleIcon, 
  UsersIcon, BanknotesIcon, ArrowPathIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import { useWallet } from '@/context/WalletContext';
import { 
  getUserProfile, registerUsername, getUserByAddress,
  getTransferDetails, getGroupPaymentDetails, getSavingsPotDetails 
} from '@/utils/contract';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
}

interface Transfer {
  sender: string;
  recipient: string;
  amount: string;
  timestamp: number;
  status: number;
  remarks: string;
}

interface GroupPayment {
  creator: string;
  recipient: string;
  totalAmount: string;
  amountPerPerson: string;
  numParticipants: number;
  amountCollected: string;
  timestamp: number;
  status: number;
  remarks: string;
}

interface SavingsPot {
  name: string;
  targetAmount: string;
  currentAmount: string;
  timestamp: number;
  status: number;
  remarks: string;
}

const statusLabels: { [key: number]: string } = {
  0: 'Pending',
  1: 'Claimed/Completed',
  2: 'Refunded',
};

const potStatusLabels: { [key: number]: string } = {
  0: 'Active',
  1: 'Broken',
};

export default function ProfilePage() {
  const { address, balance, signer } = useWallet();
  const [username, setUsername] = useState('');
  const [registeredUsername, setRegisteredUsername] = useState('');
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [groupPayments, setGroupPayments] = useState<GroupPayment[]>([]);
  const [savingsPots, setSavingsPots] = useState<SavingsPot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('transfers');

  const fetchUserData = useCallback(async () => {
    if (!signer || !address) return;
    try {
      const profile = await getUserProfile(signer, address);
      
      // Fetch all transfer details
      const transferPromises = profile.transferIds.map(id => 
        getTransferDetails(signer, id)
      );
      const fetchedTransfers = await Promise.all(transferPromises);
      const formattedTransfers = fetchedTransfers.map(transfer => ({
        ...transfer,
        sender: transfer.sender,
        recipient: transfer.recipient,
        amount: transfer.amount,
        timestamp: Number(transfer.timestamp),  // Ensure timestamp is a number
        status: transfer.status,
        remarks: transfer.remarks
      }));
      setTransfers(formattedTransfers);

      // Fetch all group payment details
      const groupPaymentPromises = profile.groupPaymentIds.map(id => 
        getGroupPaymentDetails(signer, id)
      );
      const fetchedGroupPayments = await Promise.all(groupPaymentPromises);
      const formattedGroupPayments = fetchedGroupPayments.map(payment => ({
        ...payment,
        creator: payment.creator,
        recipient: payment.recipient,
        totalAmount: payment.totalAmount,
        amountPerPerson: payment.amountPerPerson,
        numParticipants: Number(payment.numParticipants),
        amountCollected: payment.amountCollected,
        timestamp: Number(payment.timestamp),  // Ensure timestamp is a number
        status: payment.status,
        remarks: payment.remarks
      }));
      setGroupPayments(formattedGroupPayments);

      // Fetch all savings pot details
      const savingsPotPromises = profile.savingsPotIds.map(id => 
        getSavingsPotDetails(signer, id)
      );
      const fetchedSavingsPots = await Promise.all(savingsPotPromises);
      const formattedSavingsPots = fetchedSavingsPots.map(pot => ({
        ...pot,
        owner: pot.owner,
        name: pot.name,
        targetAmount: pot.targetAmount,
        currentAmount: pot.currentAmount,
        timestamp: Number(pot.timestamp),  // Ensure timestamp is a number
        status: pot.status,
        remarks: pot.remarks
      }));
      setSavingsPots(formattedSavingsPots);

    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  }, [signer, address]);

  const fetchUsername = useCallback(async () => {
    if (!signer || !address) return;
    try {
      const fetchedUsername = await getUserByAddress(signer, address);
      setRegisteredUsername(fetchedUsername);
    } catch (err) {
      console.error('Failed to fetch username:', err);
    }
  }, [signer, address]);

  useEffect(() => {
    if (signer && address) {
      fetchUserData();
      fetchUsername();
    }
  }, [signer, address, fetchUserData, fetchUsername]);

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
      fetchUsername();
    } catch (err: any) {
      setError(err.message || 'Failed to register username. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTransactionTabs = () => (
    <div className="flex space-x-4 mb-6">
      <TabButton 
        active={activeTab === 'transfers'} 
        onClick={() => setActiveTab('transfers')}
        icon={<ArrowUpIcon className="w-5 h-5" />}
        text="Transfers"
        count={transfers.length}
      />
      <TabButton 
        active={activeTab === 'group-payments'} 
        onClick={() => setActiveTab('group-payments')}
        icon={<UsersIcon className="w-5 h-5" />}
        text="Group Payments"
        count={groupPayments.length}
      />
      <TabButton 
        active={activeTab === 'savings-pots'} 
        onClick={() => setActiveTab('savings-pots')}
        icon={<BanknotesIcon className="w-5 h-5" />}
        text="Savings Pots"
        count={savingsPots.length}
      />
    </div>
  );

  const TabButton = ({ active, onClick, icon, text, count }: any) => (
    <motion.button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
        active ? 'bg-green-500 text-black' : 'bg-gray-800 text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span>{text}</span>
      <span className="bg-black/20 px-2 py-0.5 rounded-full text-sm">
        {count}
      </span>
    </motion.button>
  );

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

        {/* User Info Section */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" variants={fadeIn}>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-green-500/20">
            <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2" />
              Account Information
            </h2>
            {registeredUsername && (
              <p className="mb-2">
                <span className="text-green-400">Username:</span> {registeredUsername}
              </p>
            )}
            <p className="mb-2">
              <span className="text-green-400">Address:</span> 
              <span className="ml-2 text-gray-300">{address}</span>
            </p>
            <p>
              <span className="text-green-400">Balance:</span>
              <span className="ml-2 text-gray-300">{balance ? `${balance} GAS` : 'Loading...'}</span>
            </p>
          </div>

          {!registeredUsername ? (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-green-500/20">
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
                />
                {error && (
                  <motion.p 
                    className="text-red-500 bg-red-500/10 p-3 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p 
                    className="text-green-500 bg-green-500/10 p-3 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {success}
                  </motion.p>
                )}
                <motion.button 
                  type="submit" 
                  className="w-full bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Register Username'}
                </motion.button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-green-500/20 flex items-center justify-center">
              <div className="text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-green-400">Username Registered</p>
                <p className="text-gray-400 mt-2">Your username is set to: {registeredUsername}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Activity Tabs */}
        <motion.div variants={fadeIn}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-green-400 flex items-center">
              <ClockIcon className="w-6 h-6 mr-2" />
              Activity History
            </h2>
            <motion.button
              onClick={fetchUserData}
              className="text-green-400 hover:text-green-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowPathIcon className="w-5 h-5" />
            </motion.button>
          </div>

          {renderTransactionTabs()}

          <div className="bg-gray-900 rounded-lg border border-green-500/20">
            {activeTab === 'transfers' && (
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Transfers</h3>
                {transfers.length === 0 ? (
                  <p className="text-gray-400">No transfers found.</p>
                ) : (
                  <div className="space-y-4">
                    {transfers.map((transfer, index) => (
                      <motion.div 
                        key={index} 
                        className="bg-black p-4 rounded-lg border border-green-500/10"
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-400">
                              {transfer.sender === address ? 'Sent to:' : 'Received from:'}
                            </p>
                            <p className="text-green-400">
                              {transfer.sender === address ? transfer.recipient : transfer.sender}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Amount</p>
                            <p className="text-green-400 font-semibold">{transfer.amount} GAS</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{transfer.remarks}</p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className={`px-2 py-1 rounded-full ${
                            statusLabels[transfer.status] === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            statusLabels[transfer.status] === 'Claimed/Completed' ? 'bg-green-500/20 text-green-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {statusLabels[transfer.status]}
                          </span>
                          <span className="text-gray-500">
                            {new Date(transfer.timestamp * 1000).toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'group-payments' && (
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Group Payments</h3>
                {groupPayments.length === 0 ? (
                  <p className="text-gray-400">No group payments found.</p>
                ) : (
                  <div className="space-y-4">
                    {groupPayments.map((payment, index) => (
                      <motion.div 
                        key={index} 
                        className="bg-black p-4 rounded-lg border border-green-500/10"
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-green-400 font-semibold mb-1">
                            {payment.creator === address ? 'Created Group Payment' : 'Participating in Payment'}
                            </p>
                            <p className="text-sm text-gray-400">To: {payment.recipient}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Progress</p>
                            <p className="text-green-400 font-semibold">
                              {payment.amountCollected} / {payment.totalAmount} GAS
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <motion.div 
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${(Number(payment.amountCollected) / Number(payment.totalAmount)) * 100}%` 
                              }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                          <p>Per Person: {payment.amountPerPerson} GAS</p>
                          <p>{payment.numParticipants} participants</p>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{payment.remarks}</p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className={`px-2 py-1 rounded-full ${
                            statusLabels[payment.status] === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            statusLabels[payment.status] === 'Claimed/Completed' ? 'bg-green-500/20 text-green-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {statusLabels[payment.status]}
                          </span>
                          <span className="text-gray-500">
                            {new Date(payment.timestamp * 1000).toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'savings-pots' && (
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Savings Pots</h3>
                {savingsPots.length === 0 ? (
                  <p className="text-gray-400">No savings pots found.</p>
                ) : (
                  <div className="space-y-4">
                    {savingsPots.map((pot, index) => (
                      <motion.div 
                        key={index} 
                        className="bg-black p-4 rounded-lg border border-green-500/10"
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-green-400 font-semibold mb-1">{pot.name}</p>
                            <p className="text-sm text-gray-400">Goal: {pot.targetAmount} GAS</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Saved</p>
                            <p className="text-green-400 font-semibold">
                              {pot.currentAmount} GAS
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <motion.div 
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${(Number(pot.currentAmount) / Number(pot.targetAmount)) * 100}%` 
                              }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{pot.remarks}</p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className={`px-2 py-1 rounded-full ${
                            potStatusLabels[pot.status] === 'Active' ? 'bg-green-500/20 text-green-500' :
                            'bg-gray-500/20 text-gray-500'
                          }`}>
                            {potStatusLabels[pot.status]}
                          </span>
                          <span className="text-gray-500">
                            Created {new Date(pot.timestamp * 1000).toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          variants={fadeIn}
        >
          <div className="bg-gray-900 p-4 rounded-lg border border-green-500/20">
            <p className="text-gray-400">Total Transfers</p>
            <p className="text-2xl font-bold text-green-400">{transfers.length}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-green-500/20">
            <p className="text-gray-400">Group Payments</p>
            <p className="text-2xl font-bold text-green-400">{groupPayments.length}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-green-500/20">
            <p className="text-gray-400">Active Savings Pots</p>
            <p className="text-2xl font-bold text-green-400">
              {savingsPots.filter(pot => potStatusLabels[pot.status] === 'Active').length}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}