import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";

const BrandGuide = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-space-grotesk font-bold mb-6">
              Auphere <span className="gradient-text">Brand Guide</span>
            </h1>
            <p className="text-xl text-muted-foreground font-inter max-w-3xl mx-auto mb-8">
              Complete brand system for Auphere - your intelligent nightlife companion.
              This guide covers positioning, visual identity, and usage guidelines.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-8 py-6 rounded-xl">
              <Download className="mr-2 w-5 h-5" />
              Download Brand Assets
            </Button>
          </div>
          
          {/* Brand Platform */}
          <section className="mb-20">
            <h2 className="text-4xl font-space-grotesk font-bold mb-8">Brand Platform</h2>
            
            <Card className="p-8 bg-card border-border mb-8">
              <h3 className="text-2xl font-space-grotesk font-bold mb-4">Positioning Statement</h3>
              <p className="text-lg font-inter leading-relaxed text-foreground">
                Auphere is the intelligent companion that transforms how people discover nightlife, 
                combining AI-powered personalization with curated local expertise to help you find 
                the perfect venue for any mood, any night.
              </p>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-card border-border">
                <h3 className="text-2xl font-space-grotesk font-bold mb-6">Brand Values</h3>
                <ul className="space-y-4">
                  {[
                    "Intuitive - Simple, elegant experiences that just work",
                    "Social - Connecting people with places and each other",
                    "Elegant - Sophisticated design that feels premium",
                    "Trustworthy - Reliable recommendations you can count on",
                    "Data-Driven - Smart insights powered by real information"
                  ].map((value, index) => (
                    <li key={index} className="flex items-start gap-3 font-inter">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-8 bg-card border-border">
                <h3 className="text-2xl font-space-grotesk font-bold mb-6">Personality Traits</h3>
                <div className="space-y-6">
                  <div>
                    <Badge className="mb-2 bg-primary/10 text-primary border-primary/30">
                      Warm
                    </Badge>
                    <p className="text-muted-foreground font-inter">
                      Approachable and friendly, never cold or overly technical. 
                      We're your trusted friend who knows the scene.
                    </p>
                  </div>
                  <div>
                    <Badge className="mb-2 bg-primary/10 text-primary border-primary/30">
                      Confident
                    </Badge>
                    <p className="text-muted-foreground font-inter">
                      Assured in our recommendations without being arrogant. 
                      We know what we're talking about.
                    </p>
                  </div>
                  <div>
                    <Badge className="mb-2 bg-primary/10 text-primary border-primary/30">
                      Sophisticated
                    </Badge>
                    <p className="text-muted-foreground font-inter">
                      Refined and modern, appealing to discerning urbanites who 
                      value quality experiences.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>
          
          {/* Visual Identity */}
          <section className="mb-20">
            <h2 className="text-4xl font-space-grotesk font-bold mb-8">Visual Identity</h2>
            
            {/* Logo System */}
            <Card className="p-8 bg-card border-border mb-8">
              <h3 className="text-2xl font-space-grotesk font-bold mb-6">Logo System</h3>
              <p className="text-muted-foreground font-inter mb-8">
                The Auphere logo combines a location pin with sound waves, symbolizing 
                "here" (location) and "atmosphere" (vibe). Modern, minimal, versatile.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-muted rounded-xl flex flex-col items-center gap-4">
                  <Logo variant="full" />
                  <p className="text-sm font-inter font-medium">Primary Logo</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Use for main brand applications
                  </p>
                </div>
                <div className="p-8 bg-muted rounded-xl flex flex-col items-center gap-4">
                  <Logo variant="icon" />
                  <p className="text-sm font-inter font-medium">Icon Mark</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Use for app icons, favicons, small spaces
                  </p>
                </div>
                <div className="p-8 bg-background rounded-xl flex flex-col items-center gap-4 border border-border">
                  <Logo variant="full" />
                  <p className="text-sm font-inter font-medium">On Dark</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Always ensure sufficient contrast
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Color System */}
            <Card className="p-8 bg-card border-border mb-8">
              <h3 className="text-2xl font-space-grotesk font-bold mb-6">Color System</h3>
              <p className="text-muted-foreground font-inter mb-8">
                Warm, sophisticated palette inspired by urban nightlife. Deep backgrounds 
                evoke evening atmosphere, while coral accents add energy and warmth.
              </p>
              
              <div className="space-y-4">
                {[
                  { name: "Primary Coral", value: "hsl(18, 94%, 63%)", hex: "#FF8C42", usage: "CTA buttons, links, key highlights", bg: "bg-primary" },
                  { name: "Secondary Sand", value: "hsl(32, 28%, 75%)", hex: "#D4BBA8", usage: "Secondary elements, subtle accents", bg: "bg-secondary" },
                  { name: "Night Background", value: "hsl(222, 47%, 5%)", hex: "#070B15", usage: "Primary background, deep surfaces", bg: "bg-background" },
                  { name: "Card Surface", value: "hsl(222, 38%, 8%)", hex: "#0D1219", usage: "Elevated cards, panels", bg: "bg-card" },
                  { name: "Muted Surface", value: "hsl(222, 30%, 12%)", hex: "#16191F", usage: "Subtle backgrounds, disabled states", bg: "bg-muted" },
                ].map((color) => (
                  <div key={color.name} className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
                    <div className={`w-20 h-20 rounded-lg ${color.bg} flex-shrink-0 shadow-lg border border-border`} />
                    <div className="flex-1">
                      <h4 className="font-space-grotesk font-bold text-lg mb-1">{color.name}</h4>
                      <p className="text-sm text-muted-foreground font-inter mb-2">{color.usage}</p>
                      <div className="flex gap-4 text-xs font-mono">
                        <span className="text-muted-foreground">{color.value}</span>
                        <span className="text-muted-foreground">{color.hex}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Typography */}
            <Card className="p-8 bg-card border-border">
              <h3 className="text-2xl font-space-grotesk font-bold mb-6">Typography</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-space-grotesk font-bold mb-4 text-primary">
                    Space Grotesk - Headlines
                  </h4>
                  <div className="space-y-4">
                    <div className="text-5xl font-space-grotesk font-bold">Aa</div>
                    <p className="text-muted-foreground font-inter">
                      Modern geometric sans-serif. Use for all headings, hero text, and brand statements. 
                      Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-8">
                  <h4 className="text-lg font-space-grotesk font-bold mb-4 text-primary">
                    Inter - Body Text
                  </h4>
                  <div className="space-y-4">
                    <div className="text-5xl font-inter font-normal">Aa</div>
                    <p className="text-muted-foreground font-inter">
                      Clean, highly readable sans-serif optimized for screens. Use for all body text, 
                      UI elements, and secondary content. Weights: 300 (Light), 400 (Regular), 500 (Medium), 
                      600 (SemiBold), 700 (Bold)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>
          
          {/* Usage Guidelines */}
          <section>
            <h2 className="text-4xl font-space-grotesk font-bold mb-8">Usage Guidelines</h2>
            
            <Card className="p-8 bg-card border-border">
              <h3 className="text-2xl font-space-grotesk font-bold mb-6">Dos and Don'ts</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-space-grotesk font-bold text-lg mb-4 text-success">
                    ✓ Do
                  </h4>
                  <ul className="space-y-3 text-muted-foreground font-inter">
                    <li>• Maintain clear space around the logo</li>
                    <li>• Use approved color combinations</li>
                    <li>• Keep text hierarchy consistent</li>
                    <li>• Use high-resolution assets</li>
                    <li>• Follow the brand personality in copy</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-space-grotesk font-bold text-lg mb-4 text-destructive">
                    ✗ Don't
                  </h4>
                  <ul className="space-y-3 text-muted-foreground font-inter">
                    <li>• Distort or rotate the logo</li>
                    <li>• Use unapproved color combinations</li>
                    <li>• Mix different font weights randomly</li>
                    <li>• Place logo on busy backgrounds</li>
                    <li>• Adopt overly casual or technical tone</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrandGuide;
