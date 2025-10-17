import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "./BarcodeScanner";
import { useToast } from "@/hooks/use-toast";

interface CameraButtonProps {
  onBarcodeScanned?: (barcode: string) => void;
}

export const CameraButton = ({ onBarcodeScanned }: CameraButtonProps) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { toast } = useToast();

  const handleScan = () => {
    setIsScannerOpen(true);
  };

  const handleBarcodeDetected = (barcode: string) => {
    console.log("Barcode detected:", barcode);
    
    if (onBarcodeScanned) {
      onBarcodeScanned(barcode);
    } else {
      // Default behavior - show toast with barcode
      toast({
        title: "Comic Scanned!",
        description: `Barcode: ${barcode}`,
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleScan}
        size="lg"
        className="fixed bottom-6 right-6 z-30 h-16 w-16 rounded-full shadow-2xl comic-shadow hover:scale-110 transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
        aria-label="Scan comic barcode"
      >
        <Camera className="h-8 w-8" />
      </Button>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeDetected}
      />
    </>
  );
};
