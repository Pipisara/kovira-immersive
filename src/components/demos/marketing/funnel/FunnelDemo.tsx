import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Eye, MousePointer, ShoppingCart, CheckCircle2, TrendingUp } from "lucide-react";

interface FunnelStage {
    id: string;
    label: string;
    icon: React.ElementType;
    count: number;
    color: string;
    bgColor: string;
    borderColor: string;
    convRate: string;
}

const stages: FunnelStage[] = [
    { id: "awareness", label: "Awareness", icon: Eye, count: 48200, color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/40", convRate: "100%" },
    { id: "interest", label: "Interest", icon: MousePointer, count: 18600, color: "text-indigo-400", bgColor: "bg-indigo-500/20", borderColor: "border-indigo-500/40", convRate: "38.6%" },
    { id: "consideration", label: "Consideration", icon: Users, count: 7200, color: "text-violet-400", bgColor: "bg-violet-500/20", borderColor: "border-violet-500/40", convRate: "38.7%" },
    { id: "intent", label: "Intent", icon: ShoppingCart, count: 2100, color: "text-pink-400", bgColor: "bg-pink-500/20", borderColor: "border-pink-500/40", convRate: "29.2%" },
    { id: "conversion", label: "Conversion", icon: CheckCircle2, count: 742, color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/40", convRate: "35.3%" },
];

function AnimatedCount({ target }: { target: number }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let v = 0;
        const step = target / 50;
        const t = setInterval(() => {
            v += step;
            if (v >= target) { setCount(target); clearInterval(t); }
            else setCount(Math.floor(v));
        }, 20);
        return () => clearInterval(t);
    }, [target]);
    return <>{count.toLocaleString()}</>;
}

export default function FunnelDemo() {
    const [selected, setSelected] = useState<FunnelStage | null>(null);
    const maxCount = stages[0].count;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-3 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-foreground">Lead Funnel</h3>
                    <p className="text-xs text-muted-foreground">Q1 2025 — All Sources</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400">
                    <TrendingUp size={11} /> 1.54% overall CVR
                </div>
            </div>

            {/* Funnel visualization */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Funnel bars */}
                <div className="flex-1 flex flex-col justify-between gap-2 py-1">
                    {stages.map((stage, i) => {
                        const Icon = stage.icon;
                        const widthPct = (stage.count / maxCount) * 100;
                        const isSelected = selected?.id === stage.id;
                        return (
                            <motion.button
                                key={stage.id}
                                onClick={() => setSelected(isSelected ? null : stage)}
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 cursor-pointer rounded-xl border transition-all p-2 ${isSelected ? `${stage.bgColor} ${stage.borderColor}` : "border-transparent hover:border-border/40"}`}>
                                {/* Bar */}
                                <div className="flex-1 relative h-8 flex items-center">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${widthPct}%` }}
                                        transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
                                        className={`h-full rounded-lg ${stage.bgColor} border ${stage.borderColor} flex items-center px-3 gap-2 min-w-[80px]`}>
                                        <Icon size={12} className={stage.color} />
                                        <span className={`text-xs font-medium ${stage.color}`}>{stage.label}</span>
                                    </motion.div>
                                </div>
                                {/* Count */}
                                <div className="text-right shrink-0 w-20">
                                    <div className={`text-sm font-bold ${stage.color}`}>
                                        <AnimatedCount target={stage.count} />
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">{stage.convRate}</div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Detail panel */}
                <div className="w-32 glass rounded-xl p-3 flex flex-col gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        {selected ? "Stage Detail" : "Overview"}
                    </span>
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-2">
                                <div className={`text-xs font-bold ${selected.color}`}>{selected.label}</div>
                                <div className="space-y-1.5">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] text-muted-foreground">Leads</span>
                                        <span className={`text-sm font-bold ${selected.color}`}>{selected.count.toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] text-muted-foreground">Conv. Rate</span>
                                        <span className="text-sm font-bold text-foreground">{selected.convRate}</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelected(null)}
                                    className="w-full text-[10px] py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                                    ← Back
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-2">
                                <p className="text-[10px] text-muted-foreground">Click any stage to see details</p>
                                <div className="space-y-1">
                                    {stages.map(s => (
                                        <div key={s.id} className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${s.bgColor.replace("/20", "")}`} />
                                            <span className="text-[10px] text-muted-foreground truncate">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
