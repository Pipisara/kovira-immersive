import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Ban, Activity, RefreshCw } from "lucide-react";

interface Threat {
    id: string;
    type: string;
    source: string;
    severity: "critical" | "high" | "medium";
    time: string;
    blocked: boolean;
}

const threatTypes = [
    "SQL Injection", "XSS Attack", "DDoS Probe", "Brute Force", "Port Scan",
    "Malware Download", "Phishing Attempt", "Zero-day Exploit", "CSRF Attack"
];
const sources = [
    "185.220.101.45", "91.108.4.0", "103.21.244.0", "198.54.117.0",
    "45.33.32.156", "172.217.0.0", "104.21.0.0", "162.158.0.0"
];

function randomThreat(id: number): Threat {
    const sev = Math.random() < 0.2 ? "critical" : Math.random() < 0.5 ? "high" : "medium";
    return {
        id: `T${id}`,
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        severity: sev,
        time: "just now",
        blocked: Math.random() > 0.15,
    };
}

const severityStyle: Record<Threat["severity"], string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/40",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
};

export default function SecurityDemo() {
    const [threats, setThreats] = useState<Threat[]>([
        { id: "T1", type: "SQL Injection", source: "185.220.101.45", severity: "critical", time: "2s ago", blocked: true },
        { id: "T2", type: "Brute Force", source: "91.108.4.0", severity: "high", time: "8s ago", blocked: true },
        { id: "T3", type: "Port Scan", source: "103.21.244.0", severity: "medium", time: "15s ago", blocked: true },
        { id: "T4", type: "XSS Attack", source: "198.54.117.0", severity: "high", time: "23s ago", blocked: false },
    ]);
    const [health, setHealth] = useState(94);
    const [blocked, setBlocked] = useState(1247);
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        const t = setInterval(() => {
            setCounter(c => {
                if (c <= 1) {
                    const newThreat = randomThreat(Date.now());
                    setThreats(prev => [newThreat, ...prev].slice(0, 8));
                    setBlocked(b => b + (newThreat.blocked ? 1 : 0));
                    setHealth(h => Math.max(80, Math.min(99, h + (newThreat.blocked ? 0.5 : -2))));
                    return Math.floor(Math.random() * 8) + 3;
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const criticalCount = threats.filter(t => t.severity === "critical").length;
    const blockedCount = threats.filter(t => t.blocked).length;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-3 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-foreground">Cybersecurity Monitor</h3>
                    <p className="text-xs text-muted-foreground">Real-time threat detection</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-xs text-red-400 font-medium">LIVE</span>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
                <div className="glass rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <ShieldCheck size={13} className="text-green-400" />
                        <span className="text-[10px] text-muted-foreground">Health</span>
                    </div>
                    <div className={`text-lg font-bold ${health > 90 ? "text-green-400" : health > 80 ? "text-yellow-400" : "text-red-400"}`}>
                        {Math.round(health)}%
                    </div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Ban size={13} className="text-red-400" />
                        <span className="text-[10px] text-muted-foreground">Blocked</span>
                    </div>
                    <div className="text-lg font-bold text-red-400">{blocked.toLocaleString()}</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertTriangle size={13} className="text-orange-400" />
                        <span className="text-[10px] text-muted-foreground">Critical</span>
                    </div>
                    <div className="text-lg font-bold text-orange-400">{criticalCount}</div>
                </div>
            </div>

            {/* Health bar */}
            <div className="glass rounded-xl p-3 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">System Health</span>
                    <span className="text-xs text-muted-foreground">Next scan in {counter}s</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${health}%` }} transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${health > 90 ? "bg-green-500" : health > 80 ? "bg-yellow-500" : "bg-red-500"}`} />
                </div>
            </div>

            {/* Threat feed */}
            <div className="flex-1 glass rounded-xl p-3 overflow-y-auto min-h-0">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Threat Feed
                </span>
                <div className="space-y-2">
                    <AnimatePresence initial={false}>
                        {threats.map((threat) => (
                            <motion.div key={threat.id}
                                initial={{ opacity: 0, x: -10, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 py-1.5 border-b border-border/20 last:border-0">
                                <div className={`shrink-0 ${threat.blocked ? "text-green-400" : "text-red-400"}`}>
                                    {threat.blocked ? <Shield size={12} /> : <ShieldAlert size={12} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-medium text-foreground truncate">{threat.type}</span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium shrink-0 ${severityStyle[threat.severity]}`}>
                                            {threat.severity}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-mono">{threat.source}</span>
                                </div>
                                <div className="flex flex-col items-end gap-0.5 shrink-0">
                                    <span className={`text-[9px] font-medium ${threat.blocked ? "text-green-400" : "text-red-400"}`}>
                                        {threat.blocked ? "BLOCKED" : "ALERT"}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground">{threat.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
