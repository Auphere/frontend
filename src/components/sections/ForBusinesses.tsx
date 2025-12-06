import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, BarChart, ArrowRight, Store } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Reach More Customers",
    description: "Connect with people actively looking for places like yours at the perfect moment"
  },
  {
    icon: Target,
    title: "AI-Powered Matching",
    description: "Get recommended to users whose preferences match your venue's vibe perfectly"
  },
  {
    icon: TrendingUp,
    title: "Increase Visibility",
    description: "Stand out when it matters most—when customers are deciding where to go"
  },
  {
    icon: BarChart,
    title: "Analytics & Insights",
    description: "Understand your customers better with detailed engagement and traffic data"
  }
];

export const ForBusinesses = () => {
  return (
    <section className="py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card/30 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <Badge className="mb-4 sm:mb-6 bg-secondary/30 text-foreground border-secondary/40 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
            For Businesses
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold mb-4 sm:mb-6 px-4">
            Get Discovered by
            <br />
            <span className="gradient-text">Your Ideal Customers</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-inter leading-relaxed px-4">
            Join restaurants, cafés, bars, and venues that are connecting with customers through Auphere
          </p>
        </div>

        {/* Beta Benefits */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          <Card className="p-4 sm:p-6 lg:p-8 text-center bg-card/80 backdrop-blur-sm border-border">
            <div className="text-lg sm:text-xl md:text-2xl font-space-grotesk font-bold gradient-text mb-1 sm:mb-2">
              Early Access
            </div>
            <p className="text-[10px] sm:text-sm text-muted-foreground font-inter">
              Join the Beta
            </p>
          </Card>
          <Card className="p-4 sm:p-6 lg:p-8 text-center bg-card/80 backdrop-blur-sm border-border">
            <div className="text-lg sm:text-xl md:text-2xl font-space-grotesk font-bold gradient-text mb-1 sm:mb-2">
              Free Listing
            </div>
            <p className="text-[10px] sm:text-sm text-muted-foreground font-inter">
              No Cost
            </p>
          </Card>
          <Card className="p-4 sm:p-6 lg:p-8 text-center bg-card/80 backdrop-blur-sm border-border">
            <div className="text-lg sm:text-xl md:text-2xl font-space-grotesk font-bold gradient-text mb-1 sm:mb-2">
              AI-Powered
            </div>
            <p className="text-[10px] sm:text-sm text-muted-foreground font-inter">
              Smart Matching
            </p>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-5 sm:p-6 lg:p-8 bg-card/80 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-space-grotesk font-bold mb-1.5 sm:mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-inter leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="p-6 sm:p-8 lg:p-12 bg-primary/8 border-primary/20 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Store className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-space-grotesk font-bold text-foreground text-center">
                Ready to Grow Your Business?
              </h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 font-inter max-w-xl mx-auto leading-relaxed px-2">
              Join hundreds of venues already connecting with customers on Auphere. Get started today and watch your business grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <a 
                href="mailto:business@auphere.app?subject=List%20My%20Venue%20on%20Auphere&body=Hi%2C%0A%0AI'm%20interested%20in%20listing%20my%20venue%20on%20Auphere.%0A%0AVenue%20Name%3A%20%0ALocation%3A%20%0AType%20of%20Venue%3A%20%0A%0APlease%20contact%20me%20with%20more%20information.%0A%0AThank%20you!"
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-8 sm:px-10 py-5 sm:py-7 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  List Your Venue
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </a>
              <a 
                href="mailto:business@auphere.app?subject=Learn%20More%20About%20Auphere%20for%20Business&body=Hi%2C%0A%0AI'd%20like%20to%20learn%20more%20about%20how%20Auphere%20can%20help%20my%20business.%0A%0AVenue%20Name%3A%20%0ALocation%3A%20%0A%0APlease%20send%20me%20more%20information.%0A%0AThank%20you!"
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-foreground/20 hover:border-primary hover:bg-primary/5 bg-card/80 backdrop-blur-sm text-foreground font-inter font-semibold px-8 sm:px-10 py-5 sm:py-7 text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
