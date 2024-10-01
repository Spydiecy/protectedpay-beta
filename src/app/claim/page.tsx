'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@/context/WalletContext'
import { claimTransferByAddress, claimTransferByUsername, claimTransferById } from '@/utils/contract'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function ClaimPage() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signer } = useWallet()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signer) {
      setError('Please connect your wallet first')
      return
    }
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (input.startsWith('0x') && input.length === 66) {
        await claimTransferById(signer, input)
      } else if (input.startsWith('0x')) {
        await claimTransferByAddress(signer, input)
      } else {
        await claimTransferByUsername(signer, input)
      }
      setSuccess('Transfer claimed successfully!')
      setInput('')
    } catch (err) {
      setError('Failed to claim transfer. Please try again.')
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
          Claim Funds
        </motion.h1>
        <motion.form 
          onSubmit={handleSubmit} 
          className="max-w-md mx-auto space-y-6 bg-gray-900 p-8 rounded-lg shadow-lg"
          variants={fadeIn}
        >
          <div>
            <label htmlFor="input" className="block mb-2 text-green-400">Sender Address, Username, or Transfer ID</label>
            <input
              type="text"
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 rounded bg-black border border-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <motion.button 
            type="submit" 
            className="w-full bg-green-500 text-black px-4 py-2 rounded font-semibold flex items-center justify-center space-x-2 hover:bg-green-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Processing...' : 'Claim Transfer'}</span>
            <CheckCircleIcon className="w-5 h-5" />
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}