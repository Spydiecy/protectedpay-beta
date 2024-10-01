'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConnectWallet from './ConnectWallet';
import { useWallet } from '@/context/WalletContext';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { address } = useWallet();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/transfer', label: 'Transfer' },
    { href: '/claim', label: 'Claim' },
    { href: '/refund', label: 'Refund' },
  ];

  return (
    <nav className="bg-secondary">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          ProtectedPay
        </Link>
        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-white hover:text-primary transition-colors ${
                pathname === item.href ? 'font-bold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          {address && (
            <Link
              href="/profile"
              className={`text-white hover:text-primary transition-colors ${
                pathname === '/profile' ? 'font-bold' : ''
              }`}
            >
              Profile
            </Link>
          )}
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;