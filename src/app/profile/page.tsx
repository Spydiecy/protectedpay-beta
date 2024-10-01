'use client'
import { useWallet } from '@/context/WalletContext'
import TransactionHistory from '@/components/TransactionHistory'

export default function ProfilePage() {
  const { address, balance } = useWallet()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <p>Address: {address}</p>
      <p>Balance: {balance} GAS</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Transaction History</h2>
      <TransactionHistory />
    </div>
  )
}