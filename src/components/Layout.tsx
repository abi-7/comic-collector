import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import comicBg from "@/assets/comic-bg.png";

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { label: "My Collection", path: "/" },
  { label: "About", path: "/about" },
];

export const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-20 -z-10"
        style={{ backgroundImage: `url(${comicBg})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 -z-10" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b-4 border-foreground shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all comic-shadow"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-2xl font-black text-primary">
            COMIC VAULT
          </h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Slide-out Menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-72 bg-card border-r-4 border-foreground shadow-2xl transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-primary">MENU</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-all"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-bold text-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground comic-shadow"
                      : "hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {children}
      </main>
    </div>
  );
};
