import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Testimonial } from "@/types/models";
import { getTestimonials } from "@/lib/api/testimonials";

const clientLogos = ["Nike", "Adobe", "Spotify", "Netflix", "Google", "Apple"];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);
  return (
    <section
      id="testimonials"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Testimonials
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            What Clients <span className="text-gradient">Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say
            about working together.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="glass rounded-2xl p-8 border border-border/30 hover:border-primary/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/30 mb-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-secondary text-secondary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.avatar?.url ? (
                  <img
                    src={testimonial.avatar.url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-lg border-2 border-primary/20">
                    {testimonial.name.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-display font-semibold">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by leading brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clientLogos.map((logo) => (
              <div
                key={logo}
                className="text-2xl font-display font-bold text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
