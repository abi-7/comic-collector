import { useEffect, useState } from "react";
import { BarcodeScanner as CapacitorBarcodeScanner, BarcodeFormat } from "@capacitor-mlkit/barcode-scanning";
import { Button } from "@/components/ui/button";
import { X, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export const BarcodeScanner = ({ isOpen, onClose, onScan }: BarcodeScannerProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    try {
      const { supported } = await CapacitorBarcodeScanner.isSupported();
      setIsSupported(supported);
      
      if (!supported) {
        toast({
          title: "Scanner Not Available",
          description: "Barcode scanning is not supported on this device. Please use a physical mobile device.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error checking scanner support:", error);
      setIsSupported(false);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { camera } = await CapacitorBarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
    } catch (error) {
      console.error("Error requesting permissions:", error);
      toast({
        title: "Permission Denied",
        description: "Camera permission is required to scan barcodes",
        variant: "destructive"
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
        ]
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
        variant: "destructive"
      });
      setIsScanning(false);
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
      startScan();
    }
    
    return () => {
      if (isScanning) {
        stopScan();
      }
    };
  }, [isOpen, isSupported]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/95 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-primary">SCAN BARCODE</h2>
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

      {/* Scanner View - The native camera will overlay here */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!isSupported ? (
          <div className="text-center p-8 max-w-md">
            <div className="bg-card rounded-2xl p-8 comic-shadow border-2 border-foreground">
              <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Native Feature Required</h3>
              <p className="text-muted-foreground mb-4">
                Barcode scanning requires a physical mobile device with a camera.
              </p>
              <p className="text-sm text-muted-foreground">
                To test this feature, export your app to GitHub and run it on a mobile device or emulator.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {/* Scanning Frame */}
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

      {/* Bottom Instruction */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {isSupported ? "Scanning for barcodes..." : "Scanner not available in web browser"}
        </p>
      </div>
    </div>
  );
};
