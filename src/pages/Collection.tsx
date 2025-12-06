import { useState } from "react";
import { ComicCard } from "@/components/ComicCard";
import { CameraButton } from "@/components/CameraButton";
import { useToast } from "@/hooks/use-toast";

// Mock data - In a real app, this would come from a database
const mockComics = [
  {
    id: "1",
    title: "The Amazing Spider-Man",
    issue: "#252",
    coverImage:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
    publisher: "Marvel Comics",
  },
  {
    id: "2",
    title: "Batman",
    issue: "#608",
    coverImage:
      "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=600&fit=crop",
    publisher: "DC Comics",
  },
  {
    id: "3",
    title: "The Avengers",
    issue: "#4",
    coverImage:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop&sat=-100",
    publisher: "Marvel Comics",
  },
];

const Collection = () => {
  const { toast } = useToast();
  const [comics, setComics] = useState(mockComics);

  const handleBarcodeScanned = (barcode: string) => {
    // In a real app, you would fetch comic data from an API using the barcode
    // For now, we'll show what was scanned
    toast({
      title: "Comic Book Detected!",
      description: `Barcode: ${barcode}\n\nIn a production app, this would fetch comic details from a database and add it to your collection.`,
      duration: 5000,
    });

    console.log("Scanned barcode:", barcode);
    // TODO: Fetch comic data from API and add to collection
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
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto px-8 py-8">
          {comics.map((comic) => (
            <ComicCard key={comic.id} {...comic} />
          ))}
        </div>
      )}

      <CameraButton onBarcodeScanned={handleBarcodeScanned} />
    </>
  );
};

export default Collection;
