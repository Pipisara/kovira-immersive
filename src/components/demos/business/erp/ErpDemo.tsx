import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    RefreshCw, TrendingUp, TrendingDown, ShoppingBag, DollarSign,
    Package, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";

interface KpiData { label: string; value: string; change: string; positive: boolean; }
interface InventoryItem { name: string; stock: number; max: number; status: "ok" | "low" | "critical"; }
interface OrderRow { id: string; customer: string; value: string; status: "shipped" | "processing" | "pending"; time: string; }

const kpis: KpiData[] = [
    { label: "Monthly Revenue", value: "$128,400", change: "+14.2%", positive: true },
    { label: "Open Orders", value: "342", change: "+6.8%", positive: true },
    { label: "Avg Fulfillment", value: "1.8 days", change: "-0.3d", positive: true },
    { label: "Returns Rate", value: "2.1%", change: "+0.4%", positive: false },
];

const inventory: InventoryItem[] = [
    { name: "Laptop Pro 15\"", stock: 12, max: 50, status: "low" },
    { name: "Wireless Headset", stock: 87, max: 100, status: "ok" },
    { name: "USB-C Hub", stock: 3, max: 40, status: "critical" },
    { name: "Mechanical Keyboard", stock: 34, max: 60, status: "ok" },
    { name: "4K Monitor", stock: 5, max: 30, status: "low" },
];

const orders: OrderRow[] = [
    { id: "ORD-8821", customer: "TechCorp Ltd", value: "$4,200", status: "shipped", time: "1h ago" },
    { id: "ORD-8820", customer: "Nova Solutions", value: "$890", status: "processing", time: "3h ago" },
    { id: "ORD-8819", customer: "Apex Digital", value: "$12,500", status: "pending", time: "5h ago" },
    { id: "ORD-8818", customer: "BlueSky Inc", value: "$2,100", status: "shipped", time: "8h ago" },
];

const weeklyRevenue = [42, 58, 51, 73, 68, 91, 84];
const days = ["M", "T", "W", "T", "F", "S", "S"];

function AnimatedNumber({ target }: { target: number }) {
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
    return <>{count}</>;
}

const statusStyle: Record<OrderRow["status"], string> = {
    shipped: "bg-green-500/20 text-green-400 border-green-500/30",
    processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const stockStatus: Record<InventoryItem["status"], string> = {
    ok: "bg-green-500",
    low: "bg-yellow-500",
    critical: "bg-red-500",
};

export default function ErpDemo() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [tab, setTab] = useState<"overview" | "inventory" | "orders">("overview");

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => { setRefreshKey(k => k + 1); setRefreshing(false); }, 700);
    };

    const maxRev = Math.max(...weeklyRevenue);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-3 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-foreground">ERP Dashboard</h3>
                    <p className="text-xs text-muted-foreground">Enterprise Resource Planning</p>
                </div>
                <button onClick={handleRefresh}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border/50 text-xs text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                    <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.6 }}>
                        <RefreshCw size={12} />
                    </motion.div>
                    Sync
                </button>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-4 gap-2 shrink-0">
                {kpis.map((k, i) => (
                    <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="glass rounded-xl p-3 flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground leading-tight">{k.label}</span>
                        <span className="text-sm font-bold text-foreground">{k.value}</span>
                        <div className={`flex items-center gap-0.5 text-[10px] font-medium ${k.positive ? "text-green-400" : "text-red-400"}`}>
                            {k.positive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                            {k.change}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 shrink-0">
                {(["overview", "inventory", "orders"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${tab === t
                            ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
                            : "text-muted-foreground hover:text-foreground"}`}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <AnimatePresence mode="wait">
                    {tab === "overview" && (
                        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="glass rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-foreground">Weekly Revenue</span>
                                <span className="text-xs text-muted-foreground">This week</span>
                            </div>
                            <div className="flex items-end gap-1.5 h-24">
                                {weeklyRevenue.map((v, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <motion.div key={refreshKey}
                                            initial={{ height: 0 }} animate={{ height: `${(v / maxRev) * 100}%` }}
                                            transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                                            className={`w-full rounded-t-sm ${i === 6 ? "bg-cyan-500" : "bg-cyan-500/30"}`}
                                            style={{ minHeight: 4 }} />
                                        <span className={`text-[9px] ${i === 6 ? "text-cyan-400 font-bold" : "text-muted-foreground"}`}>
                                            {days[i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {tab === "inventory" && (
                        <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="glass rounded-xl p-4 space-y-3">
                            <span className="text-xs font-semibold text-foreground block mb-1">Stock Levels</span>
                            {inventory.map((item, i) => (
                                <motion.div key={item.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-foreground/80">{item.name}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-muted-foreground">{item.stock}/{item.max}</span>
                                            {item.status === "critical" && <AlertTriangle size={10} className="text-red-400" />}
                                            {item.status === "ok" && <CheckCircle2 size={10} className="text-green-400" />}
                                            {item.status === "low" && <Clock size={10} className="text-yellow-400" />}
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }}
                                            animate={{ width: `${(item.stock / item.max) * 100}%` }}
                                            transition={{ delay: i * 0.06 + 0.1, duration: 0.5 }}
                                            className={`h-full rounded-full ${stockStatus[item.status]}`} />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                    {tab === "orders" && (
                        <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="glass rounded-xl p-4 space-y-2">
                            <span className="text-xs font-semibold text-foreground block mb-1">Recent Orders</span>
                            {orders.map((o, i) => (
                                <motion.div key={o.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-foreground">{o.id}</span>
                                            <span className="text-xs text-muted-foreground truncate">{o.customer}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{o.time}</span>
                                    </div>
                                    <span className="text-xs font-bold text-foreground">{o.value}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusStyle[o.status]}`}>
                                        {o.status}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
