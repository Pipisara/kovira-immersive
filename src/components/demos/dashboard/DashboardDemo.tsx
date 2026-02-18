import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Package, Star } from "lucide-react";
import { kpiData, recentOrders, weeklyData, KpiData, OrderItem } from "./dashboard-data";

function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0);
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;
        let start = 0;
        const duration = 1200;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const kpiIcons = [DollarSign, ShoppingBag, Package, Star];

function KpiCard({ kpi, index, refreshKey }: { kpi: KpiData; index: number; refreshKey: number }) {
    const Icon = kpiIcons[index];
    return (
        <motion.div
            key={refreshKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="glass rounded-xl p-4 flex flex-col gap-2"
        >
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={14} className="text-primary" />
                </div>
            </div>
            <div className="text-xl font-bold text-foreground">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${kpi.positive ? "text-green-400" : "text-red-400"}`}>
                {kpi.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {kpi.change}
            </div>
        </motion.div>
    );
}

function MiniBarChart({ refreshKey }: { refreshKey: number }) {
    const max = Math.max(...weeklyData.map((d) => d.sales));
    return (
        <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-foreground">Weekly Sales</span>
                <span className="text-xs text-muted-foreground">This week</span>
            </div>
            <div className="flex items-end gap-1.5 h-20">
                {weeklyData.map((d, i) => {
                    const heightPct = (d.sales / max) * 100;
                    const isToday = i === weeklyData.length - 1;
                    return (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                            <motion.div
                                key={refreshKey}
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPct}%` }}
                                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                                className={`w-full rounded-t-sm ${isToday ? "bg-primary" : "bg-primary/30"}`}
                                style={{ minHeight: 4 }}
                            />
                            <span className={`text-[9px] ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                                {d.day}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const statusColors: Record<OrderItem["status"], string> = {
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
    processing: "bg-primary/20 text-primary border-primary/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export default function DashboardDemo() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setRefreshKey((k) => k + 1);
            setIsRefreshing(false);
        }, 600);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-4 overflow-y-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-foreground">Business Dashboard</h3>
                    <p className="text-xs text-muted-foreground">Today, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border/50 text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                >
                    <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.6 }}>
                        <RefreshCw size={12} />
                    </motion.div>
                    Refresh
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
                {kpiData.map((kpi, i) => (
                    <KpiCard key={kpi.label} kpi={kpi} index={i} refreshKey={refreshKey} />
                ))}
            </div>

            {/* Chart */}
            <MiniBarChart refreshKey={refreshKey} />

            {/* Recent Orders */}
            <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-foreground">Recent Orders</span>
                    <span className="text-xs text-primary cursor-pointer hover:underline">View all</span>
                </div>
                <div className="space-y-2">
                    <AnimatePresence>
                        {recentOrders.map((order, i) => (
                            <motion.div
                                key={`${order.id}-${refreshKey}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06, duration: 0.3 }}
                                className="flex items-center gap-3 py-1.5"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-foreground">{order.id}</span>
                                        <span className="text-xs text-muted-foreground truncate">{order.customer}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{order.time}</span>
                                </div>
                                <span className="text-xs font-bold text-foreground">{order.total}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[order.status]}`}>
                                    {order.status}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
