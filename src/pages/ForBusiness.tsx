import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, TrendingUp, Sparkles, BarChart3, Clock, Users, Lightbulb, CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

const ForBusiness = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    venueName: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24-48 hours.",
    });
    setFormData({ venueName: "", email: "", phone: "", message: "" });
  };

  const benefits = [
    {
      icon: Users,
      title: "Reach New Customers",
      description: "Connect with people actively searching for places like yours at the exact moment they're deciding where to go."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Visibility",
      description: "Our AI matches your venue with the perfect customers based on their preferences, mood, and occasion."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Understand your audience better with detailed analytics about when people discover and visit your venue."
    },
    {
      icon: Clock,
      title: "Free During Beta",
      description: "Join now and enjoy free listing during our beta phase. Help shape the platform and get priority support."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your business account and verify your venue in minutes."
    },
    {
      number: "02",
      title: "Get Listed",
      description: "Add your venue details, photos, hours, and what makes you special."
    },
    {
      number: "03",
      title: "Start Growing",
      description: "Appear in AI recommendations and connect with customers looking for places like yours."
    }
  ];

  const venueTypes = [
    { icon: "🍽️", name: "Restaurants" },
    { icon: "☕", name: "Cafés" },
    { icon: "🍺", name: "Bars & Pubs" },
    { icon: "🎵", name: "Nightclubs" },
    { icon: "🏨", name: "Hotels" },
    { icon: "🎪", name: "Event Spaces" }
  ];

  const faqs = [
    {
      question: "How much does it cost?",
      answer: "Auphere is completely free during our beta phase. We want to work closely with early partners to build the best platform possible. Future pricing will be competitive and transparent, with advance notice to all beta participants."
    },
    {
      question: "How does AI matching work?",
      answer: "Our AI analyzes customer preferences, occasion, group size, time of day, and mood to recommend venues that perfectly match their needs. Your venue appears when it's the right fit, ensuring high-quality, relevant exposure."
    },
    {
      question: "What information do I need to provide?",
      answer: "Basic information includes venue name, location, type, hours, contact details, and photos. You can also add amenities, special features, and what makes your venue unique to help our AI make better recommendations."
    },
    {
      question: "Can I update my listing anytime?",
      answer: "Yes! You have full control over your listing and can update information, photos, hours, and special offers anytime through your business dashboard."
    },
    {
      question: "How do customers find my venue?",
      answer: "Customers discover venues through our AI chat assistant, explore page filters, and personalized recommendations. Our AI surfaces your venue when it matches what customers are looking for."
    },
    {
      question: "What support do you offer?",
      answer: "Beta partners receive priority support via email. We typically respond within 24-48 hours and work closely with early partners to address questions and incorporate feedback."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-primary/20 text-foreground border-primary/30">For Businesses</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            Grow Your Business with Auphere
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with customers actively looking for places like yours. Get discovered through AI-powered recommendations at the exact moment they're deciding where to go.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
              <Building2 className="w-5 h-5" />
              List Your Venue
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
              <Mail className="w-5 h-5" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Auphere?</h2>
            <p className="text-muted-foreground text-lg">Join the future of place discovery and connect with your ideal customers</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-2xl mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-muted-foreground text-lg">We help all types of venues connect with customers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {venueTypes.map((type, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{type.icon}</div>
                <p className="font-medium">{type.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 sm:p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-primary text-primary-foreground">Beta Benefits</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Early Access Advantages</h2>
              <p className="text-muted-foreground text-lg">Join now and get exclusive benefits</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Free Listing</h4>
                  <p className="text-sm text-muted-foreground">Complete access during beta phase at no cost</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Priority Support</h4>
                  <p className="text-sm text-muted-foreground">Direct line to our team for questions and feedback</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Shape the Platform</h4>
                  <p className="text-sm text-muted-foreground">Your feedback helps build features that matter</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Grandfathered Pricing</h4>
                  <p className="text-sm text-muted-foreground">Special rates when we launch paid plans</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know about listing your venue</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg px-6 border">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg">Fill out the form below and we'll get back to you within 24-48 hours</p>
          </div>
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="venueName">Venue Name *</Label>
                <Input
                  id="venueName"
                  required
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  placeholder="Your venue name"
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
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <Label htmlFor="message">Tell us about your venue *</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="What type of venue do you have? What makes it special?"
                  rows={5}
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
      </section>

      <Footer />
    </div>
  );
};

export default ForBusiness;
