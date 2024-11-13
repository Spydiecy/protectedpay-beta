'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon, 
  PlusCircleIcon, 
  ArrowPathIcon,
  UserPlusIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useWallet } from '@/context/WalletContext'
import { 
  createGroupPayment,
  contributeToGroupPayment,
  getGroupPaymentDetails,
  getUserProfile
} from '@/utils/contract'
import type { GroupPayment, RawContractPayment } from '@/types/interfaces'
import { LoadingSpinner } from '@/components/Loading'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
}

const formatPayment = (payment: RawContractPayment, id: string): GroupPayment => ({
  id,
  paymentId: id,
  creator: payment.creator,
  recipient: payment.recipient,
  totalAmount: payment.totalAmount,
  amountPerPerson: payment.amountPerPerson,
  numParticipants: Number(payment.numParticipants),
  amountCollected: payment.amountCollected,
  timestamp: Math.floor(Number(payment.timestamp)),
  status: Number(payment.status),
  remarks: payment.remarks
});

export default function GroupPaymentsPage() {
  const { address, signer } = useWallet()
  const [activeTab, setActiveTab] = useState('create')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [participants, setParticipants] = useState('')
  const [remarks, setRemarks] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [myGroupPayments, setMyGroupPayments] = useState<GroupPayment[]>([])
  const [availablePayments, setAvailablePayments] = useState<GroupPayment[]>([])

  const fetchGroupPayments = async () => {
    if (!signer || !address) return
    setIsFetching(true)
    try {
      const profile = await getUserProfile(signer, address)
      
      // Fetch created group payments
      const paymentPromises = profile.groupPaymentIds.map(async (id) => {
        const payment = await getGroupPaymentDetails(signer, id)
        return formatPayment(payment as RawContractPayment, id)
      })
      const payments = await Promise.all(paymentPromises)
      setMyGroupPayments(payments)

      // Fetch participating payments
      const participatingPromises = profile.participatedGroupPayments.map(async (id) => {
        const payment = await getGroupPaymentDetails(signer, id)
        return formatPayment(payment as RawContractPayment, id)
      })
      const participatingPayments = await Promise.all(participatingPromises)
      setAvailablePayments(participatingPayments)
    } catch (err) {
      console.error('Failed to fetch group payments:', err)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (signer && address) {
      fetchGroupPayments()
    }
  }, [signer, address])

  const resetForm = () => {
    setRecipient('')
    setAmount('')
    setParticipants('')
    setRemarks('')
    setError('')
    setSuccess('')
  }

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signer) {
      setError('Please connect your wallet first')
      return
    }

    if (!recipient || !amount || !participants || !remarks) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const numParticipants = parseInt(participants)
      await createGroupPayment(
        signer,
        recipient,
        numParticipants,
        amount,
        remarks
      )
      setSuccess('Group payment created successfully!')
      resetForm()
      fetchGroupPayments()
    } catch (err: any) {
      setError(err.message || 'Failed to create group payment')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContribute = async (paymentId: string, amount: string) => {
    if (!signer) return
    setIsLoading(true)
    try {
      await contributeToGroupPayment(signer, paymentId, amount)
      setSuccess('Contribution successful!')
      fetchGroupPayments()
    } catch (err: any) {
      setError(err.message || 'Failed to contribute to payment')
    } finally {
      setIsLoading(false)
    }
  }

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
          Group Payments
        </motion.h1>

        {/* Tabs */}
        <motion.div className="flex space-x-4 mb-8" variants={fadeIn}>
          <TabButton
            isActive={activeTab === 'create'}
            onClick={() => setActiveTab('create')}
            icon={<PlusCircleIcon className="w-5 h-5" />}
            text="Create Payment"
          />
          <TabButton
            isActive={activeTab === 'available'}
            onClick={() => setActiveTab('available')}
            icon={<UserPlusIcon className="w-5 h-5" />}
            text="Available Payments"
            count={availablePayments.length}
          />
          <TabButton
            isActive={activeTab === 'my-payments'}
            onClick={() => setActiveTab('my-payments')}
            icon={<UsersIcon className="w-5 h-5" />}
            text="My Payments"
            count={myGroupPayments.length}
          />
        </motion.div>

        {/* Create Payment Form */}
        {activeTab === 'create' && (
          <motion.div 
            className="max-w-md mx-auto"
            variants={fadeIn}
          >
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-green-500/20">
              <form onSubmit={handleCreatePayment} className="space-y-6">
                <div>
                  <label className="block mb-2 text-green-400">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-2 rounded bg-black border border-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="0x..."
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-green-400">Total Amount (GAS)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 rounded bg-black border border-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="0.0"
                    step="0.000000000000000001"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-green-400">Number of Participants</label>
                  <input
                    type="number"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    className="w-full p-2 rounded bg-black border border-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="2"
                    min="2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-green-400">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-2 rounded bg-black border border-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="What's this payment for?"
                    rows={3}
                    required
                  />
                </div>

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
                  className="w-full bg-green-500 text-black px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-green-400 transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || !signer}
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircleIcon className="w-5 h-5" />
                      <span>Create Group Payment</span>
                    </>
                  )}
                </motion.button>

                {!signer && (
                  <p className="text-center text-gray-400 text-sm">
                    Connect your wallet to create group payments
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        )}

        {/* Available Payments */}
        {activeTab === 'available' && (
          <motion.div variants={fadeIn}>
            {isFetching ? (
              <LoadingSpinner />
            ) : availablePayments.length === 0 ? (
              <p className="text-center text-gray-400">No available group payments found.</p>
            ) : (
              <div className="grid gap-4">
                {availablePayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onContribute={handleContribute}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* My Payments */}
        {activeTab === 'my-payments' && (
          <motion.div variants={fadeIn}>
            {isFetching ? (
              <LoadingSpinner />
            ) : myGroupPayments.length === 0 ? (
              <p className="text-center text-gray-400">You haven't created any group payments yet.</p>
            ) : (
              <div className="grid gap-4">
                {myGroupPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    isCreator
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, text, count }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
      isActive ? 'bg-green-500 text-black' : 'bg-gray-800 text-white'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    <span>{text}</span>
    {count !== undefined && (
      <span className="bg-black/20 px-2 py-0.5 rounded-full text-sm">
        {count}
      </span>
    )}
  </motion.button>
);

interface PaymentCardProps {
  payment: GroupPayment;
  onContribute?: (id: string, amount: string) => void;
  isCreator?: boolean;
  isLoading: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ 
  payment, 
  onContribute, 
  isCreator = false, 
  isLoading 
}) => {
  const progress = (Number(payment.amountCollected) / Number(payment.totalAmount)) * 100

  const statusLabels = {
    0: 'Pending',
    1: 'Completed',
    2: 'Cancelled'
  }

  const statusColors = {
    0: 'bg-yellow-500/20 text-yellow-500',
    1: 'bg-green-500/20 text-green-500',
    2: 'bg-red-500/20 text-red-500'
  }

  return (
    <motion.div 
      className="bg-gray-900 p-6 rounded-lg border border-green-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-green-400">
            {isCreator ? 'Created Group Payment' : 'Available Payment'}
          </h3>
          <p className="text-gray-400 text-sm">
            For: {payment.recipient}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Progress</p>
          <p className="text-green-400 font-semibold">
            {payment.amountCollected} / {payment.totalAmount} GAS
          </p>
        </div>
      </div>

      <div className="mb-4">
      <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div 
            className="bg-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="flex justify-between mt-1 text-sm text-gray-400">
          <span>{Math.round(progress)}% funded</span>
          <span>{payment.numParticipants} participants</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">{payment.remarks}</p>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {new Date(payment.timestamp * 1000).toLocaleString()}
        </div>
        
        {!isCreator && onContribute && payment.status === 0 && (
          <motion.button
            onClick={() => onContribute(payment.id, payment.amountPerPerson)}
            className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-green-400 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <UserPlusIcon className="w-5 h-5" />
                <span>Contribute {payment.amountPerPerson} GAS</span>
              </>
            )}
          </motion.button>
        )}

        {payment.status !== 0 && (
          <span className={`px-3 py-1 rounded-full text-sm ${
            statusColors[payment.status as keyof typeof statusColors]
          }`}>
            {statusLabels[payment.status as keyof typeof statusLabels]}
          </span>
        )}
      </div>

      {payment.status === 0 && (
        <div className="mt-4 text-xs text-gray-400">
          Each participant contributes {payment.amountPerPerson} GAS
        </div>
      )}
    </motion.div>
  );
};