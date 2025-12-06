import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ForUsers } from "@/components/sections/ForUsers";
import { ForBusinesses } from "@/components/sections/ForBusinesses";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/Footer";
import { BetaBadge } from "@/components/BetaBadge";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <ForUsers />
        <ForBusinesses />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <BetaBadge />
    </div>
  );
};

export default Index;
