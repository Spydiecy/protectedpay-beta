// components/qr/QRScanner.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCodeIcon, 
  XMarkIcon,
  PhotoIcon,
  CameraIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { isMobile } from 'react-device-detect';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  // Camera scanning setup
  useEffect(() => {
    let mounted = true;

    const initializeScanner = async () => {
      if (isOpen && isCameraMode && isMobile && videoRef.current) {
        try {
          const hints = new Map();
          hints.set(DecodeHintType.TRY_HARDER, true);
          
          const codeReader = new BrowserQRCodeReader(hints, {
            delayBetweenScanAttempts: 100,
            delayBetweenScanSuccess: 300
          });

          const constraints = {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          };

          const controls = await codeReader.decodeFromConstraints(
            { video: constraints },
            videoRef.current,
            (result) => {
              if (!mounted) return;
              
              if (result) {
                try {
                  const text = result.getText();
                  const parsedData = JSON.parse(text);
                  if (parsedData.app === "ProtectedPay" && parsedData.address) {
                    handleSuccessfulScan(parsedData.address);
                  } else if (text.startsWith('0x')) {
                    handleSuccessfulScan(text);
                  }
                } catch {
                  const text = result.getText();
                  if (text.startsWith('0x')) {
                    handleSuccessfulScan(text);
                  }
                }
              }
            }
          );

          controlsRef.current = controls;
        } catch (err) {
          console.error('Scanner initialization error:', err);
          onError?.('Failed to start camera');
          setIsCameraMode(false);
        }
      }
    };

    initializeScanner();

    return () => {
      mounted = false;
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    };
  }, [isOpen, isCameraMode]);

  // Original working file upload code
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
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
                  handleSuccessfulScan(parsedData.address);
                }
              } catch {
                if (code.data.startsWith('0x')) {
                  handleSuccessfulScan(code.data);
                } else {
                  onError?.('Invalid QR code format');
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

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSuccessfulScan = (data: string) => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    onScan(data);
    setIsOpen(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
                        if (controlsRef.current) {
                          controlsRef.current.stop();
                        }
                        triggerFileInput();
                      }}
                      className={`p-2 ${!isCameraMode ? 'bg-green-500/20 text-green-400' : 'text-green-400/60 hover:text-green-400'}`}
                    >
                      <PhotoIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <motion.button
                  onClick={() => {
                    if (controlsRef.current) {
                      controlsRef.current.stop();
                    }
                    setIsOpen(false);
                  }}
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
              {isMobile ? (
                isCameraMode ? (
                  <div className="w-full max-w-sm mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl" />
                    <div className="relative bg-black/50 p-4 rounded-2xl">
                      <video
                        ref={videoRef}
                        className="w-full rounded-xl"
                        style={{ maxHeight: '70vh' }}
                      />
                      {/* Scanning Guide Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-2 border-green-400/50 rounded-lg"></div>
                      </div>
                    </div>
                    <p className="text-green-400 text-center mt-4">
                      Position the QR code within the frame
                    </p>
                  </div>
                ) : (
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
                        {isProcessing ? 'Processing...' : 'Select from gallery'}
                      </p>
                    </div>
                  </div>
                )
              ) : (
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
        capture="environment"
        onChange={handleFileSelect}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = '';
        }}
      />
    </>
  );
};

export default QRScanner;