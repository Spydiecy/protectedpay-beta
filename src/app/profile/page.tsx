'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserCircleIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@/context/WalletContext'
import { getUserTransfers, registerUsername, fetchUsername } from '@/utils/contract'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function ProfilePage() {
  const { address, balance, signer } = useWallet()
  const [username, setUsername] = useState('')
  const [transfers, setTransfers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [registeredUsername, setRegisteredUsername] = useState('')

  useEffect(() => {
    if (signer && address) {
      fetchProfileData()
    }
  }, [signer, address])

  const fetchProfileData = async () => {
    try {
      const userTransfers = await getUserTransfers(signer, address)
      setTransfers(userTransfers)

      const fetchedUsername = await fetchUsername(signer, address)
      setRegisteredUsername(fetchedUsername || 'none')
    } catch (err) {
      console.error('Failed to fetch profile data:', err)
    }
  }

  const handleRegisterUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signer) {
      setError('Please connect your wallet first')
      return
    }
    if (registeredUsername !== 'none') {
      setError('Username already registered.')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await registerUsername(signer, username)
      setSuccess('Username registered successfully!')
      setUsername('')
      fetchProfileData()  // Refresh profile data after successful registration
    } catch (err) {
      setError('Failed to register username. Please try again.')
      console.error(err)
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
          Your Profile
        </motion.h1>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" variants={fadeIn}>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2" />
              Account Information
            </h2>
            <p className="mb-2"><span className="text-green-400">Address:</span> {address}</p>
            <p className="mb-2"><span className="text-green-400">Balance:</span> {balance} GAS</p>
            <p><span className="text-green-400">Username:</span> {registeredUsername}</p>
          </div>

          <div className={`bg-gray-900 p-6 rounded-lg shadow-lg ${registeredUsername !== 'none' ? 'opacity-50' : ''}`}>
            <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2" />
              Register Username
            </h2>
            {registeredUsername === 'none' ? (
              <form onSubmit={handleRegisterUsername} className="space-y-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full p-2 rounded bg-black border border-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
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
            ) : (
              <p className="text-gray-400">Username already registered.</p>
            )}
          </div>
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
              {transfers.map((transfer, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gray-900 p-4 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p><span className="text-green-400">From:</span> {transfer.sender}</p>
                  <p><span className="text-green-400">To:</span> {transfer.recipient}</p>
                  <p><span className="text-green-400">Amount:</span> {transfer.amount} GAS</p>
                  <p><span className="text-green-400">Status:</span> {transfer.status}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
