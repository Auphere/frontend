import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 sm:pt-16 lg:pt-20">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background/70" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 text-center">
        {/* Tagline */}
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 animate-fade-in-delay">
          <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <span className="text-[10px] sm:text-sm font-inter font-semibold tracking-wider uppercase text-foreground">
            Your AI-Powered Place Discovery Companion
          </span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-space-grotesk font-bold mb-4 sm:mb-8 animate-slide-up px-2">
          <span className="gradient-text">
            Find Your Perfect Place
          </span>
          <br />
          <span className="text-foreground">
            For Every Moment
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 animate-slide-up font-inter leading-relaxed px-4">
          Discover restaurants, cafés, bars, and more with AI-powered recommendations tailored to your mood, preferences, and the moment.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-slide-up px-4 max-w-md sm:max-w-none mx-auto">
          <a href="/explore" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Exploring
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </a>
          
          <a href="/chat" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full border-2 border-foreground/20 hover:border-primary hover:bg-primary/5 bg-card/80 backdrop-blur-sm text-foreground font-inter font-semibold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              Chat with AI
            </Button>
          </a>
        </div>
        
        {/* Beta Badge */}
        <div className="mt-8 sm:mt-12 animate-fade-in-delay flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground font-inter">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <span>Be among the first to discover • Free Beta Access</span>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground font-inter hidden sm:block">Scroll to explore</span>
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-primary" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
};
