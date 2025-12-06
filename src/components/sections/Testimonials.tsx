import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, TrendingUp } from "lucide-react";

export const Testimonials = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-card/20">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
            Beta Program
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold mb-4 sm:mb-6 px-4">
            Help Us Build the <span className="gradient-text">Future of Discovery</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-inter leading-relaxed px-4">
            Auphere está en fase beta y tu feedback es invaluable. Únete a nuestra comunidad de early adopters y ayúdanos a crear la mejor experiencia de descubrimiento de lugares.
          </p>
        </div>

        {/* Beta Benefits */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <Card className="p-5 sm:p-6 text-center bg-card/80 backdrop-blur-sm border-border">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="font-space-grotesk font-bold text-base sm:text-lg mb-2 text-foreground">
              Free Access
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-inter">
              Full features at no cost during beta
            </p>
          </Card>

          <Card className="p-5 sm:p-6 text-center bg-card/80 backdrop-blur-sm border-border">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="font-space-grotesk font-bold text-base sm:text-lg mb-2 text-foreground">
              Shape the Future
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-inter">
              Your feedback directly influences development
            </p>
          </Card>

          <Card className="p-5 sm:p-6 text-center bg-card/80 backdrop-blur-sm border-border">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="font-space-grotesk font-bold text-base sm:text-lg mb-2 text-foreground">
              Early Adopter
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-inter">
              Be first to access new features
            </p>
          </Card>
        </div>

        {/* CTA Card */}
        <Card className="p-6 sm:p-8 lg:p-10 bg-primary/5 border-primary/20 text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-space-grotesk font-bold mb-3 sm:mb-4 text-foreground">
            ¿Quieres ser parte de nuestra historia?
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 font-inter max-w-xl mx-auto leading-relaxed">
            Esta app está construida para ti y tú puedes ayudarnos a mejorar la aplicación cada día. Usa el badge de feedback para compartir tus ideas, reportar bugs, o simplemente decirnos qué te gusta.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <a href="/explore" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-8 py-5 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Empieza a Explorar
              </Button>
            </a>
            <a href="/chat" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-2 border-foreground/20 hover:border-primary hover:bg-primary/5 bg-card/80 backdrop-blur-sm text-foreground font-inter font-semibold px-8 py-5 text-base rounded-xl transition-all duration-300 hover:scale-105"
              >
                Chat con AI
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
};
