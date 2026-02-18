import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Monitor, BarChart3, Globe, ChevronRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PosDemo = lazy(() => import("../demos/pos/PosDemo"));
const DashboardDemo = lazy(() => import("../demos/dashboard/DashboardDemo"));
const SampleSiteDemo = lazy(() => import("../demos/websites/SampleSiteDemo"));

type DemoId = "pos" | "dashboard" | "website";

interface DemoOption {
    id: DemoId;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    accentBg: string;
}

const demos: DemoOption[] = [
    {
        id: "pos",
        icon: Monitor,
        title: "POS System",
        subtitle: "Point of Sale",
        description: "Add products, manage cart, apply discounts, and process checkout.",
        color: "text-primary",
        accentBg: "bg-primary/10 border-primary/30",
    },
    {
        id: "dashboard",
        icon: BarChart3,
        title: "Business Dashboard",
        subtitle: "Analytics & Reports",
        description: "Live KPIs, sales charts, and order management at a glance.",
        color: "text-accent",
        accentBg: "bg-accent/10 border-accent/30",
    },
    {
        id: "website",
        icon: Globe,
        title: "Sample Website",
        subtitle: "Web Development",
        description: "A fully interactive restaurant site with booking functionality.",
        color: "text-purple-400",
        accentBg: "bg-purple-500/10 border-purple-500/30",
    },
];

function DemoSkeleton() {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
                />
                <span className="text-xs text-muted-foreground">Loading demo...</span>
            </div>
        </div>
    );
}

export default function LiveExperience() {
    const [activeDemo, setActiveDemo] = useState<DemoId>("pos");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px -10% 0px" });

    // After this section mounts, tell GSAP to recalculate all scroll trigger
    // positions — this ensures Services (and any other pinned sections) use
    // the correct page height that includes LiveExperience's content.
    useEffect(() => {
        // Small delay to let the browser finish layout
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleDemoChange = (id: DemoId) => {
        if (id === activeDemo || isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveDemo(id);
            setIsTransitioning(false);
        }, 200);
    };

    const activeDemoOption = demos.find((d) => d.id === activeDemo)!;

    return (
        <section
            id="live-experience"
            ref={sectionRef}
            className="section-padding relative overflow-hidden"
        >
            {/* Ambient glow background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles size={13} className="text-primary" />
                        <span className="text-xs font-medium text-primary tracking-wider uppercase">
                            Try It Live
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Experience Our{" "}
                        <span className="text-gradient">Systems Live</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
                        No sign-up needed. Interact with real demos of our solutions — right here, right now.
                    </p>
                </motion.div>

                {/* Demo selector cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
                >
                    {demos.map((demo, i) => {
                        const Icon = demo.icon;
                        const isActive = activeDemo === demo.id;
                        return (
                            <motion.button
                                key={demo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDemoChange(demo.id)}
                                className={`relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${isActive
                                    ? `${demo.accentBg} shadow-lg`
                                    : "glass hover:border-border/80"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/30"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isActive ? demo.accentBg : "bg-secondary"
                                    }`}>
                                    <Icon size={20} className={isActive ? demo.color : "text-muted-foreground"} />
                                </div>
                                <h3 className={`font-semibold text-sm mb-0.5 ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                                    {demo.title}
                                </h3>
                                <p className={`text-xs mb-2 ${isActive ? demo.color : "text-muted-foreground"}`}>
                                    {demo.subtitle}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {demo.description}
                                </p>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Demo viewport */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative"
                >
                    {/* Viewport header */}
                    <div className="flex items-center justify-between px-4 py-3 glass rounded-t-2xl border-b border-border/30">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`} />
                            <span className="text-xs font-medium text-muted-foreground">
                                {activeDemoOption.title} — Interactive Demo
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-border/60" />
                            <div className="w-2 h-2 rounded-full bg-border/60" />
                            <div className="w-2 h-2 rounded-full bg-border/60" />
                        </div>
                    </div>

                    {/* Demo content area */}
                    <div className="glass rounded-b-2xl border-t-0 p-4 md:p-6 h-[480px] md:h-[520px] overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            {!isTransitioning && (
                                <motion.div
                                    key={activeDemo}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="h-full"
                                >
                                    <Suspense fallback={<DemoSkeleton />}>
                                        {activeDemo === "pos" && <PosDemo />}
                                        {activeDemo === "dashboard" && <DashboardDemo />}
                                        {activeDemo === "website" && <SampleSiteDemo />}
                                    </Suspense>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="mt-10 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 glass rounded-2xl px-8 py-6">
                        <div className="text-left">
                            <p className="font-semibold text-foreground">
                                Want this system for your business?
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                We'll build it tailored to your exact needs — in weeks, not months.
                            </p>
                        </div>
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-primary"
                        >
                            Talk to an Expert
                            <ChevronRight size={16} />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
