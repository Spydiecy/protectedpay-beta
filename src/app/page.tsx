'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { 
  ShieldCheckIcon, CurrencyDollarIcon, UserCircleIcon, 
  LockClosedIcon, ArrowPathIcon, CheckCircleIcon
} from '@heroicons/react/24/outline'

const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const iconHover: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.3 } }
}


export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <CallToAction />
    </div>
  )
}

const Hero = () => (
  <section className="text-center py-20">
    <motion.h1 
      className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      ProtectedPay
    </motion.h1>
    <motion.p 
      className="text-2xl mb-12 text-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      Secure, Easy, and Protected Crypto Transfers
    </motion.p>
    <motion.button 
      className="bg-green-500 text-black px-8 py-3 rounded-full text-xl font-semibold transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Get Started
    </motion.button>
  </section>
)

const Features = () => (
  <motion.section 
    className="py-20 bg-gray-900"
    variants={stagger}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold mb-12 text-center text-green-400">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<ShieldCheckIcon className="w-12 h-12" />}
          title="Secure Transfers"
          description="Your funds are protected until the recipient claims them."
        />
        <FeatureCard 
          icon={<CurrencyDollarIcon className="w-12 h-12" />}
          title="Easy Refunds"
          description="Easily refund your transfer if sent to the wrong address."
        />
        <FeatureCard 
          icon={<UserCircleIcon className="w-12 h-12" />}
          title="Username Support"
          description="Send funds using usernames instead of long addresses."
        />
      </div>
    </div>
  </motion.section>
)

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <motion.div 
    className="bg-black p-6 rounded-lg border border-green-500 transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
    variants={fadeIn}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <motion.div 
      className="text-green-400 mb-4"
      variants={iconHover}
      initial="initial"
      whileHover="hover"
    >
      {icon}
    </motion.div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
)

const HowItWorks = () => (
  <motion.section 
    className="py-20"
    variants={stagger}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold mb-12 text-center text-green-400">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StepCard 
          icon={<LockClosedIcon className="w-12 h-12" />}
          title="Initiate Transfer"
          description="Send crypto to a username or address. Funds are locked in the smart contract."
          step={1}
        />
        <StepCard 
          icon={<ArrowPathIcon className="w-12 h-12" />}
          title="Recipient Claims"
          description="The recipient claims the transfer using their wallet."
          step={2}
        />
        <StepCard 
          icon={<CheckCircleIcon className="w-12 h-12" />}
          title="Transfer Complete"
          description="Funds are released to the recipient. Transfer is recorded on the blockchain."
          step={3}
        />
      </div>
    </div>
  </motion.section>
)

const StepCard: React.FC<{ icon: React.ReactNode; title: string; description: string; step: number }> = ({ icon, title, description, step }) => (
  <motion.div 
    className="bg-gray-900 p-6 rounded-lg relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
    variants={fadeIn}
    whileHover={{ scale: 1.05 }}
  >
    <motion.div 
      className="text-green-400 mb-4"
      variants={iconHover}
      initial="initial"
      whileHover="hover"
    >
      {icon}
    </motion.div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
    <div className="absolute top-0 right-0 bg-green-500 text-black font-bold p-2 rounded-bl-lg">
      Step {step}
    </div>
  </motion.div>
)

const Benefits = () => (
  <motion.section 
    className="py-20 bg-gray-900"
    variants={stagger}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold mb-12 text-center text-green-400">Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BenefitItem text="Enhanced security for your crypto transfers" />
        <BenefitItem text="User-friendly interface with username support" />
        <BenefitItem text="Trustless transactions backed by smart contracts" />
        <BenefitItem text="Quick and easy refunds for misdirected transfers" />
        <BenefitItem text="Transparent transaction history" />
        <BenefitItem text="24/7 availability and instant transfers" />
      </div>
    </div>
  </motion.section>
)

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
  <motion.div 
    className="flex items-center space-x-4 bg-black p-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
    variants={fadeIn}
    whileHover={{ scale: 1.03 }}
  >
    <CheckCircleIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
    <span className="text-gray-300 text-lg">{text}</span>
  </motion.div>
)

const CallToAction = () => (
  <section className="py-20 text-center">
    <motion.h2 
      className="text-4xl font-bold mb-6 text-green-400"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      Ready to Get Started?
    </motion.h2>
    <motion.p 
      className="text-xl mb-8 text-gray-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      viewport={{ once: true }}
    >
      Join ProtectedPay today and experience secure crypto transfers like never before.
    </motion.p>
    <motion.button 
      className="bg-green-500 text-black px-8 py-3 rounded-full text-xl font-semibold transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Sign Up Now
    </motion.button>
  </section>
)