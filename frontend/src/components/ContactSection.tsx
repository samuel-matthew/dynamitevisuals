import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  MessageCircle,
  Send,
  Instagram,
  Youtube,
  Facebook,
  ArrowRight,
  Loader2,
  Twitter,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail } from "@/lib/api/contact";
import { getSettings } from "@/lib/api/settings";
import { Settings } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Helper to map social platform names to icons
const getSocialIcon = (label: string): LucideIcon => {
  const l = label.toLowerCase();
  if (l.includes("youtube") || l.includes("yt")) return Youtube;
  if (l.includes("instagram") || l.includes("ig")) return Instagram;
  if (l.includes("facebook") || l.includes("fb")) return Facebook;
  if (l.includes("twitter") || l.includes("x")) return Twitter;
  if (l.includes("linkedin")) return Linkedin;
  return Mail; // default
};

// Helper to get color for social platform
const getSocialColor = (label: string): string => {
  const l = label.toLowerCase();
  if (l.includes("youtube")) return "hover:text-red-500";
  if (l.includes("instagram")) return "hover:text-pink-500";
  if (l.includes("facebook")) return "hover:text-blue-500";
  if (l.includes("twitter") || l.includes("x")) return "hover:text-sky-400";
  if (l.includes("linkedin")) return "hover:text-blue-600";
  return "hover:text-primary";
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  });
  const [emailModalData, setEmailModalData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendContactEmail({
        ...formData,
        type: "hire",
        subject: `New Project Inquiry: ${formData.project}`,
      });
      toast({
        title: "Message Sent!",
        description:
          "Thanks for reaching out. I'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", project: "", message: "" });
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Something went wrong. Please try again or use direct email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalLoading(true);
    try {
      await sendContactEmail({
        ...emailModalData,
        type: "contact",
      });
      toast({
        title: "Email Sent!",
        description: "I've received your email and will reply shortly.",
      });
      setEmailModalData({ name: "", email: "", subject: "", message: "" });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error Sending Email",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  if (isSettingsLoading) {
    return (
      <section id="contact" className="py-24 bg-background flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Get In Touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Let's Create <span className="text-gradient">Together</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to start your next project? Drop me a message and let's
            discuss how we can bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="glass rounded-2xl p-8 border border-border/30">
            <h3 className="font-display text-2xl font-bold mb-6">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Your Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Project Type
                </label>
                <Input
                  placeholder="e.g., Brand Video, Music Video, Social Content"
                  value={formData.project}
                  onChange={(e) =>
                    setFormData({ ...formData, project: e.target.value })
                  }
                  disabled={isLoading}
                  className="bg-muted/50 border-border/50 focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Your Message
                </label>
                <Textarea
                  placeholder="Tell me about your project..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="bg-muted/50 border-border/50 focus:border-primary resize-none"
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Sending... <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-between">
            {/* Direct Contact */}
            <div className="space-y-6 mb-10">
              <h3 className="font-display text-2xl font-bold">
                Or Reach Out Directly
              </h3>

              {settings?.email && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="flex w-full text-left items-center gap-4 glass rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-colors group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email Me</p>
                        <p className="font-medium">{settings.email}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Send Me an Email</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to send an email directly to my inbox.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEmailModalSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          placeholder="Your Name"
                          value={emailModalData.name}
                          onChange={(e) => setEmailModalData({ ...emailModalData, name: e.target.value })}
                          required
                          disabled={isModalLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={emailModalData.email}
                          onChange={(e) => setEmailModalData({ ...emailModalData, email: e.target.value })}
                          required
                          disabled={isModalLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                          placeholder="Subject"
                          value={emailModalData.subject}
                          onChange={(e) => setEmailModalData({ ...emailModalData, subject: e.target.value })}
                          required
                          disabled={isModalLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea
                          placeholder="Your message..."
                          rows={4}
                          value={emailModalData.message}
                          onChange={(e) => setEmailModalData({ ...emailModalData, message: e.target.value })}
                          required
                          disabled={isModalLoading}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isModalLoading}>
                        {isModalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Email"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 glass rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium">{settings.whatsapp}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                </a>
              )}
            </div>

            {/* Social Links */}
            {settings?.socials && settings.socials.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow My Work
                </p>
                <div className="flex gap-4">
                  {settings.socials.map((social) => {
                    const Icon = getSocialIcon(social.label);
                    const colorClass = getSocialColor(social.label);
                    return (
                      <a
                        key={social.label}
                        href={social.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground transition-colors ${colorClass}`}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Response Time */}
            <div className="mt-10 glass rounded-xl p-6 border border-primary/20">
              <p className="text-primary font-medium mb-2">⚡ Quick Response</p>
              <p className="text-sm text-muted-foreground">
                I typically respond within 24 hours. For urgent projects, send a
                WhatsApp message for faster communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
