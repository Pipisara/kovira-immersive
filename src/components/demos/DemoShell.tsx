import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { DemoCategory, SubDemo } from "./liveExperienceConfig";

interface DemoShellProps {
    category: DemoCategory;
    demo: SubDemo;
}

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

export default function DemoShell({ category, demo }: DemoShellProps) {
    const CategoryIcon = category.icon;
    const DemoIcon = demo.icon;
    const DemoComponent = demo.component;

    return (
        <div className="flex flex-col h-full">
            {/* ── Shell header ─────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-3 glass rounded-t-2xl border-b border-border/30">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                        <CategoryIcon size={12} className={category.accentColor} />
                        <span className="hidden sm:inline truncate">{category.title}</span>
                        <ChevronRight size={10} className="shrink-0 opacity-50" />
                        <DemoIcon size={12} className={demo.accentColor} />
                        <span className="font-medium text-foreground/80 truncate">{demo.title}</span>
                    </div>
                </div>

                {/* Window chrome dots */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-border/60" />
                    <div className="w-2 h-2 rounded-full bg-border/60" />
                    <div className="w-2 h-2 rounded-full bg-border/60" />
                </div>
            </div>

            {/* ── Demo content area ─────────────────────────────────── */}
            <div className="glass rounded-b-2xl border-t-0 flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={demo.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="h-full p-4 md:p-5"
                    >
                        <Suspense fallback={<DemoSkeleton />}>
                            <DemoComponent />
                        </Suspense>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
