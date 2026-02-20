import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, ChevronRight, Send } from "lucide-react";

interface CustomLabModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CustomLabModal({ isOpen, onClose }: CustomLabModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isBuilding, setIsBuilding] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate initial validation/sending
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        setIsBuilding(true);

        // Simulate "Building" process
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsBuilding(false);
        setSubmitted(true);

        console.log("Form submitted and lab built");
    };

    const handleReset = () => {
        setSubmitted(false);
        setIsBuilding(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-background/80 backdrop-blur-3xl border-white/10 shadow-3xl overflow-hidden min-h-[500px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {!isBuilding && !submitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            className="space-y-6 py-4"
                        >
                            <DialogHeader>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 relative group">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Sparkles className="text-primary w-6 h-6 relative z-10" />
                                </div>
                                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Custom Lab Request
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground text-sm">
                                    Tell us about your project requirements and we'll build a tailored proof-of-concept for you.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1,
                                                delayChildren: 0.1
                                            }
                                        }
                                    }}
                                    className="space-y-4"
                                >
                                    <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Full Name</Label>
                                            <motion.div whileTap={{ scale: 0.995 }}>
                                                <Input id="name" placeholder="John Doe" required className="bg-white/5 border-white/10 h-11 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" />
                                            </motion.div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Work Email</Label>
                                            <motion.div whileTap={{ scale: 0.995 }}>
                                                <Input id="email" type="email" placeholder="john@company.com" required className="bg-white/5 border-white/10 h-11 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" />
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <Label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Company / Project</Label>
                                            <motion.div whileTap={{ scale: 0.995 }}>
                                                <Input id="company" placeholder="Acme Inc." required className="bg-white/5 border-white/10 h-11 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" />
                                            </motion.div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <Label htmlFor="industry" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Target Industry</Label>
                                            <motion.div whileTap={{ scale: 0.995 }}>
                                                <Input id="industry" placeholder="e.g. Fintech" required className="bg-white/5 border-white/10 h-11 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" />
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-2 group">
                                        <Label htmlFor="objective" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Core Objective</Label>
                                        <motion.div whileTap={{ scale: 0.995 }}>
                                            <Textarea
                                                id="objective"
                                                placeholder="What are you trying to achieve with this POC?"
                                                className="bg-white/5 border-white/10 min-h-[80px] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                                                required
                                            />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <Label htmlFor="capacity" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">User Capacity</Label>
                                            <motion.div whileTap={{ scale: 0.995 }}>
                                                <Input id="capacity" placeholder="e.g. 500+" className="bg-white/5 border-white/10 h-11 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" />
                                            </motion.div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <Label htmlFor="timeline" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Desired Timeline</Label>
                                            <motion.div whileTap={{ scale: 0.995 }}>
                                                <Input id="timeline" placeholder="e.g. 2 weeks" className="bg-white/5 border-white/10 h-11 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                <DialogFooter className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
                                    >
                                        <AnimatePresence mode="wait">
                                            {loading ? (
                                                <motion.div
                                                    key="loading"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -20, opacity: 0 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Initializing...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="ready"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -20, opacity: 0 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    Request Access
                                                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </DialogFooter>
                            </form>
                        </motion.div>
                    ) : isBuilding ? (
                        <motion.div
                            key="building"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-10 space-y-8"
                        >
                            <div className="relative w-32 h-32">
                                {/* Building Blocks Animation */}
                                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2">
                                    {[...Array(9)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, opacity: 0, y: 20 }}
                                            animate={{
                                                scale: [0, 1, 1, 1],
                                                opacity: [0, 1, 1, 0.5],
                                                y: 0,
                                                backgroundColor: i % 2 === 0 ? "var(--primary)" : "rgba(var(--primary), 0.3)"
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.1,
                                                ease: "easeInOut"
                                            }}
                                            className="rounded-md shadow-lg shadow-primary/10"
                                        />
                                    ))}
                                </div>
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 border border-primary/20 rounded-full border-dashed"
                                />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold tracking-tight">Building Your Lab</h3>
                                <p className="text-xs text-muted-foreground animate-pulse tracking-widest uppercase font-bold">
                                    Synthesizing Infrastructure...
                                </p>
                            </div>
                            <div className="w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: "easeInOut" }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center text-center space-y-6"
                        >
                            <motion.div
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-2 border border-primary/20 relative"
                            >
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                                <CheckCircle2 className="text-primary w-10 h-10 relative z-10" />
                            </motion.div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">Request Received!</h3>
                                <p className="text-muted-foreground text-sm max-w-[300px] mx-auto">
                                    Your custom environment blueprint has been generated. Our team will contact you within 24 hours.
                                </p>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="border-white/10 hover:bg-white/5 px-8 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    Close Window
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
