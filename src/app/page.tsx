'use client'

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  ShieldCheckIcon, CurrencyDollarIcon, UserCircleIcon, 
  LockClosedIcon, ArrowPathIcon, CheckCircleIcon,
  BanknotesIcon, UsersIcon, SparklesIcon,
  ChartBarIcon, WalletIcon, FireIcon
} from '@heroicons/react/24/outline';

// Define animation variants
const fadeIn: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } 
  }
};

const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const iconFloat: Variants = {
  initial: { y: 0 },
  animate: { 
    y: [-5, 5, -5], 
    transition: { 
      duration: 3, 
      repeat: Infinity,
      ease: "easeInOut" 
    } 
  }
};

// Hero section
const Hero = () => (
  <motion.section
    className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden"
    variants={fadeIn}
    initial="initial"
    animate="animate"
  >
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950/30 to-black" />
    
    <div className="relative z-10 px-4 md:px-8 max-w-5xl">
      <motion.div
        className="mb-8 inline-block"
        variants={iconFloat}
        initial="initial"
        animate="animate"
      >
        <div className="bg-black/30 p-6 rounded-2xl backdrop-blur-xl border border-green-500/10">
          <WalletIcon className="w-20 h-20 text-green-400" />
        </div>
      </motion.div>

      <motion.h1 
        className="text-6xl md:text-7xl font-bold mb-6"
        variants={fadeIn}
      >
        <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 text-transparent bg-clip-text">
          ProtectedPay
        </span>
      </motion.h1>

      <motion.p 
        className="text-2xl md:text-3xl mb-12 text-gray-300 max-w-3xl mx-auto"
        variants={fadeIn}
      >
        Secure Crypto Transfers, Group Payments, and Smart Savings on NeoX
      </motion.p>

      <motion.div 
        className="flex flex-wrap justify-center gap-6"
        variants={fadeIn}
      >
        <motion.button
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:brightness-110"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Transferring
        </motion.button>
        <motion.button
          className="bg-black/40 backdrop-blur-xl border border-green-500/20 text-green-400 px-8 py-4 rounded-xl font-semibold text-lg hover:border-green-500/40 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
        </motion.button>
      </motion.div>

      <motion.div 
        className="mt-12 flex justify-center gap-8 flex-wrap"
        variants={fadeIn}
      >
        <div className="flex items-center space-x-2 text-gray-400">
          <ShieldCheckIcon className="w-5 h-5 text-green-400" />
          <span>Secure & Protected</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <SparklesIcon className="w-5 h-5 text-green-400" />
          <span>Username Support</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <UsersIcon className="w-5 h-5 text-green-400" />
          <span>Group Payments</span>
        </div>
      </motion.div>
    </div>

    {/* Animated background elements */}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/30 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
  </motion.section>
);

// ... (keep previous Hero section and animations) ...

// Features section
const Features = () => (
  <motion.section
    className="py-20 relative overflow-hidden"
    variants={stagger}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />
    <div className="container mx-auto px-4 relative z-10">
      <motion.h2 
        className="text-5xl font-bold mb-16 text-center"
        variants={fadeIn}
      >
        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Powerful Features
        </span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<ShieldCheckIcon className="w-12 h-12" />}
          title="Secure Transfers"
          description="Send crypto with peace of mind. Funds are protected by smart contracts until claimed."
        />
        <FeatureCard
          icon={<UsersIcon className="w-12 h-12" />}
          title="Group Payments"
          description="Split bills and share expenses easily with automatic distribution when target is met."
        />
        <FeatureCard
          icon={<BanknotesIcon className="w-12 h-12" />}
          title="Savings Pots"
          description="Create personal savings goals and track your progress towards financial targets."
        />
        <FeatureCard
          icon={<UserCircleIcon className="w-12 h-12" />}
          title="Username Support"
          description="Send funds using memorable usernames instead of complex addresses."
        />
        <FeatureCard
          icon={<ArrowPathIcon className="w-12 h-12" />}
          title="Easy Refunds"
          description="Recover funds instantly if sent to the wrong address or username."
        />
        <FeatureCard
          icon={<ChartBarIcon className="w-12 h-12" />}
          title="Transaction History"
          description="Track all your transfers, group payments, and savings in one place."
        />
      </div>
    </div>
  </motion.section>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <motion.div
    className="relative group"
    variants={fadeIn}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
      <motion.div 
        className="text-green-400 mb-6"
        variants={iconFloat}
        initial="initial"
        animate="animate"
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-semibold mb-4 text-green-400">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// How it works section
const HowItWorks = () => (
  <motion.section
    className="py-20 relative overflow-hidden"
    variants={stagger}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="container mx-auto px-4">
      <motion.h2 
        className="text-5xl font-bold mb-16 text-center"
        variants={fadeIn}
      >
        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          How It Works
        </span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Secure Transfers */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold mb-8 text-center text-green-400">Secure Transfers</h3>
          <StepCard
            icon={<LockClosedIcon className="w-12 h-12" />}
            title="Send Funds"
            description="Initiate a transfer using username or address. Funds are locked securely."
            step={1}
          />
          <StepCard
            icon={<ArrowPathIcon className="w-12 h-12" />}
            title="Recipient Claims"
            description="Recipient claims the transfer using their connected wallet."
            step={2}
          />
          <StepCard
            icon={<CheckCircleIcon className="w-12 h-12" />}
            title="Transfer Complete"
            description="Funds are released to the recipient securely."
            step={3}
          />
        </div>

        {/* Group Payments */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold mb-8 text-center text-green-400">Group Payments</h3>
          <StepCard
            icon={<UsersIcon className="w-12 h-12" />}
            title="Create Group"
            description="Set payment amount and number of participants needed."
            step={1}
          />
          <StepCard
            icon={<CurrencyDollarIcon className="w-12 h-12" />}
            title="Collect Funds"
            description="Each participant contributes their share to the pool."
            step={2}
          />
          <StepCard
            icon={<ArrowPathIcon className="w-12 h-12" />}
            title="Auto Distribution"
            description="Funds are automatically sent to recipient when target is met."
            step={3}
          />
        </div>

        {/* Savings Pots */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold mb-8 text-center text-green-400">Savings Pots</h3>
          <StepCard
            icon={<BanknotesIcon className="w-12 h-12" />}
            title="Create Pot"
            description="Set your savings goal and target amount."
            step={1}
          />
          <StepCard
            icon={<SparklesIcon className="w-12 h-12" />}
            title="Add Funds"
            description="Contribute to your pot whenever you want."
            step={2}
          />
          <StepCard
            icon={<FireIcon className="w-12 h-12" />}
            title="Break Pot"
            description="Withdraw your savings when you reach your goal."
            step={3}
          />
        </div>
      </div>
    </div>
  </motion.section>
);

const StepCard: React.FC<{ icon: React.ReactNode; title: string; description: string; step: number }> = ({
  icon,
  title,
  description,
  step
}) => (
  <motion.div
    className="relative group"
    variants={fadeIn}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
      <motion.div 
        className="text-green-400 mb-4"
        variants={iconFloat}
      >
        {icon}
      </motion.div>
      <h4 className="text-xl font-semibold mb-2 text-green-400">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold px-3 py-1 rounded-full text-sm">
        {step}
      </div>
    </div>
  </motion.div>
);

// Call to action section
const CallToAction = () => (
  <motion.section 
    className="py-20 relative overflow-hidden"
    variants={fadeIn}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-5xl font-bold mb-8"
          variants={fadeIn}
        >
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Start Using ProtectedPay Today
          </span>
        </motion.h2>
        
        <motion.p
          className="text-xl mb-12 text-gray-300"
          variants={fadeIn}
        >
          Experience secure transfers, group payments, and smart savings on the NeoX blockchain.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-6"
          variants={fadeIn}
        >
          <motion.button
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:brightness-110"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Connect Wallet
          </motion.button>
          <motion.button
            className="bg-black/40 backdrop-blur-xl border border-green-500/20 text-green-400 px-8 py-4 rounded-xl font-semibold text-lg hover:border-green-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Documentation
          </motion.button>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

// Main component
export default function ProtectedPayLandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
      </div>
    </div>
  );
}