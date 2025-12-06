import { Link } from "react-router-dom";

interface ComicCardProps {
  id: string;
  title: string;
  issue: string;
  coverImage: string;
  publisher: string;
}

export const ComicCard = ({
  id,
  title,
  issue,
  coverImage,
  publisher,
}: ComicCardProps) => {
  return (
    <Link to={`/comic/${id}`} className="block max-w-[200px]">
      <div className="group relative bg-card rounded-lg overflow-hidden comic-shadow hover:scale-105 transition-all duration-300 border-2 border-foreground">
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={coverImage}
            alt={`${title} ${issue}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-2 bg-card">
          <h3 className="font-bold text-xs leading-tight mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-[10px] text-muted-foreground">{issue}</p>
          <p className="text-[10px] text-primary font-semibold mt-0.5">
            {publisher}
          </p>
        </div>
      </div>
    </Link>
  );
};
