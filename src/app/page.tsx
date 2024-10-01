import { motion } from 'framer-motion'
import { ShieldCheckIcon, CurrencyDollarIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="text-center">
      <motion.h1 
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to ProtectedPay
      </motion.h1>
      <motion.p 
        className="text-xl mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Secure, Easy, and Protected Crypto Transfers
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Feature 
          icon={<ShieldCheckIcon className="w-12 h-12" />}
          title="Secure Transfers"
          description="Your funds are protected until the recipient claims them."
        />
        <Feature 
          icon={<CurrencyDollarIcon className="w-12 h-12" />}
          title="Easy Refunds"
          description="Easily refund your transfer if sent to the wrong address."
        />
        <Feature 
          icon={<UserCircleIcon className="w-12 h-12" />}
          title="Username Support"
          description="Send funds using usernames instead of long addresses."
        />
      </div>
    </div>
  )
}

function Feature({ icon, title, description }) {
  return (
    <motion.div 
      className="bg-secondary p-6 rounded-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-primary mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p>{description}</p>
    </motion.div>
  )
}