import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Search, ExternalLink, RefreshCw } from "lucide-react";

interface Keyword {
    kw: string;
    pos: number;
    prev: number;
    volume: number;
    difficulty: "easy" | "medium" | "hard";
}

const keywords: Keyword[] = [
    { kw: "IT solutions company", pos: 3, prev: 7, volume: 8400, difficulty: "hard" },
    { kw: "managed IT services", pos: 1, prev: 2, volume: 12200, difficulty: "hard" },
    { kw: "cloud migration services", pos: 5, prev: 5, volume: 6800, difficulty: "medium" },
    { kw: "cybersecurity consulting", pos: 8, prev: 12, volume: 4200, difficulty: "medium" },
    { kw: "network infrastructure setup", pos: 2, prev: 4, volume: 3100, difficulty: "easy" },
    { kw: "ERP implementation", pos: 11, prev: 9, volume: 5600, difficulty: "hard" },
    { kw: "POS system for business", pos: 4, prev: 6, volume: 2900, difficulty: "easy" },
];

const trafficData = [2100, 2800, 2400, 3600, 3200, 4800, 4200];
const days = ["M", "T", "W", "T", "F", "S", "S"];

const difficultyStyle: Record<Keyword["difficulty"], string> = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function SeoDemo() {
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const filtered = keywords.filter(k => k.kw.toLowerCase().includes(search.toLowerCase()));
    const maxTraffic = Math.max(...trafficData);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => { setRefreshKey(k => k + 1); setRefreshing(false); }, 700);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-3 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-foreground">SEO Analytics</h3>
                    <p className="text-xs text-muted-foreground">kovira.com — Organic Search</p>
                </div>
                <button onClick={handleRefresh}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border/50 text-xs text-muted-foreground hover:text-yellow-400 hover:border-yellow-500/50 transition-all">
                    <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.7 }}>
                        <RefreshCw size={12} />
                    </motion.div>
                    Sync
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
                {[
                    { label: "Domain Authority", value: "62", change: "+4", positive: true },
                    { label: "Organic Traffic", value: "4,200/mo", change: "+28%", positive: true },
                    { label: "Backlinks", value: "1,847", change: "+112", positive: true },
                ].map((item, i) => (
                    <motion.div key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="glass rounded-xl p-3 text-center">
                        <span className="text-[10px] text-muted-foreground block">{item.label}</span>
                        <span className="text-sm font-bold text-foreground block mt-0.5">{item.value}</span>
                        <div className={`flex items-center justify-center gap-0.5 text-[10px] font-medium mt-0.5 ${item.positive ? "text-green-400" : "text-red-400"}`}>
                            {item.positive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                            {item.change}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Traffic chart */}
            <div className="glass rounded-xl p-3 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">Organic Traffic</span>
                    <span className="text-xs text-muted-foreground">This week</span>
                </div>
                <div className="flex items-end gap-1.5 h-16">
                    {trafficData.map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <motion.div key={refreshKey}
                                initial={{ height: 0 }} animate={{ height: `${(v / maxTraffic) * 100}%` }}
                                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                                className={`w-full rounded-t-sm ${i === 6 ? "bg-yellow-500" : "bg-yellow-500/30"}`}
                                style={{ minHeight: 4 }} />
                            <span className={`text-[9px] ${i === 6 ? "text-yellow-400 font-bold" : "text-muted-foreground"}`}>
                                {days[i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Keyword table */}
            <div className="flex-1 glass rounded-xl p-3 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-2 shrink-0">
                    <div className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary border border-border/40">
                        <Search size={11} className="text-muted-foreground" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Filter keywords…"
                            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 space-y-1.5">
                    <AnimatePresence>
                        {filtered.map((kw, i) => {
                            const improved = kw.pos < kw.prev;
                            return (
                                <motion.div key={kw.kw} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                                    className="flex items-center gap-2 py-1.5 border-b border-border/20 last:border-0">
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs text-foreground/80 truncate block">{kw.kw}</span>
                                        <span className="text-[10px] text-muted-foreground">{kw.volume.toLocaleString()} searches/mo</span>
                                    </div>
                                    <div className={`flex items-center gap-0.5 text-xs font-bold ${improved ? "text-green-400" : kw.pos === kw.prev ? "text-muted-foreground" : "text-red-400"}`}>
                                        {improved ? <TrendingUp size={10} /> : kw.pos > kw.prev ? <TrendingDown size={10} /> : null}
                                        #{kw.pos}
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${difficultyStyle[kw.difficulty]}`}>
                                        {kw.difficulty}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
