import { Film, Wand2, Video, Share2, Sparkles, ArrowRight, Clapperboard, Palette, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Service } from "@/types/models";
import { getServices } from "@/lib/api/services";

const iconOptions = [
  { value: "Film", icon: Film },
  { value: "Sparkles", icon: Sparkles },
  { value: "Clapperboard", icon: Clapperboard },
  { value: "Palette", icon: Palette },
  { value: "Music", icon: Music },
  { value: "Wand2", icon: Wand2 },
  { value: "Video", icon: Video },
  { value: "Share2", icon: Share2 },
];

const getIconComponent = (iconName: string) => {
  const iconOption = iconOptions.find((opt) => opt.value === iconName);
  return iconOption?.icon || Film;
};

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-gradient-radial from-secondary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            What I Offer
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Services That{" "}
            <span className="text-gradient-gold">Deliver Results</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From concept to final delivery, I provide end-to-end video
            production services that elevate your brand and engage your
            audience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <div
                key={service._id}
                className="group glass rounded-2xl p-8 border border-border/30 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className="flex items-center gap-2 text-primary text-sm font-medium group/btn">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="glass rounded-2xl p-10 border border-border/30 max-w-3xl mx-auto">
            <h3 className="font-display text-2xl font-bold mb-4">
              Have a Project in Mind?
            </h3>
            <p className="text-muted-foreground mb-6">
              Let's discuss how I can help bring your vision to life. Free
              consultation included.
            </p>
            <Button variant="hero" size="lg">
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
