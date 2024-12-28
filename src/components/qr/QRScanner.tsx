// components/qr/QRScanner.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCodeIcon, 
  XMarkIcon,
  PhotoIcon,
  CameraIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { isMobile } from 'react-device-detect';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image onto canvas
        ctx?.drawImage(img, 0, 0);

        try {
          const jsQR = (await import('jsqr')).default;
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          
          if (imageData) {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              try {
                const parsedData = JSON.parse(code.data);
                if (parsedData.app === "ProtectedPay" && parsedData.address) {
                  onScan(parsedData.address);
                  setIsOpen(false);
                }
              } catch {
                // If not JSON, check if it's an address
                if (code.data.startsWith('0x')) {
                  onScan(code.data);
                  setIsOpen(false);
                }
              }
            } else {
              onError?.('No QR code found in image');
            }
          }
        } catch (err) {
          onError?.(err instanceof Error ? err.message : 'Failed to read QR code');
        }
        
        setIsProcessing(false);
      };

      img.onerror = () => {
        onError?.('Failed to load image');
        setIsProcessing(false);
      };

      // Read the file as data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        }
      };
      reader.onerror = () => {
        onError?.('Failed to read file');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
      
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to process image');
      setIsProcessing(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadSection = (
    <div
      onClick={triggerFileInput}
      className="w-full max-w-sm mx-auto p-8 border-2 border-dashed border-green-500/20 rounded-2xl cursor-pointer hover:border-green-500/40 transition-colors"
    >
      <div className="flex flex-col items-center space-y-4">
        {isProcessing ? (
          <ArrowPathIcon className="w-12 h-12 text-green-400 animate-spin" />
        ) : (
          <PhotoIcon className="w-12 h-12 text-green-400" />
        )}
        <p className="text-green-400 font-medium text-center">
          {isProcessing ? 'Processing...' : 'Click to upload QR code'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-black/80 backdrop-blur-xl rounded-full border border-green-500/20 text-green-400 shadow-lg shadow-green-500/20 z-40 hover:bg-green-500/20 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <QrCodeIcon className="w-6 h-6" />
      </motion.button>

      {/* Scanner Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-green-500/20 bg-black/40">
              <h2 className="text-lg font-semibold text-green-400">Scan QR Code</h2>
              <div className="flex items-center space-x-4">
                {isMobile && (
                  <div className="flex rounded-lg overflow-hidden border border-green-500/20 bg-black/40">
                    <button
                      onClick={() => setIsCameraMode(true)}
                      className={`p-2 ${isCameraMode ? 'bg-green-500/20 text-green-400' : 'text-green-400/60 hover:text-green-400'}`}
                    >
                      <CameraIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsCameraMode(false);
                        triggerFileInput();
                      }}
                      className={`p-2 ${!isCameraMode ? 'bg-green-500/20 text-green-400' : 'text-green-400/60 hover:text-green-400'}`}
                    >
                      <PhotoIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg text-green-400/60 hover:text-green-400"
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {!isMobile || !isCameraMode ? uploadSection : (
                <div className="text-center">
                  <p className="text-green-400 mb-4">Camera functionality coming soon!</p>
                  {uploadSection}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = '';
        }}
      />
    </>
  );
};

export default QRScanner;