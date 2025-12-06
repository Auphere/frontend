import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mobileApp from "@/assets/app-mockup-mobile.jpg";
import desktopApp from "@/assets/app-mockup-desktop.jpg";

export const Screenshots = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-32 px-3 sm:px-4 lg:px-6 bg-card/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold mb-4 sm:mb-6">
            Beautiful on <span className="gradient-text">Every Device</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-inter">
            Seamlessly designed for desktop, tablet, and mobile experiences
          </p>
        </div>
        
        {/* Device Tabs */}
        <Tabs defaultValue="mobile" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-xs sm:max-w-md mx-auto grid-cols-2 mb-8 sm:mb-12 bg-muted/50 p-1">
            <TabsTrigger 
              value="mobile"
              className="font-inter font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg text-xs sm:text-sm"
            >
              Mobile
            </TabsTrigger>
            <TabsTrigger 
              value="desktop"
              className="font-inter font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg text-xs sm:text-sm"
            >
              Desktop
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mobile" className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="flex justify-center">
              <div className="w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border">
                <img 
                  src={mobileApp} 
                  alt="Auphere mobile application interface" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="text-center px-4">
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-inter">
                On-the-go access with intuitive mobile navigation and real-time venue updates
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="desktop" className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border">
              <img 
                src={desktopApp} 
                alt="Auphere desktop application interface" 
                className="w-full h-auto"
              />
            </div>
            <div className="text-center px-4">
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-inter">
                Full-featured desktop experience with AI chat, venue exploration, and detailed place information
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
