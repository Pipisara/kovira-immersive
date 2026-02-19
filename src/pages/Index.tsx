import { lazy, Suspense } from "react";
import Navbar from "../components/sections/Navbar";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Services from "../components/sections/Services";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import Testimonials from "../components/sections/Testimonials";
import Contact from "../components/sections/Contact";
import Footer from "../components/sections/Footer";
import LiveExperience from "../components/sections/LiveExperience";
import TechPartners from "../components/sections/TechPartners";

// HeroScene is still lazy — it's a heavy WebGL canvas only needed for visuals
const HeroScene = lazy(() => import("../components/sections/HeroScene"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Full-page fixed WebGL background */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* All content sits above the fixed canvas */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <LiveExperience />
        <About />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <TechPartners />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
