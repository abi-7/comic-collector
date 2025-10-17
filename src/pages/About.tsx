import { Zap, BookOpen, Camera, Database } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl p-8 comic-shadow border-2 border-foreground">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-primary mb-2">
            <span className="inline-block transform -rotate-2">COMIC</span>{" "}
            <span className="inline-block transform rotate-2">VAULT</span>
          </h1>
          <p className="text-muted-foreground">
            Your Digital Comic Book Collection
          </p>
        </div>

        <div className="space-y-6">
          <FeatureCard
            icon={<Camera className="h-8 w-8" />}
            title="SCAN & ADD"
            description="Use your device camera to scan comic book barcodes and instantly add them to your collection."
          />
          
          <FeatureCard
            icon={<Database className="h-8 w-8" />}
            title="TRACK EVERYTHING"
            description="Keep detailed records of your comics including condition, value, and important details."
          />
          
          <FeatureCard
            icon={<BookOpen className="h-8 w-8" />}
            title="VIEW DETAILS"
            description="Access comprehensive information about each comic in your collection at a glance."
          />
          
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="ALWAYS WITH YOU"
            description="Your collection syncs across devices so you can check it anywhere, anytime."
          />
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>Built for collectors, by collectors</p>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <div className="text-primary flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default About;
