import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Clock, Users, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "AI-Powered Recommendations",
    description: "Get personalized suggestions based on your mood, preferences, and the moment"
  },
  {
    icon: MapPin,
    title: "Discover Hidden Gems",
    description: "Find amazing places you never knew existed in your city"
  },
  {
    icon: Clock,
    title: "Real-Time Information",
    description: "See crowd levels, opening hours, and current vibes before you go"
  },
  {
    icon: Users,
    title: "Plan Group Outings",
    description: "Create complete evening plans perfect for any group size"
  }
];

export const ForUsers = () => {
  return (
    <section className="py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <Badge className="mb-4 sm:mb-6 bg-primary/15 text-foreground border-primary/30 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
            For Users
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold mb-4 sm:mb-6 px-4">
            Never Wonder
            <br />
            <span className="gradient-text">Where to Go Again</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-inter leading-relaxed px-4">
            Whether you need coffee, dinner, drinks, or adventure—Auphere finds the perfect place for your moment
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="p-5 sm:p-6 lg:p-8 bg-card/80 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-space-grotesk font-bold mb-1.5 sm:mb-2 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-inter leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center px-4">
          <a href="/explore" className="inline-block w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-8 sm:px-10 py-5 sm:py-7 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Discovering Places
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </a>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground font-inter">
            Free to use • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};
