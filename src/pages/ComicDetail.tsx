import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, BookOpen, Building2, DollarSign } from "lucide-react";

// Mock data - would be fetched based on ID in real app
const mockComicDetails: Record<string, any> = {
  "1": {
    title: "The Amazing Spider-Man",
    issue: "#252",
    coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&h=1200&fit=crop",
    publisher: "Marvel Comics",
    releaseDate: "May 1984",
    writer: "Tom DeFalco",
    artist: "Ron Frenz",
    description: "First appearance of Spider-Man's black costume! Peter Parker returns from the Secret Wars with a mysterious new alien symbiote suit that would later become Venom.",
    condition: "Very Fine",
    estimatedValue: "$850",
  },
};

const ComicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const comic = mockComicDetails[id || "1"] || mockComicDetails["1"];

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-4 -ml-2 hover:bg-muted"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Collection
      </Button>

      <div className="bg-card rounded-2xl overflow-hidden comic-shadow border-2 border-foreground">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Cover Image */}
          <div className="relative">
            <div className="aspect-[2/3] rounded-xl overflow-hidden border-2 border-foreground comic-shadow">
              <img
                src={comic.coverImage}
                alt={`${comic.title} ${comic.issue}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black text-primary mb-2">
                {comic.title}
              </h1>
              <p className="text-xl font-bold text-muted-foreground">{comic.issue}</p>
            </div>

            <div className="space-y-4">
              <DetailItem
                icon={<Building2 className="h-5 w-5" />}
                label="Publisher"
                value={comic.publisher}
              />
              <DetailItem
                icon={<Calendar className="h-5 w-5" />}
                label="Release Date"
                value={comic.releaseDate}
              />
              <DetailItem
                icon={<BookOpen className="h-5 w-5" />}
                label="Writer"
                value={comic.writer}
              />
              <DetailItem
                icon={<BookOpen className="h-5 w-5" />}
                label="Artist"
                value={comic.artist}
              />
              <DetailItem
                icon={<DollarSign className="h-5 w-5" />}
                label="Est. Value"
                value={comic.estimatedValue}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-bold text-sm text-muted-foreground mb-2">
                CONDITION
              </h3>
              <p className="font-bold text-lg">{comic.condition}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted/50 border-t-2 border-foreground">
          <h3 className="font-bold text-sm text-muted-foreground mb-2">
            DESCRIPTION
          </h3>
          <p className="leading-relaxed">{comic.description}</p>
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
          {label}
        </p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default ComicDetail;
