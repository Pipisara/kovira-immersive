import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const HeroScene = lazy(() => import("../components/HeroScene"));

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
        <About />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
