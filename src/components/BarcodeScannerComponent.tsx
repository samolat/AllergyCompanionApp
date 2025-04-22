'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { AlertCircle } from 'lucide-react'

type Props = {
  onScanSuccess: (decodedText: string) => void
}

export default function BarcodeScannerComponent({ onScanSuccess }: Props) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const [scannerError, setScannerError] = useState<string | null>(null)

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;
    
    // Wait until the DOM is fully loaded and the reference is available
    if (scannerRef.current) {
      try {
        scanner = new Html5Qrcode("barcode-scanner");
        
        Html5Qrcode.getCameras().then(devices => {
          if (devices && devices.length) {
            // Try to start scanning
            scanner?.start(
              { facingMode: "environment" },
              {
                fps: 10,
                qrbox: 250
              },
              (decodedText) => {
                // Make sure we only pass valid barcodes
                if (decodedText && decodedText.length >= 8 && /^\d+$/.test(decodedText)) {
                  onScanSuccess(decodedText);
                }
              },
              (error) => {
                // Don't display transient errors during scanning
                console.warn("Scan error:", error)
              }
            ).catch(err => {
              console.error("Failed to start scanner", err);
              setScannerError("Failed to start camera scanner. Please check camera permissions and try again, or use manual entry.");
            });
          } else {
            console.warn("No cameras found on this device");
            setScannerError("No cameras detected on your device. Please use manual entry instead.");
          }
        }).catch(err => {
          console.error("Failed to get cameras", err);
          setScannerError("Camera access denied or not available. Please use manual entry instead.");
        });
      } catch (err) {
        console.error("Error initializing scanner:", err);
        setScannerError("Error initializing barcode scanner. Please use manual entry instead.");
      }
    }

    // Cleanup function to stop scanner when component unmounts
    return () => {
      if (scanner) {
        scanner.stop().then(() => {
          scanner?.clear();
        }).catch(err => {
          console.error("Failed to stop scanner", err);
        });
      }
    }
  }, [onScanSuccess]);

  return (
    <div className="relative">
      <div ref={scannerRef} id="barcode-scanner" className="w-full h-64 rounded-lg overflow-hidden border" />
      {scannerError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-lg">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-xs text-center shadow-lg">
            <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm">{scannerError}</p>
          </div>
        </div>
      )}
    </div>
  )
} 