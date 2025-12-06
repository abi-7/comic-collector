import { useEffect, useState, useRef } from "react";
import {
  BarcodeScanner as CapacitorBarcodeScanner,
  BarcodeFormat,
} from "@capacitor-mlkit/barcode-scanning";
import { Button } from "@/components/ui/button";
import { X, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Capacitor } from "@capacitor/core";

interface DetectedBarcode {
  rawValue: string;
  format: string;
  boundingBox?: DOMRectReadOnly;
  cornerPoints?: Array<{ x: number; y: number }>;
}

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}
// BarcodeScanner component using Capacitor ML Kit Barcode Scanning
// purpose: scan barcode using device camera (mobile app) and return the scanned barcode ( will be a comic book)
// to the parent component via onScan callback
export const BarcodeScanner = ({
  isOpen,
  onClose,
  onScan,
}: BarcodeScannerProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const [useWebScanner, setUseWebScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Check if we're on a native platform or web
  //for testing in browser
  const isNativePlatform = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isNativePlatform) {
      checkSupport();
    } else {
      setUseWebScanner(true);
      setIsSupported(true);
    }
  }, []);

  const checkSupport = async () => {
    try {
      const { supported } = await CapacitorBarcodeScanner.isSupported();
      setIsSupported(supported);

      if (!supported && !isNativePlatform) {
        setUseWebScanner(true);
        setIsSupported(true);
      }
    } catch (error) {
      console.error("Error checking scanner support:", error);
      setIsSupported(false);
      setUseWebScanner(true);
    }
  };

  //native cap scanner - mobile only
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { camera } = await CapacitorBarcodeScanner.requestPermissions();
      return camera === "granted" || camera === "limited";
    } catch (error) {
      console.error("Error requesting permissions:", error);
      toast({
        title: "Permission Denied",
        description: "Camera permission is required to scan barcodes",
        variant: "destructive",
      });
      return false;
    }
  };

  const startScan = async () => {
    try {
      setIsScanning(true);

      // Request permissions first
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsScanning(false);
        onClose();
        return;
      }

      // Scan for barcode - this will open the native camera and return the result
      const result = await CapacitorBarcodeScanner.scan({
        formats: [
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE,
          BarcodeFormat.Code128,
          BarcodeFormat.Code39,
          BarcodeFormat.Code93,
        ],
      });

      console.log("Barcode scanned:", result.barcodes);

      // Process the first barcode if any were detected
      if (result.barcodes && result.barcodes.length > 0) {
        const barcode = result.barcodes[0];
        const barcodeValue = barcode.displayValue || barcode.rawValue;

        onScan(barcodeValue);

        toast({
          title: "Barcode Detected!",
          description: `Scanned: ${barcodeValue}`,
        });
      }

      setIsScanning(false);
      onClose();
    } catch (error) {
      console.error("Error starting scan:", error);
      toast({
        title: "Scanner Error",
        description: "Failed to start the barcode scanner",
        variant: "destructive",
      });
      setIsScanning(false);
      onClose();
    }
  };

  //web scanner - browser testing
  const startWebScanner = async () => {
    try {
      setIsScanning(true);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Start scanning for barcodes
        scanIntervalRef.current = window.setInterval(() => {
          scanBarcodeFromVideo();
        }, 500); // Scan every 500ms
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan barcodes",
        variant: "destructive",
      });
      setIsScanning(false);
      onClose();
    }
  };

  const scanBarcodeFromVideo = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Try to detect barcode using BarcodeDetector API (if available)
    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      // @ts-expect-error BarcodeDetector constructor is not recognized by TypeScript
      const barcodeDetector = new window.BarcodeDetector({
        formats: [
          "ean_13",
          "ean_8",
          "upc_a",
          "upc_e",
          "code_128",
          "code_39",
          "code_93",
        ],
      });

      barcodeDetector
        .detect(canvas)
        .then((barcodes: DetectedBarcode[]) => {
          if (barcodes.length > 0) {
            const barcode = barcodes[0].rawValue;
            handleWebScanSuccess(barcode);
          }
        })
        .catch((error: Error) => {
          console.error("Barcode detection error:", error);
        });
    }
  };

  const handleWebScanSuccess = (barcode: string) => {
    // Stop scanning
    stopWebScanner();

    // Send barcode to parent
    onScan(barcode);

    toast({
      title: "Barcode Detected!",
      description: `Scanned: ${barcode}`,
    });

    onClose();
  };

  const stopWebScanner = () => {
    // Stop video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clear scan interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setIsScanning(false);
  };

  // ============================================
  // MANUAL BARCODE ENTRY (Fallback)
  // ============================================
  const [manualBarcode, setManualBarcode] = useState("");

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      toast({
        title: "Barcode Entered",
        description: `Barcode: ${manualBarcode}`,
      });
      setManualBarcode("");
      onClose();
    }
  };

  const stopScan = async () => {
    try {
      await CapacitorBarcodeScanner.stopScan();
      setIsScanning(false);
    } catch (error) {
      console.error("Error stopping scan:", error);
    }
  };

  const handleClose = async () => {
    if (isScanning) {
      await stopScan();
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen && isSupported) {
      if (useWebScanner) {
        startWebScanner();
      } else {
        startScan();
      }
    }

    return () => {
      if (useWebScanner) {
        stopWebScanner();
      } else if (isScanning) {
        stopScan();
      }
    };
  }, [isOpen, isSupported, useWebScanner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/95 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-primary">
            {useWebScanner ? "SCAN BARCODE (WEB)" : "SCAN BARCODE"}
          </h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Scanner View */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {useWebScanner ? (
          <>
            {/* Web Camera View */}
            <div className="relative w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden comic-shadow">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Frame Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-1/2 border-4 border-primary rounded-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-primary animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Entry Fallback */}
            <div className="mt-6 w-full max-w-md">
              <div className="bg-card p-4 rounded-xl border-2 border-muted">
                <p className="text-sm text-muted-foreground mb-2 text-center">
                  Camera not detecting? Enter barcode manually:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="Enter barcode number"
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-input bg-background"
                    onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  />
                  <Button onClick={handleManualSubmit} size="sm">
                    Submit
                  </Button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground text-center">
              Position barcode within the frame
            </p>
          </>
        ) : (
          // Native Scanner View
          <div className="text-center">
            <div className="relative w-64 h-64 border-4 border-primary rounded-2xl comic-shadow">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-primary animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-lg font-bold text-foreground">
              Position barcode within frame
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Hold steady for automatic detection
            </p>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {useWebScanner
            ? "Using web camera - for best results, use the mobile app"
            : "Scanning for barcodes..."}
        </p>
      </div>
    </div>
  );
};
