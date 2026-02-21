import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronRight, Sparkles, ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { demoCategories, DemoCategory, SubDemo } from "../demos/liveExperienceConfig";
import DemoShell from "../demos/DemoShell";
import { CustomLabModal } from "./CustomLabModal";

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

// ─── Category Item ─────────────────────────────────────────────────────────────

function CategoryItem({
    category,
    isActive,
    onClick,
    index,
}: {
    category: DemoCategory;
    isActive: boolean;
    onClick: () => void;
    index: number;
}) {
    const Icon = category.icon;
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <button
                onClick={onClick}
                className={`w-full flex items-center gap-2 md:gap-3 py-1.5 px-2 md:p-3 rounded-xl transition-all duration-300 group relative ${isActive
                    ? `${category.accentBg} shadow-sm shadow-primary/5`
                    : "hover:bg-white/5"
                    }`}
            >
                {isActive && (
                    <motion.div
                        layoutId="activeCategoryIndicator"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}

                <div className={`w-7 h-7 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? "bg-background/50" : "bg-white/5 group-hover:bg-white/10"}`}>
                    <Icon size={14} className={isActive ? category.accentColor : "text-muted-foreground group-hover:text-foreground"} />
                </div>

                <div className="flex-1 text-left min-w-0">
                    <h4 className={`text-xs md:text-sm font-bold truncate transition-colors ${isActive ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}>
                        {category.title}
                    </h4>
                    <p className={`text-[10px] truncate transition-colors hidden md:block ${isActive ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                        {category.subtitle}
                    </p>
                </div>

                {isActive ? (
                    <motion.div
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        className={category.accentColor}
                    >
                        <ChevronRight size={14} />
                    </motion.div>
                ) : (
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                )}
            </button>
        </motion.div>
    );
}

// ─── Sub Demo Item ─────────────────────────────────────────────────────────────

function SubItem({
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            onClick={onClick}
            className={`flex items-center gap-3 w-full text-left py-2 px-3 rounded-lg transition-all duration-200 group ${isActive
                ? `${demo.accentBg} ${demo.accentColor}`
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
        >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-background/40" : "bg-white/5 group-hover:bg-white/10"}`}>
                <Icon size={12} className={isActive ? demo.accentColor : "text-muted-foreground group-hover:text-foreground"} />
            </div>
            <span className={`text-xs font-medium truncate ${isActive ? "font-bold" : ""}`}>
                {demo.title}
            </span>
            {isActive && (
                <div className={`ml-auto w-1 h-1 rounded-full ${demo.accentColor.replace('text-', 'bg-')} shadow-[0_0_8px_rgba(var(--primary),0.6)]`} />
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
    const [isCustomLabOpen, setIsCustomLabOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px -10% 0px" });
    const isManualScrolling = useRef(false);
    const activeCategoryRef = useRef(activeCategory.id);
    const stRef = useRef<any>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Initialize ScrollTrigger for category transitions
    useEffect(() => {
        if (!mounted || !wrapperRef.current) return;

        const ctx = gsap.context(() => {
            stRef.current = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=400%",
                pin: wrapperRef.current,
                pinSpacing: true,
                scrub: 1,
                anticipatePin: 1,
                refreshPriority: 10,
                onUpdate: (self) => {
                    // Skip automatic updates if we're currently smooth-scrolling from a click
                    if (isManualScrolling.current) return;

                    const progress = self.progress;
                    const totalSteps = demoCategories.length;
                    const index = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);

                    const newCat = demoCategories[index];
                    if (newCat.id !== activeCategoryRef.current) {
                        activeCategoryRef.current = newCat.id;
                        setActiveCategory(newCat);
                        setActiveDemo(newCat.demos[0]);
                    }
                }
            });

            // Call refresh after a short delay to ensure layout is stable
            setTimeout(() => ScrollTrigger.refresh(), 500);
        });

        return () => ctx.revert();
    }, [mounted]);

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

        const index = demoCategories.findIndex(c => c.id === cat.id);

        // Mark as manual scroll to prevent onUpdate from fighting with us
        isManualScrolling.current = true;

        // Update states immediately
        setActiveCategory(cat);
        setActiveDemo(cat.demos[0]);
        activeCategoryRef.current = cat.id;

        if (stRef.current) {
            ScrollTrigger.refresh();
            const st = stRef.current;
            const scrollPos = st.start + (st.end - st.start) * (index / demoCategories.length + 0.05);

            window.scrollTo({
                top: scrollPos,
                behavior: 'smooth'
            });

            // Reset manual scrolling flag after the smooth scroll is likely finished
            setTimeout(() => {
                isManualScrolling.current = false;
            }, 1000);
        } else {
            isManualScrolling.current = false;
        }
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
            className="relative bg-background z-20"
        >
            <div ref={wrapperRef} className="min-h-screen flex flex-col pt-20 md:pt-28 pb-8 lg:overflow-hidden">
                {/* Ambient background effects */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
                </div>

                <div className="max-w-[1400px] w-full mx-auto relative z-10 px-4 md:px-6 flex flex-col lg:h-full lg:max-h-screen">

                    {/* ── Section header ──────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-3 md:mb-4 shrink-0"
                    >
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                                <Sparkles size={12} className="text-primary" />
                                <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
                                    Interactive Lab
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                                Build Your <span className="text-gradient">Future Infrastructure</span>
                            </h2>
                            <p className="text-muted-foreground text-sm max-w-xl">
                                Select a solution to explore its capabilities through our real-time interactive simulation environment.
                            </p>
                        </div>

                        <div className="hidden lg:flex items-center gap-6 p-3 glass rounded-2xl border-white/5">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-foreground">v2.4.0 Stable</p>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Environment Status</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(var(--primary),0.5)]" />
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Main Layout ────────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3 md:gap-6 items-start flex-1 min-h-0">

                        {/* Navigation Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex flex-col gap-4 lg:sticky lg:top-0 order-1"
                        >
                            {/* Categories List */}
                            <div className="glass rounded-[2rem] p-2 md:p-3 border-white/5 flex flex-col gap-1 shadow-2xl overflow-y-auto max-h-none lg:max-h-[50vh] scrollbar-hide">
                                <div className="px-3 py-1 mb-1 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Modules</span>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                    </div>
                                </div>

                                {demoCategories.map((cat, i) => {
                                    const isActive = activeCategory.id === cat.id;
                                    return (
                                        <div key={cat.id} className="flex flex-col gap-1">
                                            <CategoryItem
                                                category={cat}
                                                isActive={isActive}
                                                onClick={() => handleCategoryChange(cat)}
                                                index={i}
                                            />

                                            <AnimatePresence mode="popLayout">
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="flex flex-col gap-1 ml-5 pl-4 border-l border-white/10 my-1">
                                                            {cat.demos.map((demo, di) => (
                                                                <SubItem
                                                                    key={demo.id}
                                                                    demo={demo}
                                                                    isActive={activeDemo.id === demo.id}
                                                                    onClick={() => handleDemoChange(demo)}
                                                                    index={di}
                                                                />
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Viewport Area - Reordered on mobile to follow Categories */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative group h-[50vh] lg:h-[58vh] order-2 lg:row-span-2"
                        >
                            {/* Decorative elements */}
                            <div className="absolute -inset-[1px] bg-gradient-to-br from-white/10 via-transparent to-primary/20 rounded-[2rem] -z-10 opacity-50 transition-opacity group-hover:opacity-100" />

                            <div className="h-full relative rounded-[2rem] border border-white/10 shadow-3xl overflow-hidden bg-background">
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
                                                    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                onClose={() => {
                                                    setActiveDemo(activeCategory.demos[0]);
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Loading Overlay */}
                                <AnimatePresence>
                                    {isTransitioning && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
                                        >
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-full border-2 border-primary/20" />
                                                    <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                </div>
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
                                                    Synchronizing Data...
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Info Card - Custom Lab - Reordered on mobile to follow Demo */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="order-3"
                        >
                            <div className="glass rounded-[2rem] p-5 border-white/5 relative overflow-hidden group hover:border-primary/20 transition-colors shadow-xl">
                                {/* Blueprint/Building Animation Background */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <motion.path
                                            d="M 10,10 L 90,10 L 90,90 L 10,90 Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            className="text-primary"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: [0, 1, 1, 0] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <motion.path
                                            d="M 0,20 L 100,20 M 0,40 L 100,40 M 0,60 L 100,60 M 0,80 L 100,80"
                                            stroke="currentColor"
                                            strokeWidth="0.5"
                                            className="text-primary/30"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        />
                                        <motion.path
                                            d="M 20,0 L 20,100 M 40,0 L 40,100 M 60,0 L 60,100 M 80,0 L 80,100"
                                            stroke="currentColor"
                                            strokeWidth="0.5"
                                            className="text-primary/30"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
                                        />
                                    </svg>

                                    {/* Floating building blocks */}
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-2 h-2 bg-primary/40 rounded-sm"
                                            animate={{
                                                y: [0, -40, 0],
                                                x: [0, Math.random() * 20 - 10, 0],
                                                rotate: [0, 90, 0],
                                                opacity: [0, 0.8, 0]
                                            }}
                                            transition={{
                                                duration: 3 + Math.random() * 2,
                                                repeat: Infinity,
                                                delay: i * 0.5,
                                                ease: "easeInOut"
                                            }}
                                            style={{
                                                left: `${15 + i * 15}%`,
                                                bottom: "-10%"
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-60 transition-all group-hover:scale-110 group-hover:rotate-12">
                                    <Sparkles size={24} className="text-primary" />
                                </div>
                                <div className="relative z-10">
                                    <h5 className="text-sm font-bold mb-1.5 flex items-center gap-2">
                                        Custom Lab
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                                    </h5>
                                    <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed max-w-[200px]">
                                        Build a tailored proof-of-concept for your specific use case.
                                    </p>
                                    <button
                                        onClick={() => setIsCustomLabOpen(true)}
                                        className="w-full py-2.5 px-4 bg-white/5 hover:bg-primary text-foreground hover:text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn border border-white/10 hover:border-primary shadow-sm overflow-hidden relative"
                                    >
                                        <span className="relative z-10">Request Access</span>
                                        <ChevronRight size={12} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                        <motion.div
                                            className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-100 transition-opacity"
                                            whileHover={{ x: ["-100%", "100%"] }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Maximized Overlay ────────────────── */}
                    {mounted && createPortal(
                        <AnimatePresence>
                            {isMaximized && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 md:p-6 overflow-hidden"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                        className="w-full h-full max-w-7xl flex flex-col relative shadow-3xl rounded-[2rem] overflow-hidden border border-white/10 bg-background"
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

                    {/* ── CTA / Footer ─────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="mt-auto py-2 flex flex-col items-center shrink-0"
                    >
                        <div className="glass rounded-[1.5rem] p-1 px-1 flex flex-row items-center gap-2 border-white/5 bg-white/5 pr-4 pl-1 py-1 scale-90 md:scale-100">
                            <div className="flex -space-x-2 ml-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground">
                                    +40
                                </div>
                            </div>
                            <div className="mx-2 text-left py-0 hidden sm:block">
                                <p className="text-[11px] font-bold">Join 500+ businesses</p>
                                <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Premium support</p>
                            </div>
                            <motion.a
                                href="#contact"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                Get Started
                                <ArrowLeft size={14} className="rotate-180" />
                            </motion.a>
                        </div>
                    </motion.div>
                    {/* ── Custom Lab Modal ────────────────── */}
                    <CustomLabModal
                        isOpen={isCustomLabOpen}
                        onClose={() => setIsCustomLabOpen(false)}
                    />

                </div>
            </div>
        </section>
    );
}
