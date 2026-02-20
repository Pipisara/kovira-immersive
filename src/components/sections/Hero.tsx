import { motion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import { scrollToSection } from "@/lib/utils";

const charVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -90 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { duration: 0.6, delay: 0.5 + i * 0.03, ease: [0.215, 0.61, 0.355, 1] },
    }),
};

function AnimatedText({ text, className }: { text: string; className?: string }) {
    return (
        <span className={className}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    custom={i}
                    variants={charVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block"
                    style={{ display: char === " " ? "inline" : "inline-block" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

export default function Hero() {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        scrollToSection(href);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* 3D Background is now fixed/global — rendered in Index.tsx */}

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

                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                    <AnimatedText text="Engineering the Future" />
                    <br />
                    <span className="text-gradient">
                        <AnimatedText text="of Technology" />
                    </span>
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                >
                    From cloud infrastructure to cybersecurity, we deliver end-to-end digital solutions that transform how businesses operate and grow.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.a
                        href="#services"
                        onClick={(e) => handleScroll(e, "#services")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="group px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary inline-flex items-center justify-center gap-2"
                    >
                        Explore Our Services
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.a>
                    <motion.a
                        href="#contact"
                        onClick={(e) => handleScroll(e, "#contact")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-8 py-3.5 rounded-lg border border-border text-foreground hover:border-primary/50 hover:text-primary transition-colors inline-flex items-center justify-center"
                    >
                        Talk to an Expert
                    </motion.a>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
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
