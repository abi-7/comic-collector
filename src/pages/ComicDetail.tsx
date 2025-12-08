import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Building2,
  DollarSign,
} from "lucide-react";
import type { Comic } from "@/lib/comicTypes";

const ComicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [manualCondition, setManualCondition] = useState("");
  const LOCAL_STORAGE_KEY = "comicCollection_v1";

  const [comic, setComic] = useState<Comic | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) {
        setComic(null);
        return;
      }
      const parsed = JSON.parse(raw) as Comic[];
      const found = parsed.find((c) => String(c.id) === String(id));
      setComic(found || null);
    } catch (e) {
      console.error("Failed to load comic from localStorage", e);
      setComic(null);
    }
  }, [id]);

  // Remove the currently displayed comic from storage and go back
  const removeAndGoBack = () => {
    if (!comic) return;
    if (
      !confirm(`Remove "${comic.title} ${comic.issue}" from your collection?`)
    )
      return;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Comic[]) : [];
      const next = parsed.filter((c) => String(c.id) !== String(comic.id));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      toast({
        title: "Comic removed",
        description: `"${comic.title} ${comic.issue}" was removed from your collection.`,
      });
      navigate(-1);
    } catch (e) {
      console.error("Failed to remove comic", e);
      toast({
        title: "Error",
        description: "Could not remove comic. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Manual condition input state
  const handleManualSubmit = () => {
    // Handle  condition submission
    //add it to detail view comic type
    toast({
      title: "Condition saved",
      description: `Condition "${manualCondition}" saved for "${comic?.title} ${comic?.issue}".`,
    });

    //save condition to local storage
    if (!comic) return;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Comic[]) : [];
      const updated = parsed.map((c) => {
        if (String(c.id) === String(comic.id)) {
          return { ...c, condition: manualCondition };
        }
        return c;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save condition", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 -ml-2">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Button>
        <Button
          variant="destructive"
          onClick={removeAndGoBack}
          className="ml-2"
        >
          Remove
        </Button>
      </div>

      {!comic ? (
        <div className="bg-card rounded-2xl p-8 comic-shadow border-2 border-dashed border-muted text-center">
          <h3 className="text-xl font-bold mb-2">Comic not found</h3>
          <p className="text-muted-foreground">
            We couldn't find that comic in your saved collection.
          </p>
        </div>
      ) : (
        <>
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
                  <p className="text-xl font-bold text-muted-foreground">
                    {comic.issue}
                  </p>
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
                    value={comic.writer || "N/A"}
                  />
                  <DetailItem
                    icon={<BookOpen className="h-5 w-5" />}
                    label="Artist"
                    value={comic.artist || "N/A"}
                  />
                  <DetailItem
                    icon={<DollarSign className="h-5 w-5" />}
                    label="Retail Price"
                    value={comic.retailPrice || "N/A"}
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-bold text-sm text-muted-foreground mb-2">
                    CONDITION
                  </h3>
                  {/* hide input once submitted */}

                  <div className="flex items-center gap-4 mb-2">
                    <input
                      type="text"
                      value={manualCondition}
                      onChange={(e) => setManualCondition(e.target.value)}
                      //hide input once submitted
                      placeholder="Enter condition (e.g., Near Mint, Good)"
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-input bg-background"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleManualSubmit()
                      }
                    />
                    <Button onClick={handleManualSubmit} size="sm">
                      Submit
                    </Button>
                  </div>
                  <p className="font-bold text-lg">{manualCondition} </p>
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
        </>
      )}
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
