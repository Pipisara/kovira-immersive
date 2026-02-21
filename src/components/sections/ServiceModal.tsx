import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: {
        icon: LucideIcon;
        title: string;
        desc: string;
        longDesc: string;
        features: string[];
        color: string;
    } | null;
}

export function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
    if (!service) return null;

    const Icon = service.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden p-0">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 50% 0%, ${service.color}, transparent 70%)`
                    }}
                />

                <div className="relative p-8">
                    <DialogHeader className="mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative"
                            style={{ backgroundColor: `${service.color}20` }}
                        >
                            <div
                                className="absolute inset-0 blur-xl opacity-50 rounded-full"
                                style={{ backgroundColor: service.color }}
                            />
                            <Icon className="w-8 h-8 relative z-10" style={{ color: service.color }} />
                        </motion.div>

                        <DialogTitle className="text-3xl font-bold tracking-tight mb-2">
                            {service.title}
                        </DialogTitle>
                        <DialogDescription className="text-lg text-primary/80 font-medium">
                            {service.desc}
                        </DialogDescription>
                    </DialogHeader>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <p className="text-muted-foreground leading-relaxed">
                            {service.longDesc}
                        </p>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/50">
                                Key Capabilities
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {service.features.map((feature, idx) => (
                                    <motion.div
                                        key={feature}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 + idx * 0.05 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                                    >
                                        <CheckCircle2 className="w-4 h-4" style={{ color: service.color }} />
                                        <span className="text-sm font-medium">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <Button
                                className="flex-1 h-12 rounded-xl font-bold transition-all group overflow-hidden relative"
                                style={{ backgroundColor: service.color }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold transition-all"
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
