
import React, { useState, useEffect, useMemo } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    LineChart,
    Line,
    AreaChart,
    Area,
    CartesianGrid,
} from "recharts";
import {
    Activity,
    Calendar,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Cpu,
    Server,
    Network,
    Play,
    Pause,
    RefreshCw,
    ShieldAlert,
    Power,
    Wifi
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data Generators ---

const generateTrafficPoint = (i: number, isUnderAttack: boolean) => ({
    time: i,
    inbound: isUnderAttack
        ? Math.max(100, Math.floor(Math.random() * 300) + 200 + Math.sin(i / 2) * 100)
        : Math.max(10, Math.floor(Math.random() * 60) + 40 + Math.sin(i / 5) * 20),
    outbound: Math.max(5, Math.floor(Math.random() * 40) + 20 + Math.cos(i / 5) * 10),
    packets: isUnderAttack
        ? Math.floor(Math.random() * 500) + 300
        : Math.floor(Math.random() * 100) + 50,
    latency: isUnderAttack
        ? Math.floor(Math.random() * 100) + 50
        : Math.floor(Math.random() * 20) + 10,
    availability: isUnderAttack
        ? (Math.random() * (70 - 40) + 40).toFixed(1)
        : (Math.random() * (99.9 - 98.0) + 98.0).toFixed(1),
});

const cpuGroups = [
    { group: "Server > Windows", value: 45, color: "#3b82f6" },
    { group: "Server > Linux", value: 62, color: "#a855f7" },
    { group: "Network > Switch", value: 28, color: "#10b981" },
    { group: "Database > SQL", value: 74, color: "#f59e0b" },
];

const topMonitors = [
    { name: "Core-Router-01", latency: "4ms", points: [2, 3, 2, 4, 3, 5, 2, 3, 2] },
    { name: "Edge-Firewall-SW", latency: "12ms", points: [5, 8, 6, 9, 7, 10, 8, 11, 7] },
    { name: "Auth-Server-Prod", latency: "28ms", points: [20, 25, 22, 28, 24, 30, 26, 32, 25] },
];

// --- Sub-Components ---

const Panel = ({ title, children, className = "", action }: { title: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) => (
    <div className={`bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-4 flex flex-col shadow-xl ${className}`}>
        <div className="flex items-center justify-between mb-3 shrink-0">
            <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase flex items-center gap-2">
                {title}
            </h3>
            <div className="flex items-center gap-2">
                {action}
                <MoreVertical size={14} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
            </div>
        </div>
        <div className="flex-1 min-h-0 relative overflow-hidden">
            {children}
        </div>
    </div>
);

const StatCard = ({ title, value, unit, icon: Icon, color, isAlert }: { title: string; value: number | string; unit: string; icon: any; color: string; isAlert?: boolean }) => (
    <div className={`bg-black/40 backdrop-blur-sm border ${isAlert ? 'border-red-500/50 bg-red-500/10' : 'border-white/5'} rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group transition-colors duration-500`}>
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-${color}-500/5 blur-2xl group-hover:bg-${color}-500/10 transition-colors`} />
        <span className={`text-[10px] font-semibold ${isAlert ? 'text-red-400' : 'text-gray-500'} uppercase tracking-wider`}>{title}</span>
        <div className="flex items-end justify-between mt-2">
            <div className="flex items-baseline gap-1">
                <span className={`text-lg font-bold ${isAlert ? 'text-red-100' : 'text-gray-100'}`}>{value}</span>
                <span className={`text-[10px] ${isAlert ? 'text-red-300' : 'text-gray-500'} font-medium`}>{unit}</span>
            </div>
            <Icon size={16} className="mb-0.5" style={{ color }} />
        </div>
    </div>
);

// --- Main Component ---

export default function SecurityDemo() {
    const [mounted, setMounted] = useState(false);

    // State
    const [activeRegion, setActiveRegion] = useState("US-East");
    const [paused, setPaused] = useState(false);
    const [isUnderAttack, setIsUnderAttack] = useState(false);
    const [activeServices, setActiveServices] = useState<string[]>(['DNS', 'HTTP', 'SSH', 'RDP']);

    // Initial 50 points
    const [dataPoints, setDataPoints] = useState(() => Array.from({ length: 50 }, (_, i) => generateTrafficPoint(i, false)));
    const [tick, setTick] = useState(50);

    // Toggle Service Handler
    const toggleService = (service: string) => {
        setActiveServices(prev =>
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
    };

    // Data Tick
    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            if (!paused) {
                setTick(t => {
                    const next = t + 1;
                    setDataPoints(prev => [...prev.slice(1), generateTrafficPoint(next, isUnderAttack)]);
                    return next;
                });
            }
        }, 1000); // 1-second updates for "live" feel
        return () => clearInterval(interval);
    }, [paused, isUnderAttack]);

    const currentStats = useMemo(() => dataPoints[dataPoints.length - 1], [dataPoints]);

    // Dynamic availability data for the pie chart
    const currentAvailability = useMemo(() => {
        const val = parseFloat(currentStats.availability);
        return [
            { name: "Available", value: val },
            { name: "Down", value: Math.max(0, 100 - val - 2) },
            { name: "Maintenance", value: 2 },
        ];
    }, [currentStats.availability]);


    if (!mounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full bg-[#09090b] text-gray-200 flex flex-col gap-4 overflow-hidden font-sans select-none p-4"
        >
            {/* ALERT OVERLAY */}
            <AnimatePresence>
                {isUnderAttack && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-4 left-0 right-0 z-50 flex justify-center pointer-events-none"
                    >
                        <div className="bg-red-500/90 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 animate-pulse">
                            <ShieldAlert size={18} />
                            <span>DDoS ATTACK DETECTED - TRAFFIC SPIKE</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between shrink-0 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                        <Activity size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Zylker Network Operations</h1>
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setPaused(!paused)}
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${paused ? 'bg-yellow-400' : 'bg-emerald-400'} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${paused ? 'bg-yellow-500' : 'bg-emerald-500'}`}></span>
                            </span>
                            <span className={`text-[10px] font-medium ${paused ? 'text-yellow-500' : 'text-emerald-500'} tracking-wide uppercase`}>
                                {paused ? "System Paused" : "System Operational"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Interactive Region Tabs */}
                    <div className="hidden md:flex gap-1.5 bg-black/20 p-1 rounded-lg border border-white/5">
                        {["US-East", "EU-West", "AP-South"].map((region) => (
                            <button
                                key={region}
                                onClick={() => setActiveRegion(region)}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all duration-200 ${activeRegion === region
                                    ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 shadow-sm'
                                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                {region}
                            </button>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsUnderAttack(!isUnderAttack)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${isUnderAttack
                                ? 'bg-red-500 text-white border-red-600 shadow-red-500/20 shadow-lg'
                                : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                                }`}
                        >
                            <Zap size={13} fill={isUnderAttack ? "currentColor" : "none"} />
                            {isUnderAttack ? "ATTACK ACTIVE" : "SIMULATE ATTACK"}
                        </button>

                        <div className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 text-gray-400">
                            <Calendar size={13} />
                            <span className="font-mono">Oct 24, 14:32:05 UTC</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 pb-1">

                {/* Left Column: KPI & Radial Status */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                    {/* Status Donut */}
                    <Panel title="System Availability" className="flex-[1] min-h-[180px]">
                        <div className="h-full flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={currentAvailability}
                                        innerRadius="65%"
                                        outerRadius="85%"
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={4}
                                    >
                                        <Cell fill={isUnderAttack ? "#ef4444" : "#10b981"} />
                                        <Cell fill="#333" />
                                        <Cell fill="#f59e0b" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <div className="flex flex-col items-center">
                                    <span className={`text-2xl font-bold tracking-tighter transition-colors ${isUnderAttack ? 'text-red-500' : 'text-white'}`}>
                                        {currentStats.availability}<span className="text-sm text-gray-500">%</span>
                                    </span>
                                    <span className={`text-[9px] font-semibold uppercase tracking-widest mt-1 ${isUnderAttack ? 'text-red-400' : 'text-emerald-500'}`}>
                                        {isUnderAttack ? 'CRITICAL' : 'EXCELLENT'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-2">
                            <button
                                onClick={() => setPaused(!paused)}
                                className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-white transition-colors"
                            >
                                {paused ? <Play size={10} /> : <Pause size={10} />}
                                {paused ? "Resume" : "Pause"}
                            </button>
                            <button
                                onClick={() => setDataPoints(Array.from({ length: 50 }, (_, i) => generateTrafficPoint(i, false)))}
                                className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-white transition-colors"
                            >
                                <RefreshCw size={10} />
                                Reset
                            </button>
                        </div>
                    </Panel>

                    {/* Top Monitors List */}
                    <Panel title="Critical Monitors" className="flex-[2] overflow-hidden">
                        <div className="flex flex-col gap-3">
                            {topMonitors.map((m, i) => (
                                <div key={i} className="group flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-orange-500' : 'bg-emerald-500'} ${isUnderAttack ? 'animate-pulse bg-red-500' : ''}`} />
                                            <span className="text-[11px] font-medium text-gray-200 group-hover:text-blue-400 transition-colors">{m.name}</span>
                                        </div>
                                        <span className="text-[9px] text-gray-500 ml-3.5">192.168.1.{100 + i}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-12 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={m.points.map((p, idx) => ({ p: isUnderAttack ? p * 3 : p, idx }))}>
                                                    <Line
                                                        type="monotone"
                                                        dataKey="p"
                                                        stroke={isUnderAttack ? '#ef4444' : (i === 2 ? '#f97316' : '#10b981')}
                                                        strokeWidth={2}
                                                        dot={false}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <span className={`text-xs font-mono font-medium ${isUnderAttack ? 'text-red-400' : (i === 2 ? 'text-orange-400' : 'text-emerald-400')}`}>
                                            {isUnderAttack ? `${parseInt(m.latency) * 5}ms` : m.latency}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>

                {/* Middle Column: Live Main Graphs */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0 h-24">
                        <StatCard
                            title="Inbound"
                            value={currentStats.inbound}
                            unit="Mbps"
                            icon={ArrowDownRight}
                            color={isUnderAttack ? "#ef4444" : "#3b82f6"}
                            isAlert={isUnderAttack}
                        />
                        <StatCard
                            title="Outbound"
                            value={currentStats.outbound}
                            unit="Mbps"
                            icon={ArrowUpRight}
                            color="#a855f7"
                        />
                        <StatCard
                            title="Events"
                            value={currentStats.packets}
                            unit="/sec"
                            icon={Zap}
                            color={isUnderAttack ? "#ef4444" : "#f59e0b"}
                            isAlert={isUnderAttack}
                        />
                        <StatCard
                            title="Load"
                            value={`${Math.round(currentStats.inbound / (isUnderAttack ? 1.5 : 3))}%`}
                            unit="Avg"
                            icon={Cpu}
                            color={isUnderAttack ? "#ef4444" : "#ef4444"}
                        />
                    </div>

                    {/* Main Traffic Graph */}
                    <Panel title="Network Traffic Analysis (Live)" className="flex-[2]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataPoints}>
                                <defs>
                                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isUnderAttack ? "#ef4444" : "#3b82f6"} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={isUnderAttack ? "#ef4444" : "#3b82f6"} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 'auto']} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', fontSize: '12px' }}
                                    itemStyle={{ padding: 0 }}
                                    labelStyle={{ display: 'none' }}
                                />
                                <Area
                                    isAnimationActive={false}
                                    type="monotone"
                                    dataKey="inbound"
                                    stroke={isUnderAttack ? "#ef4444" : "#3b82f6"}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorIn)"
                                />
                                <Area
                                    isAnimationActive={false}
                                    type="monotone"
                                    dataKey="outbound"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorOut)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Panel>

                    {/* 2nd Row Graphs */}
                    <div className="flex-[1.5] grid grid-cols-2 gap-4 min-h-[160px]">
                        <Panel title="Response Time (ms)">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataPoints}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Line
                                        isAnimationActive={false}
                                        type="stepAfter"
                                        dataKey="latency"
                                        stroke={isUnderAttack ? "#ef4444" : "#f59e0b"}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Panel>
                        <Panel title="Packet Loss">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataPoints.slice(-20)}>
                                    <Bar dataKey="outbound" name="Loss" fill="#ef4444" radius={[2, 2, 0, 0]} opacity={0.7} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Panel>
                    </div>
                </div>

                {/* Right Column: Infrastructure */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                    {/* Server Load List */}
                    <Panel title="Infrastructure Load" className="flex-[2]">
                        <div className="flex flex-col gap-4">
                            {cpuGroups.map((g, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-[11px] font-medium text-gray-400">
                                        <span>{g.group}</span>
                                        <span className={isUnderAttack ? "text-red-400" : "text-white"}>
                                            {isUnderAttack ? Math.min(100, g.value + 30) : g.value}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${isUnderAttack ? Math.min(100, g.value + 30) : g.value}%` }}
                                            transition={{ duration: 0.5 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: isUnderAttack ? "#ef4444" : g.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Active Services</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {['DNS', 'DHCP', 'HTTP', 'SSH', 'FTP', 'RDP'].map(s => {
                                    const isActive = activeServices.includes(s);
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => toggleService(s)}
                                            className={`border rounded px-2 py-1.5 flex items-center justify-between transition-all duration-200 ${isActive
                                                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                                : 'bg-transparent border-transparent opacity-50 hover:opacity-100'
                                                }`}
                                        >
                                            <span className="text-[10px] font-mono text-gray-300">{s}</span>
                                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-600'}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Panel>

                    {/* Connection Diagram Placeholder (Simplified) */}
                    <Panel title="Topology" className="flex-[1.5] min-h-[150px]">
                        <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-gray-600">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full border border-dashed transition-colors duration-300 ${isUnderAttack ? 'border-red-500 text-red-500' : 'border-gray-700'}`}>
                                    <Server size={14} />
                                </div>
                                <div className={`h-px w-8 transition-colors duration-300 ${isUnderAttack ? 'bg-red-500' : 'bg-gray-700'} animate-pulse`} />
                                <div className={`p-2 rounded-full border border-dashed transition-colors duration-300 ${isUnderAttack ? 'border-red-500 text-red-500' : 'border-gray-700'}`}>
                                    <Network size={14} />
                                </div>
                                <div className={`h-px w-8 transition-colors duration-300 ${isUnderAttack ? 'bg-red-500' : 'bg-gray-700'} animate-pulse`} />
                                <div className={`p-2 rounded-full border border-dashed transition-colors duration-300 ${isUnderAttack ? 'border-red-500 text-red-500' : 'border-gray-700'}`}>
                                    <Activity size={14} />
                                </div>
                            </div>
                            <span className={`text-[10px] mt-2 transition-colors duration-300 ${isUnderAttack ? 'text-red-400 font-bold' : ''}`}>
                                {isUnderAttack ? "THREAT DETECTED" : "Live Topology Mapping"}
                            </span>
                        </div>
                    </Panel>
                </div>

            </div>
        </motion.div>
    );
}
