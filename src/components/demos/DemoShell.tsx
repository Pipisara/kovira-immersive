import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Maximize, Minimize2 } from "lucide-react";
import { DemoCategory, SubDemo } from "./liveExperienceConfig";

interface DemoShellProps {
    category: DemoCategory;
    demo: SubDemo;
    isMaximized?: boolean;
    onMaximize?: () => void;
    onMinimize?: () => void;
    onClose?: () => void;
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

export default function DemoShell({
    category,
    demo,
    isMaximized,
    onMaximize,
    onMinimize,
    onClose
}: DemoShellProps) {
    const CategoryIcon = category.icon;
    const DemoIcon = demo.icon;
    const DemoComponent = demo.component;

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden relative">
            {/* ── Shell header ─────────────────────────────────────── */}
            <div className={`flex items-center justify-between px-4 py-2.5 glass border-b border-border/30 transition-all sticky top-0 z-[60] ${isMaximized ? 'bg-background/90' : ''}`}>
                {/* Breadcrumb */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    <div className="flex items-center gap-1.5 text-[11px] md:text-sm text-muted-foreground min-w-0 font-bold uppercase tracking-tight">
                        <CategoryIcon size={14} className={category.accentColor} />
                        <span className="hidden xs:inline truncate opacity-60">{category.title}</span>
                        <ChevronRight size={10} className="shrink-0 opacity-40" />
                        <DemoIcon size={14} className={demo.accentColor} />
                        <span className="text-foreground truncate">{demo.title}</span>
                    </div>
                </div>

                {/* Window chrome buttons */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Minimize (Yellow) */}
                    {!isMaximized && (
                        <button
                            onClick={onMinimize}
                            title="Minimize"
                            className="w-3 h-3 rounded-full bg-amber-400/90 hover:bg-amber-400 transition-colors border border-amber-500/30"
                        />
                    )}
                    {/* Maximize/Restore (Green) */}
                    <button
                        onClick={onMaximize}
                        title={isMaximized ? "Restore" : "Maximize view"}
                        className={`${isMaximized ? 'w-4 h-4' : 'w-3 h-3'} rounded-full bg-emerald-500/90 hover:bg-emerald-500 transition-colors border border-emerald-600/30`}
                    />
                    {/* Close (Red) */}
                    <button
                        onClick={onClose}
                        title="Close demo"
                        className={`${isMaximized ? 'w-4 h-4' : 'w-3 h-3'} rounded-full bg-rose-500/90 hover:bg-rose-500 transition-colors border border-rose-600/30`}
                    />
                </div>
            </div>

            {/* ── Demo content area ─────────────────────────────────── */}
            <div className="flex-1 overflow-hidden relative group/shell">
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.4)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onMaximize}
                    className="absolute bottom-6 right-6 z-[70] w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/50 transition-all opacity-0 group-hover/shell:opacity-100 shadow-2xl backdrop-blur-2xl group/btn overflow-hidden"
                    title={isMaximized ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {/* Animated Glow Background */}
                    <div className="absolute inset-0 bg-primary/0 group-hover/btn:bg-primary/10 transition-colors duration-300" />

                    {/* Pulse Ring */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-primary/20 rounded-2xl pointer-events-none"
                    />

                    <div className="relative z-10">
                        {isMaximized ? <Minimize2 size={20} /> : <Maximize size={20} />}
                    </div>
                </motion.button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={demo.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className={`h-full ${isMaximized ? 'p-0' : 'p-4 md:p-5'}`}
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
