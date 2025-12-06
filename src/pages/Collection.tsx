import { useState } from "react";
import { ComicCard } from "@/components/ComicCard";
import { CameraButton } from "@/components/CameraButton";
import { useToast } from "@/hooks/use-toast";
import { fetchComicByBarcode, formatBarcode } from "@/lib/apiService";
import type { Comic } from "@/lib/comicTypes";

const Collection = () => {
  const { toast } = useToast();
  const [comics, setComics] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBarcodeScanned = async (barcode: string) => {
    setIsLoading(true);
    // In a real app, you would fetch comic data from an API using the barcode
    // For now, we'll show what was scanned
    try {
      const formattedBarcode = formatBarcode(barcode);

      toast({
        title: "Scanning...",
        description: `Looking up barcode: ${formattedBarcode}`,
      });

      console.log("Scanned barcode:", barcode);

      const comicData = await fetchComicByBarcode(formattedBarcode);
      // TODO: Fetch comic data from API and add to collection
      if (comicData) {
        const alreadyExists = comics.some(
          (c) => c.barcode === formattedBarcode
        );

        if (alreadyExists) {
          toast({
            title: "Comic already in collection",
            description: `The comic "${comicData.title} ${comicData.issue}" is already in your collection.`,
          });
        } else {
          //setComics((prevComics => [...prevComics, comicData]);
          setComics((prev) => [comicData, ...prev]);

          toast({
            title: "Comic added!",
            description: `Added "${comicData.title} ${comicData.issue}" to your collection.`,
          });
        }
      } else {
        toast({
          title: "Comic not found",
          description: `No comic data found for barcode: ${formattedBarcode}`,
        });
      }
    } catch (error) {
      console.error("Error fetching comic:", error);
      toast({
        title: "Error",
        description: "Failed to fetch comic data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6"></div>

      {comics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-card rounded-2xl p-8 comic-shadow border-2 border-dashed border-muted max-w-md">
            <h3 className="text-xl font-bold mb-2">Your collection is empty</h3>
            <p className="text-muted-foreground mb-4">
              Tap the camera button to scan your first comic book!
            </p>
            {isLoading && (
              <p className="text-sm text-primary animate-pulse">
                Scanning comic...
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto px-8 py-8">
          {comics.map((comic) => (
            <ComicCard key={comic.id} {...comic} />
          ))}
        </div>
      )}

      <CameraButton
        onBarcodeScanned={handleBarcodeScanned}
        disabled={isLoading}
      />
    </>
  );
};

export default Collection;
