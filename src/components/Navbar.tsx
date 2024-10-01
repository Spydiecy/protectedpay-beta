'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@/context/WalletContext'

const Navbar: React.FC = () => {
  const pathname = usePathname()
  const { address, connectWallet, disconnectWallet } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/transfer', label: 'Transfer' },
    { href: '/claim', label: 'Claim' },
    { href: '/refund', label: 'Refund' },
  ]

  const handleWalletClick = () => {
    if (address) {
      disconnectWallet()
    } else {
      connectWallet()
    }
  }

  return (
    <nav className="bg-black border-b border-green-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-green-400">
            ProtectedPay
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={`text-white hover:text-green-400 transition-colors ${
                    pathname === item.href ? 'text-green-400' : ''
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
            {address && (
              <Link href="/profile">
                <motion.span
                  className={`text-white hover:text-green-400 transition-colors ${
                    pathname === '/profile' ? 'text-green-400' : ''
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Profile
                </motion.span>
              </Link>
            )}
            <motion.button
              onClick={handleWalletClick}
              className="bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {address ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})` : 'Connect Wallet'}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === item.href
                        ? 'text-green-400 bg-gray-900'
                        : 'text-white hover:text-green-400 hover:bg-gray-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              {address && (
                <Link href="/profile">
                  <span
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === '/profile'
                        ? 'text-green-400 bg-gray-900'
                        : 'text-white hover:text-green-400 hover:bg-gray-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </span>
                </Link>
              )}
              <button
                onClick={() => {
                  handleWalletClick()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-green-500 hover:bg-green-400"
              >
                {address ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})` : 'Connect Wallet'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar