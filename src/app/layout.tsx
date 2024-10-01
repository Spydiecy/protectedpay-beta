import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { WalletProvider } from '@/context/WalletContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ProtectedPay',
  description: 'Secure and easy crypto transfers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}