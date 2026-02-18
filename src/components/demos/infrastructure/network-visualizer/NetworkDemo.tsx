import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, Server, Monitor, Router, Database, Globe } from "lucide-react";

interface NetworkNode {
    id: string;
    label: string;
    type: "router" | "server" | "client" | "database" | "internet";
    x: number;
    y: number;
    status: "online" | "offline" | "warning";
    ping: number;
}

interface NetworkEdge {
    from: string;
    to: string;
    active: boolean;
}

const initialNodes: NetworkNode[] = [
    { id: "internet", label: "Internet", type: "internet", x: 50, y: 10, status: "online", ping: 12 },
    { id: "router", label: "Core Router", type: "router", x: 50, y: 30, status: "online", ping: 2 },
    { id: "fw", label: "Firewall", type: "server", x: 20, y: 50, status: "online", ping: 1 },
    { id: "web", label: "Web Server", type: "server", x: 50, y: 55, status: "online", ping: 8 },
    { id: "db", label: "Database", type: "database", x: 80, y: 50, status: "warning", ping: 45 },
    { id: "client1", label: "Workstation A", type: "client", x: 15, y: 80, status: "online", ping: 5 },
    { id: "client2", label: "Workstation B", type: "client", x: 45, y: 80, status: "offline", ping: 0 },
    { id: "client3", label: "Workstation C", type: "client", x: 75, y: 80, status: "online", ping: 7 },
];

const edges: NetworkEdge[] = [
    { from: "internet", to: "router", active: true },
    { from: "router", to: "fw", active: true },
    { from: "router", to: "web", active: true },
    { from: "router", to: "db", active: true },
    { from: "fw", to: "client1", active: true },
    { from: "web", to: "client2", active: false },
    { from: "db", to: "client3", active: true },
];

const nodeIcon: Record<NetworkNode["type"], React.ElementType> = {
    router: Router,
    server: Server,
    client: Monitor,
    database: Database,
    internet: Globe,
};

const statusColor: Record<NetworkNode["status"], string> = {
    online: "text-green-400 border-green-500/50 bg-green-500/10",
    offline: "text-red-400 border-red-500/50 bg-red-500/10",
    warning: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10",
};

const statusDot: Record<NetworkNode["status"], string> = {
    online: "bg-green-400",
    offline: "bg-red-400",
    warning: "bg-yellow-400",
};

export default function NetworkDemo() {
    const [nodes, setNodes] = useState(initialNodes);
    const [selected, setSelected] = useState<NetworkNode | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [tick, setTick] = useState(0);

    // Simulate live ping updates
    useEffect(() => {
        const t = setInterval(() => {
            setTick(k => k + 1);
            setNodes(prev => prev.map(n => ({
                ...n,
                ping: n.status === "offline" ? 0 : Math.max(1, n.ping + Math.floor(Math.random() * 6) - 3),
            })));
        }, 2000);
        return () => clearInterval(t);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setNodes(prev => prev.map(n => ({
                ...n,
                status: n.id === "client2"
                    ? (Math.random() > 0.5 ? "online" : "offline")
                    : n.status,
            })));
            setRefreshing(false);
        }, 800);
    };

    const online = nodes.filter(n => n.status === "online").length;
    const offline = nodes.filter(n => n.status === "offline").length;
    const warning = nodes.filter(n => n.status === "warning").length;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-3 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-foreground">Network Topology</h3>
                    <p className="text-xs text-muted-foreground">Live infrastructure map</p>
                </div>
                <button onClick={handleRefresh}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border/50 text-xs text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                    <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.8 }}>
                        <RefreshCw size={12} />
                    </motion.div>
                    Scan
                </button>
            </div>

            {/* Status bar */}
            <div className="flex gap-3 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400">
                    <Wifi size={11} /> {online} Online
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-400">
                    <Wifi size={11} /> {warning} Warning
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                    <WifiOff size={11} /> {offline} Offline
                </div>
            </div>

            {/* Main area */}
            <div className="flex-1 flex gap-3 min-h-0">
                {/* Topology map */}
                <div className="flex-1 glass rounded-xl p-3 relative overflow-hidden">
                    <div className="relative w-full h-full">
                        {nodes.map(node => {
                            const Icon = nodeIcon[node.type];
                            return (
                                <motion.button
                                    key={node.id}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelected(selected?.id === node.id ? null : node)}
                                    style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
                                    className={`absolute flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${statusColor[node.status]} ${selected?.id === node.id ? "ring-1 ring-emerald-400/50" : ""}`}>
                                    <div className="relative">
                                        <Icon size={14} />
                                        <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${statusDot[node.status]} ${node.status === "online" ? "animate-pulse" : ""}`} />
                                    </div>
                                    <span className="text-[9px] font-medium whitespace-nowrap">{node.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Node detail panel */}
                <div className="w-36 glass rounded-xl p-3 flex flex-col gap-2 overflow-y-auto">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        {selected ? "Node Detail" : "All Nodes"}
                    </span>
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-2">
                                <div className={`text-xs font-medium px-2 py-1 rounded-lg border ${statusColor[selected.status]}`}>
                                    {selected.status.toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-muted-foreground">Name</span>
                                        <span className="text-foreground font-medium">{selected.label}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-muted-foreground">Type</span>
                                        <span className="text-foreground font-medium capitalize">{selected.type}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-muted-foreground">Ping</span>
                                        <span className={`font-medium ${selected.ping > 30 ? "text-yellow-400" : "text-green-400"}`}>
                                            {selected.ping}ms
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setSelected(null)}
                                    className="w-full text-[10px] py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                                    ← Back
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-1.5">
                                {nodes.map(n => (
                                    <div key={n.id} className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[n.status]}`} />
                                        <span className="text-[10px] text-foreground/70 truncate">{n.label}</span>
                                        <span className="text-[9px] text-muted-foreground ml-auto shrink-0">
                                            {n.ping > 0 ? `${n.ping}ms` : "—"}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
