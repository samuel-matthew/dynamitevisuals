import { ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-10 bg-card border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <a href="#" className="font-display text-xl font-bold tracking-tight">
            <span className="text-gradient">Dynamite</span>
            <span className="text-foreground">Visuals</span>
          </a>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} DynamiteVisuals. All rights reserved.
            Crafted with passion.
          </p>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
