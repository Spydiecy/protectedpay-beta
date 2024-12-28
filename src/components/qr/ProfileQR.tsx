// components/qr/ProfileQR.tsx
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ProfileQRProps {
  username: string;
  address: string;
  onClose?: () => void;
}

const ProfileQR: React.FC<ProfileQRProps> = ({ username, address, onClose }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  // Format the data for the QR code
  const qrData = JSON.stringify({
    app: "ProtectedPay",
    username,
    address,
    type: "payment"
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pay ${username} on ProtectedPay`,
          text: `Send payment to ${username} using ProtectedPay`,
          url: `https://protectedpay.com/transfer?to=${address}`
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      // Fill with dark background
      if (ctx) {
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `protectedpay-${username}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
        Payment QR Code
      </h3>

      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative bg-black p-4 rounded-lg" ref={qrRef}>
          <QRCodeSVG
            value={qrData}
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#111111"
            fgColor="#10B981" // Emerald-500 color
            imageSettings={{
              src: "/logo.png",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />

          {/* Action buttons */}
          <div className="absolute -right-12 top-0 flex flex-col space-y-2">
            {typeof navigator.share === 'function' && (
              <motion.button
                onClick={handleShare}
                className="p-2 bg-black/80 rounded-xl border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShareIcon className="w-5 h-5" />
              </motion.button>
            )}
            
            <motion.button
              onClick={handleDownload}
              className="p-2 bg-black/80 rounded-xl border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-[250px]">
        <p className="text-green-400 font-medium">{username}</p>
        <p className="text-sm text-gray-400">Scan to send payment</p>
        <p className="text-xs text-gray-500 break-all">{address}</p>
      </div>

      {onClose && (
        <motion.button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close
        </motion.button>
      )}
    </div>
  );
};

export default ProfileQR;