import { Search, MessageSquare, MapPinCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Explore Curated Places",
    description: "Browse restaurants, bars, cafés, and activities. Filter by vibe, category, crowd level, and more to find your perfect match for any moment.",
    color: "text-primary"
  },
  {
    icon: MessageSquare,
    title: "Chat with Auphere AI",
    description: "Not sure what you're looking for? Describe your mood and preferences, and our AI will recommend the perfect place—whether it's dinner, drinks, or adventure.",
    color: "text-secondary"
  },
  {
    icon: MapPinCheck,
    title: "Plan Complete Evenings",
    description: "Get AI-generated multi-stop plans tailored to your vibe. Dinner, drinks, and more—all perfectly timed and located for a seamless experience.",
    color: "text-accent"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold mb-4 sm:mb-6 px-4">
            How <span className="gradient-text">Auphere</span> Works
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-inter leading-relaxed px-4">
            Three simple steps to discover your next great experience
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="relative p-5 sm:p-6 lg:p-8 bg-card/80 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2 group"
            >
              {/* Step Number */}
              <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-space-grotesk font-bold text-lg sm:text-xl shadow-lg">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 sm:mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2} />
              </div>
              
              {/* Content */}
              <h3 className="text-lg sm:text-xl lg:text-2xl font-space-grotesk font-bold mb-2 sm:mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-inter leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
