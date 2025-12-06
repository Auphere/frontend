import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Building2, HelpCircle, MessageSquare, Clock, Instagram, Twitter, Facebook, ArrowRight, Sparkles, Search, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.message.length > 1000) {
      toast({
        title: "Message too long",
        description: "Please keep your message under 1000 characters.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24-48 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "General Inquiries",
      value: "contact@auphere.app",
      href: "mailto:contact@auphere.app"
    },
    {
      icon: Building2,
      label: "Business & Partnerships",
      value: "business@auphere.app",
      href: "mailto:business@auphere.app"
    },
    {
      icon: HelpCircle,
      label: "Support",
      value: "support@auphere.app",
      href: "mailto:support@auphere.app"
    }
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/auphere" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/auphere" },
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/auphere" }
  ];

  const quickLinks = [
    { icon: Building2, label: "List Your Venue", description: "Join as a business partner", href: "/for-business" },
    { icon: Sparkles, label: "Brand Guide", description: "Learn about our brand", href: "/brand-guide" },
    { icon: MessageSquare, label: "Give Feedback", description: "Help us improve Auphere", href: "#", onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question, feedback, or just want to say hello, drop us a message.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        maxLength={255}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="business">Business Partnership</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      maxLength={1000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{formData.message.length}/1000 characters</p>
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2">
                    Send Message
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.href}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-0.5">{info.label}</p>
                        <p className="text-sm text-muted-foreground truncate">{info.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </Card>

              {/* Response Time */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24-48 hours during business days.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Looking for something specific?</h2>
            <p className="text-muted-foreground">Quick links to common requests</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              link.href === "#" ? (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="block"
                >
                  <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/50 text-left h-full">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <link.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{link.label}</h3>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Card>
                </button>
              ) : (
                <Link key={index} to={link.href}>
                  <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/50 h-full">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <link.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{link.label}</h3>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
