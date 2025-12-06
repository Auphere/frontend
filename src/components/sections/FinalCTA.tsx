import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card/20 to-background">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold mb-4 sm:mb-6 px-4">
          Ready to Find
          <br />
          <span className="gradient-text">Your Perfect Place?</span>
        </h2>
        
        <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 font-inter max-w-2xl mx-auto leading-relaxed px-4">
          Start your journey with AI-powered place discovery • Free Beta Access
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 max-w-md sm:max-w-none mx-auto">
          <a href="/explore" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-8 sm:px-10 py-5 sm:py-7 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Exploring
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </a>
          
          <a href="/chat" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full border-2 border-foreground/20 hover:border-primary hover:bg-primary/5 bg-card/80 backdrop-blur-sm text-foreground font-inter font-semibold px-8 sm:px-10 py-5 sm:py-7 text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              Chat with AI
            </Button>
          </a>
        </div>
        
        {/* Beta Value Props */}
        <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-border">
          <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-space-grotesk font-bold gradient-text mb-1 sm:mb-2">
                AI-Powered
              </div>
              <p className="text-[10px] sm:text-sm text-muted-foreground font-inter">
                Smart Discovery
              </p>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-space-grotesk font-bold gradient-text mb-1 sm:mb-2">
                Free Beta
              </div>
              <p className="text-[10px] sm:text-sm text-muted-foreground font-inter">
                No Cost Access
              </p>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-space-grotesk font-bold gradient-text mb-1 sm:mb-2">
                Always Growing
              </div>
              <p className="text-[10px] sm:text-sm text-muted-foreground font-inter">
                Expanding Daily
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
