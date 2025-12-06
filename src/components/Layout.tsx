import { Link, useLocation } from "react-router-dom";
import comicBg from "@/assets/comic-bg.png";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${comicBg})` }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b-4 border-foreground shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-black text-primary">MY COLLECTION</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">{children}</main>
    </div>
  );
};
