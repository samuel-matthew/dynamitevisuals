import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowDown, Loader2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { getSettings } from "@/lib/api/settings";
import { Settings } from "@/types/models";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const HeroSection = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleOpenShowreel = () => {
    if (settings?.showreel?.url) {
      setIsModalOpen(true);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-noise opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full lg:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Pre-headline */}
            <p
              className="text-primary font-medium tracking-widest uppercase text-xs sm:text-sm mb-4 sm:mb-6 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Video Editor & Motion Designer
            </p>

            {/* Main Headline */}
            <h1
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-4 sm:mb-6 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              Crafting
              <span className="text-gradient block">Visual Stories</span>
              That Move People
            </h1>

            {/* Subheadline */}
            <p
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.6s" }}
            >
              I transform raw footage into captivating narratives. From brand
              films to motion graphics, I create content that resonates and
              converts.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.8s" }}
            >
              <Button
                variant="hero"
                size="xl"
                className="group w-full sm:w-auto"
                onClick={handleOpenShowreel}
                disabled={isLoading || !settings?.showreel?.url}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-1 animate-spin" />
                ) : (
                  <Play className="w-5 h-5 mr-1 group-hover:scale-110 transition-transform" />
                )}
                Watch Showreel
              </Button>
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto" asChild>
                <a href="#work">View My Work</a>
              </Button>
            </div>
          </div>

          {/* Video Preview Card */}
          <div
            className="max-w-5xl mx-auto opacity-0 animate-fade-up"
            style={{ animationDelay: "1s" }}
          >
            <div
              className={`relative aspect-video rounded-lg sm:rounded-xl overflow-hidden glass border border-border/30 group ${settings?.showreel?.url ? 'cursor-pointer' : ''}`}
              onClick={handleOpenShowreel}
            >
              {/* Showreel preview placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-muted to-background flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/30 transition-colors">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary ml-1" />
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {settings?.showreel?.url ? "Click to watch showreel" : "No showreel available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            className="mt-12 sm:mt-16 md:mt-20 opacity-0 animate-fade-up"
            style={{ animationDelay: "1.2s" }}
          >
            <a
              href="#work"
              className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <ArrowDown className="w-4 h-4 animate-float" />
            </a>
          </div>
        </div>
      </div>

      {/* Showreel Video Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl p-0 border-0 bg-black">
          <div className="relative aspect-video w-full">
            {settings?.showreel?.url && (
              <video
                src={settings.showreel.url}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
