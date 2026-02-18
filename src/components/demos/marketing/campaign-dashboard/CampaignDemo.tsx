import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, MousePointer, Eye, Users } from "lucide-react";

interface ChannelData {
    name: string;
    spend: number;
    clicks: number;
    conversions: number;
    roi: number;
    color: string;
}

const channels: ChannelData[] = [
    { name: "Google Ads", spend: 4200, clicks: 18400, conversions: 312, roi: 3.8, color: "#4285F4" },
    { name: "Meta Ads", spend: 2800, clicks: 24100, conversions: 198, roi: 2.9, color: "#1877F2" },
    { name: "Email", spend: 600, clicks: 8200, conversions: 145, roi: 7.2, color: "#10b981" },
    { name: "LinkedIn", spend: 1900, clicks: 5600, conversions: 87, roi: 2.1, color: "#0A66C2" },
];

const weeklyImpressions = [42000, 58000, 51000, 73000, 68000, 91000, 84000];
const days = ["M", "T", "W", "T", "F", "S", "S"];

function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0);
    const started = useRef(false);
    useEffect(() => {
        if (started.current) return;
        started.current = true;
        let v = 0;
        const step = target / 40;
        const t = setInterval(() => {
            v += step;
            if (v >= target) { setCount(target); clearInterval(t); }
            else setCount(Math.floor(v));
        }, 20);
        return () => clearInterval(t);
    }, [target]);
    return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

const kpis = [
    { label: "Total Spend", value: 9500, prefix: "$", icon: DollarSign, positive: false, change: "+12%" },
    { label: "Impressions", value: 467000, prefix: "", suffix: "", icon: Eye, positive: true, change: "+28%" },
    { label: "Total Clicks", value: 56300, prefix: "", icon: MousePointer, positive: true, change: "+19%" },
    { label: "Conversions", value: 742, prefix: "", icon: Users, positive: true, change: "+34%" },
];

export default function CampaignDemo() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const maxImp = Math.max(...weeklyImpressions);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => { setRefreshKey(k => k + 1); setRefreshing(false); }, 700);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-3 overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-foreground">Campaign Analytics</h3>
                    <p className="text-xs text-muted-foreground">Q1 2025 — All Channels</p>
                </div>
                <button onClick={handleRefresh}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border/50 text-xs text-muted-foreground hover:text-orange-400 hover:border-orange-500/50 transition-all">
                    <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.7 }}>
                        <RefreshCw size={12} />
                    </motion.div>
                    Refresh
                </button>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-4 gap-2 shrink-0">
                {kpis.map((k, i) => {
                    const Icon = k.icon;
                    return (
                        <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="glass rounded-xl p-3 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground">{k.label}</span>
                                <Icon size={11} className="text-orange-400" />
                            </div>
                            <span className="text-sm font-bold text-foreground">
                                <AnimatedNumber key={refreshKey} target={k.value} prefix={k.prefix} />
                            </span>
                            <div className={`flex items-center gap-0.5 text-[10px] font-medium ${k.positive ? "text-green-400" : "text-red-400"}`}>
                                {k.positive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                                {k.change}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Impressions chart */}
            <div className="glass rounded-xl p-4 shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-foreground">Weekly Impressions</span>
                    <span className="text-xs text-muted-foreground">This week</span>
                </div>
                <div className="flex items-end gap-1.5 h-20">
                    {weeklyImpressions.map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <motion.div key={refreshKey}
                                initial={{ height: 0 }} animate={{ height: `${(v / maxImp) * 100}%` }}
                                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                                className={`w-full rounded-t-sm ${i === 6 ? "bg-orange-500" : "bg-orange-500/30"}`}
                                style={{ minHeight: 4 }} />
                            <span className={`text-[9px] ${i === 6 ? "text-orange-400 font-bold" : "text-muted-foreground"}`}>
                                {days[i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Channel breakdown */}
            <div className="glass rounded-xl p-4 shrink-0">
                <span className="text-xs font-semibold text-foreground block mb-3">Channel Performance</span>
                <div className="space-y-3">
                    {channels.map((ch, i) => (
                        <motion.div key={ch.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                                    <span className="text-foreground/80">{ch.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <span>{ch.conversions} conv.</span>
                                    <span className="text-green-400 font-medium">{ch.roi}x ROI</span>
                                </div>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div key={refreshKey}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(ch.conversions / 312) * 100}%` }}
                                    transition={{ delay: i * 0.07 + 0.1, duration: 0.6 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: ch.color }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
