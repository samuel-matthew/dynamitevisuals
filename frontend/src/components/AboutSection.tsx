import { useState, useEffect } from "react";
import { Film, Sparkles, Palette, Zap, Award, Users, Loader2 } from "lucide-react";
import { AboutInfo } from "@/types/models";
import { getAboutInfo } from "@/lib/api/about";

// Helper to map stats labels to icons
const getStatIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("project")) return Film;
  if (l.includes("client")) return Users;
  if (l.includes("award")) return Award;
  if (l.includes("experience")) return Zap;
  return Sparkles;
};

// Helper to generate tool icons (initials) from name
const getToolIcon = (name: string) => {
  if (name === "Premiere Pro") return "Pr";
  if (name === "After Effects") return "Ae";
  if (name === "DaVinci Resolve") return "DV";
  if (name === "Cinema 4D") return "C4D";
  if (name === "Blender") return "BL";
  if (name === "Photoshop") return "Ps";
  return name.substring(0, 2).toUpperCase();
};

const AboutSection = () => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getAboutInfo();
        setAboutInfo(data);
      } catch (error) {
        console.error("Failed to fetch about info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (isLoading) {
    return (
      <section id="about" className="py-24 bg-muted/30 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (!aboutInfo) return null;

  return (
    <section id="about" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-primary/10 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image/Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden glass border border-border/30">
              <img
                src={typeof aboutInfo.profileImage === 'string' ? aboutInfo.profileImage : aboutInfo.profileImage?.url}
                alt={aboutInfo.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -right-8 glass rounded-xl p-6 animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold">
                    {aboutInfo.stats.find(s => s.label.toLowerCase().includes("experience"))?.value || "8+"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Crafting Stories
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
              About Me
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Turning Vision Into <span className="text-gradient">Reality</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              I'm {aboutInfo.name}, a {aboutInfo.title}. {aboutInfo.bio}
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {aboutInfo.philosophy}
            </p>

            {/* Philosophy Cards - Static for now as dynamic fields are limited, but could be added to backend later */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="glass rounded-xl p-5 border border-border/30 hover:border-primary/30 transition-colors">
                <Palette className="w-8 h-8 text-primary mb-3" />
                <h4 className="font-display font-semibold mb-2">
                  Creative Vision
                </h4>
                <p className="text-sm text-muted-foreground">
                  Every frame tells a story. I bring artistic direction to every
                  project.
                </p>
              </div>
              <div className="glass rounded-xl p-5 border border-border/30 hover:border-primary/30 transition-colors">
                <Zap className="w-8 h-8 text-secondary mb-3" />
                <h4 className="font-display font-semibold mb-2">
                  Fast Turnaround
                </h4>
                <p className="text-sm text-muted-foreground">
                  Efficient workflows mean quality work delivered on schedule.
                </p>
              </div>
            </div>

            {/* Tools */}
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Tools I Master:
              </p>
              <div className="flex flex-wrap gap-3">
                {aboutInfo.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border/50 hover:border-primary/50 transition-colors group"
                  >
                    <span className="text-primary font-bold text-sm group-hover:scale-110 transition-transform">
                      {getToolIcon(tool.name)}
                    </span>
                    <span className="text-sm">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {aboutInfo.stats.map((stat, index) => {
            const Icon = getStatIcon(stat.label);
            return (
              <div
                key={index}
                className="text-center glass rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-display text-3xl font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
