import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const colors = [
  { name: "Primary", value: "hsl(18, 94%, 63%)", bg: "bg-primary" },
  { name: "Secondary", value: "hsl(32, 28%, 75%)", bg: "bg-secondary" },
  { name: "Background", value: "hsl(222, 47%, 5%)", bg: "bg-background" },
  { name: "Card", value: "hsl(222, 38%, 8%)", bg: "bg-card" },
  { name: "Muted", value: "hsl(222, 30%, 12%)", bg: "bg-muted" },
];

export const BrandSystem = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6">
            Our <span className="gradient-text">Brand System</span>
          </h2>
          <p className="text-lg text-muted-foreground font-inter">
            Sophisticated, warm, and modern design language
          </p>
        </div>
        
        <div className="space-y-16">
          {/* Logo Variants */}
          <div>
            <h3 className="text-2xl font-space-grotesk font-bold mb-8">Logo Variants</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 bg-card border-border flex flex-col items-center justify-center gap-4">
                <Logo variant="full" />
                <p className="text-sm text-muted-foreground font-inter">Full Logo</p>
              </Card>
              <Card className="p-8 bg-card border-border flex flex-col items-center justify-center gap-4">
                <Logo variant="icon" />
                <p className="text-sm text-muted-foreground font-inter">Icon Only</p>
              </Card>
              <Card className="p-8 bg-background border-border flex flex-col items-center justify-center gap-4">
                <Logo variant="full" />
                <p className="text-sm text-muted-foreground font-inter">On Dark</p>
              </Card>
            </div>
          </div>
          
          {/* Color Palette */}
          <div>
            <h3 className="text-2xl font-space-grotesk font-bold mb-8">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {colors.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div className={`w-full h-32 rounded-xl ${color.bg} border border-border shadow-lg`} />
                  <div>
                    <p className="font-inter font-semibold">{color.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{color.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Typography */}
          <div>
            <h3 className="text-2xl font-space-grotesk font-bold mb-8">Typography</h3>
            <Card className="p-8 bg-card border-border space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2 font-inter">Headings - Space Grotesk</p>
                <h1 className="text-5xl font-space-grotesk font-bold">Heading 1</h1>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2 font-inter">Body - Inter</p>
                <p className="text-lg font-inter">
                  Clean, highly readable sans-serif for body text. Optimized for screens with excellent legibility.
                </p>
              </div>
            </Card>
          </div>
          
          {/* Brand Values */}
          <div>
            <h3 className="text-2xl font-space-grotesk font-bold mb-8">Brand Values</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="px-6 py-3 text-base border-primary/30 bg-primary/10 text-primary font-inter font-medium">
                Intuitive
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-base border-secondary/30 bg-secondary/10 text-secondary-foreground font-inter font-medium">
                Social
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-base border-primary/30 bg-primary/10 text-primary font-inter font-medium">
                Elegant
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-base border-secondary/30 bg-secondary/10 text-secondary-foreground font-inter font-medium">
                Trustworthy
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-base border-primary/30 bg-primary/10 text-primary font-inter font-medium">
                Data-Driven
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
