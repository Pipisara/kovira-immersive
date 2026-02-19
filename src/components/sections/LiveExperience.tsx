import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { demoCategories, DemoCategory, SubDemo } from "../demos/liveExperienceConfig";
import DemoShell from "../demos/DemoShell";

gsap.registerPlugin(ScrollTrigger);

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function DemoSkeleton() {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
                />
                <span className="text-xs text-muted-foreground">Loading demo…</span>
            </div>
        </div>
    );
}

// ─── Category Card ─────────────────────────────────────────────────────────────

function CategoryCard({
    category,
    isActive,
    onClick,
    index,
    isInView,
}: {
    category: DemoCategory;
    isActive: boolean;
    onClick: () => void;
    index: number;
    isInView: boolean;
}) {
    const Icon = category.icon;
    return (
        <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${isActive
                ? `${category.accentBg} shadow-lg`
                : "glass hover:border-border/80"
                }`}
        >
            {/* Active ring */}
            {isActive && (
                <motion.div
                    layoutId="categoryActiveRing"
                    className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            {/* Gradient overlay */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative z-10">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${isActive ? category.accentBg : "bg-secondary"}`}>
                    <Icon size={20} className={isActive ? category.accentColor : "text-muted-foreground"} />
                </div>
                <h3 className={`font-bold text-sm mb-0.5 transition-colors ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                    {category.title}
                </h3>
                <p className={`text-xs transition-colors ${isActive ? category.accentColor : "text-muted-foreground"}`}>
                    {category.subtitle}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {category.demos.length} interactive demos
                </p>
            </div>

            {/* Active pulse dot */}
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse"
                />
            )}
        </motion.button>
    );
}

// ─── Sub Demo Pill ─────────────────────────────────────────────────────────────

function SubDemoPill({
    demo,
    isActive,
    onClick,
    index,
}: {
    demo: SubDemo;
    isActive: boolean;
    onClick: () => void;
    index: number;
}) {
    const Icon = demo.icon;
    return (
        <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`flex items-center gap-3 w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${isActive
                ? `${demo.accentBg} shadow-md`
                : "glass hover:border-border/70"
                }`}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? demo.accentBg : "bg-secondary"}`}>
                <Icon size={15} className={isActive ? demo.accentColor : "text-muted-foreground"} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate transition-colors ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                    {demo.title}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">
                    {demo.description}
                </p>
            </div>
            {isActive && (
                <ChevronRight size={13} className={`shrink-0 ${demo.accentColor}`} />
            )}
        </motion.button>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function LiveExperience() {
    const [activeCategory, setActiveCategory] = useState<DemoCategory>(demoCategories[0]);
    const [activeDemo, setActiveDemo] = useState<SubDemo>(demoCategories[0].demos[0]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px -10% 0px" });

    // Refresh GSAP scroll triggers after mount
    useEffect(() => {
        const timer = setTimeout(() => ScrollTrigger.refresh(), 100);
        return () => clearTimeout(timer);
    }, []);

    // Handle body scroll locking when maximized
    useEffect(() => {
        if (isMaximized) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isMaximized]);

    const handleCategoryChange = (cat: DemoCategory) => {
        if (cat.id === activeCategory.id) return;
        setActiveCategory(cat);
        setActiveDemo(cat.demos[0]);
    };

    const handleDemoChange = (demo: SubDemo) => {
        if (demo.id === activeDemo.id || isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveDemo(demo);
            setIsTransitioning(false);
        }, 180);
    };

    return (
        <section
            id="live-experience"
            ref={sectionRef}
            className="section-padding relative overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/4 rounded-full blur-3xl" />
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-accent/3 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 px-4">

                {/* ── Section header ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles size={13} className="text-primary" />
                        <span className="text-xs font-medium text-primary tracking-wider uppercase">
                            Demo Lab
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Experience Our{" "}
                        <span className="text-gradient">Solutions Live</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
                        No sign-up needed. Interact with real demos of our IT solutions — right here, right now.
                    </p>
                </motion.div>

                {/* ── Level 1: Category Selector ──────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {demoCategories.map((cat, i) => (
                        <CategoryCard
                            key={cat.id}
                            category={cat}
                            isActive={activeCategory.id === cat.id}
                            onClick={() => handleCategoryChange(cat)}
                            index={i}
                            isInView={isInView}
                        />
                    ))}
                </motion.div>

                {/* ── Level 2 + 3: Sub selector + Demo viewport ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4"
                >
                    {/* Sub demo selector */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col gap-2"
                        >
                            {/* Category label */}
                            <div className="flex items-center gap-2 px-1 mb-1">
                                <div className={`w-1 h-4 rounded-full ${activeCategory.accentBg.split(" ")[0].replace("/10", "")}`} />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                    {activeCategory.title}
                                </span>
                            </div>

                            {/* Sub demo pills */}
                            {activeCategory.demos.map((demo, i) => (
                                <SubDemoPill
                                    key={demo.id}
                                    demo={demo}
                                    isActive={activeDemo.id === demo.id}
                                    onClick={() => handleDemoChange(demo)}
                                    index={i}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Demo shell */}
                    <div className="h-[480px] md:h-[520px] relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden mr-1">
                        <AnimatePresence mode="wait">
                            {!isTransitioning && (
                                <motion.div
                                    key={`${activeCategory.id}-${activeDemo.id}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    <DemoShell
                                        category={activeCategory}
                                        demo={activeDemo}
                                        onMaximize={() => setIsMaximized(true)}
                                        onMinimize={() => {
                                            // Optional: scroll back to category top
                                            sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        onClose={() => {
                                            // Optional: reset to first demo
                                            setActiveDemo(activeCategory.demos[0]);
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ── Maximized Overlay (Mobile First) ────────────────── */}
                {mounted && createPortal(
                    <AnimatePresence>
                        {isMaximized && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 overflow-hidden touch-none"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="w-[96%] h-[90%] md:w-[90%] md:h-[85%] max-w-7xl flex flex-col min-h-0 relative shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden border border-white/20 bg-background"
                                >
                                    <DemoShell
                                        category={activeCategory}
                                        demo={activeDemo}
                                        isMaximized={true}
                                        onMaximize={() => setIsMaximized(false)}
                                        onMinimize={() => setIsMaximized(false)}
                                        onClose={() => setIsMaximized(false)}
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}

                {/* ── CTA ─────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 glass rounded-2xl px-8 py-6">
                        <div className="text-left">
                            <p className="font-semibold text-foreground">
                                Want this solution for your business?
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
