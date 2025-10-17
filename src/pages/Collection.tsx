import { ComicCard } from "@/components/ComicCard";
import { CameraButton } from "@/components/CameraButton";

// Mock data - In a real app, this would come from a database
const mockComics = [
  {
    id: "1",
    title: "The Amazing Spider-Man",
    issue: "#252",
    coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
    publisher: "Marvel Comics",
  },
  {
    id: "2",
    title: "X-Men",
    issue: "#137",
    coverImage: "https://images.unsplash.com/photo-1612036781514-a6c3b6d6b6f6?w=400&h=600&fit=crop",
    publisher: "Marvel Comics",
  },
  {
    id: "3",
    title: "Batman",
    issue: "#608",
    coverImage: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=600&fit=crop",
    publisher: "DC Comics",
  },
  {
    id: "4",
    title: "The Fantastic Four",
    issue: "#48",
    coverImage: "https://images.unsplash.com/photo-1612036782364-1828a3c7e0d7?w=400&h=600&fit=crop",
    publisher: "Marvel Comics",
  },
  {
    id: "5",
    title: "Wonder Woman",
    issue: "#170",
    coverImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
    publisher: "DC Comics",
  },
  {
    id: "6",
    title: "The Avengers",
    issue: "#4",
    coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop&sat=-100",
    publisher: "Marvel Comics",
  },
];

const Collection = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-primary mb-2">MY COLLECTION</h2>
        <p className="text-muted-foreground">
          {mockComics.length} comic{mockComics.length !== 1 ? "s" : ""} in your vault
        </p>
      </div>

      {mockComics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-card rounded-2xl p-8 comic-shadow border-2 border-dashed border-muted max-w-md">
            <h3 className="text-xl font-bold mb-2">Your collection is empty</h3>
            <p className="text-muted-foreground mb-4">
              Tap the camera button to scan your first comic book!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockComics.map((comic) => (
            <ComicCard key={comic.id} {...comic} />
          ))}
        </div>
      )}

      <CameraButton />
    </>
  );
};

export default Collection;
