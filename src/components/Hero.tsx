import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroScene = lazy(() => import("./HeroScene"));

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <HeroScene />
      </Suspense>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-primary font-medium tracking-widest text-sm uppercase mb-4">
            Advanced IT & Digital Solutions
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          Engineering the Future
          <br />
          <span className="text-gradient">of Technology</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          From cloud infrastructure to cybersecurity, we deliver end-to-end digital solutions that transform how businesses operate and grow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#services"
            className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            Explore Our Services
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-lg border border-border text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            Talk to an Expert
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="text-muted-foreground" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
