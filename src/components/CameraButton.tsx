import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const CameraButton = () => {
  const { toast } = useToast();

  const handleScan = () => {
    toast({
      title: "Camera Scanner",
      description: "Barcode scanning feature coming soon! This will use your device camera to scan comic book barcodes.",
    });
  };

  return (
    <Button
      onClick={handleScan}
      size="lg"
      className="fixed bottom-6 right-6 z-30 h-16 w-16 rounded-full shadow-2xl comic-shadow hover:scale-110 transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
      aria-label="Scan comic barcode"
    >
      <Camera className="h-8 w-8" />
    </Button>
  );
};
