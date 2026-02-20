import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, PanInfo, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
    Play,
    Zap,
    Code,
    CheckCircle2,
    Plus,
    Settings,
    ZoomIn,
    ZoomOut,
    Maximize,
    Terminal,
    Clock,
    MoreHorizontal,
    X,
    Loader2,
    BrainCircuit,
    Database,
    Globe2,
    Sparkles,
    RotateCcw,
    Copy,
    ExternalLink,
    Shield,
    Lock,
    Cpu,
    GitBranch,
    Server,
    Bell,
    Mail,
    Search,
    Layers,
    Network,
    Send,
    BarChart2,
    FileText,
    Inbox,
    AlertTriangle,
    Activity
} from "lucide-react";

// --- Types ---

interface Position {
    x: number;
    y: number;
}

interface NodeData {
    id: string;
    type: "trigger" | "action" | "logic";
    label: string;
    subLabel?: string;
    icon: React.ElementType;
    position: Position;
    color: string;
    status: "idle" | "running" | "success" | "error";
    outputs: string[];
}

interface EdgeData {
    id: string;
    source: string;
    target: string;
    label?: string;
    animated?: boolean;
    subFlow?: boolean;
}

interface LogEntry {
    id: string;
    time: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface AIResponse {
    status: string;
    data: {
        name: string;
        meaning: string;
        origin: string;
        cultural_significance: string;
        traits: string[];
        inspiration: string;
    };
    execution_id: string;
    timestamp: string;
    message?: string;
}

// --- Initial Data ---

const INITIAL_NODES: NodeData[] = [
    // ── Main Pipeline ──────────────────────────────────────────
    {
        id: "webhook",
        type: "trigger",
        label: "HTTP Webhook",
        subLabel: "POST /v1/analyze",
        icon: Zap,
        position: { x: 80, y: 250 },
        color: "#22c55e",
        status: "idle",
        outputs: ["main"],
    },
    {
        id: "security",
        type: "action",
        label: "Security Shield",
        subLabel: "JWT & Rate Limit",
        icon: Shield,
        position: { x: 330, y: 250 },
        color: "#0ea5e9",
        status: "idle",
        outputs: ["main"],
    },
    {
        id: "ai-agent",
        type: "action",
        label: "AI Intelligence",
        subLabel: "Claude 3.5 Sonnet",
        icon: BrainCircuit,
        position: { x: 580, y: 250 },
        color: "#a855f7",
        status: "idle",
        outputs: ["main"],
    },
    {
        id: "persistence",
        type: "action",
        label: "Vector Storage",
        subLabel: "PostgreSQL Write",
        icon: Database,
        position: { x: 830, y: 250 },
        color: "#3b82f6",
        status: "idle",
        outputs: ["main"],
    },
    {
        id: "response",
        type: "action",
        label: "API Response",
        subLabel: "JSON Payload",
        icon: Terminal,
        position: { x: 1080, y: 250 },
        color: "#ea4335",
        status: "idle",
        outputs: ["main"],
    },

    // ── Supporting Row (Connected via sub-flow) ────────────────
    {
        id: "llm-provider",
        type: "logic",
        label: "Anthropic API",
        subLabel: "Model Hook",
        icon: Cpu,
        position: { x: 580, y: 80 },
        color: "#8b5cf6",
        status: "idle",
        outputs: [],
    },
    {
        id: "cache",
        type: "action",
        label: "Redis Cache",
        subLabel: "L1 Retrieval",
        icon: Server,
        position: { x: 830, y: 80 },
        color: "#14b8a6",
        status: "idle",
        outputs: [],
    },

    // ── Error Handling Path (Critical visibility) ──────────────
    {
        id: "error-handler",
        type: "logic",
        label: "Error Handler",
        subLabel: "Global Exception Trap",
        icon: AlertTriangle,
        position: { x: 450, y: 450 },
        color: "#ef4444",
        status: "idle",
        outputs: [],
    },
    {
        id: "slack-alert",
        type: "action",
        label: "Slack Alert",
        subLabel: "#ops-warnings",
        icon: Bell,
        position: { x: 700, y: 450 },
        color: "#ec4899",
        status: "idle",
        outputs: [],
    },
];

const INITIAL_EDGES: EdgeData[] = [
    // Main flow
    { id: "e1", source: "webhook", target: "security" },
    { id: "e2", source: "security", target: "ai-agent" },
    { id: "e3", source: "ai-agent", target: "persistence" },
    { id: "e4", source: "persistence", target: "response" },

    // Sub-flows (Supporting services)
    { id: "e5", source: "ai-agent", target: "llm-provider", subFlow: true },
    { id: "e6", source: "persistence", target: "cache", subFlow: true },

    // Error paths
    { id: "err-1", source: "security", target: "error-handler", label: "on error", subFlow: true },
    { id: "err-2", source: "ai-agent", target: "error-handler", label: "on error", subFlow: true },
    { id: "err-3", source: "error-handler", target: "slack-alert", animated: true }
];

// --- Components ---

const NODE_TYPE_LABELS: Record<string, string> = {
    trigger: 'TRIGGER',
    action: 'ACTION',
    logic: 'LOGIC',
};

const Node = ({
    data,
    scale,
    onDrag
}: {
    data: NodeData;
    scale: number;
    active?: boolean;
    onDrag: (id: string, pos: Position) => void;
}) => {
    const Icon = data.icon;

    const glowStyle = data.status === 'running'
        ? { boxShadow: `0 0 0 2px ${data.color}60, 0 0 20px ${data.color}40` }
        : data.status === 'success'
            ? { boxShadow: `0 0 0 2px #10b98160` }
            : data.status === 'error'
                ? { boxShadow: `0 0 0 2px #ef444460` }
                : {};

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDrag={(_, info: PanInfo) => {
                onDrag(data.id, {
                    x: data.position.x + (info.delta.x / scale),
                    y: data.position.y + (info.delta.y / scale)
                });
            }}
            style={{ x: data.position.x, y: data.position.y }}
            className="absolute touch-none cursor-grab active:cursor-grabbing group z-20"
            onPointerDown={(e) => e.stopPropagation()}
        >
            {/* Running pulse ring */}
            {data.status === 'running' && (
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ boxShadow: `0 0 0 4px ${data.color}40` }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
            )}

            {/* Node Body */}
            <div
                className="relative w-[180px] bg-[#18181b] rounded-xl border border-white/10 shadow-2xl group-hover:border-white/20 transition-all overflow-hidden"
                style={glowStyle}
            >
                {/* Header / Color Strip with type badge */}
                <div className="relative h-1 w-full" style={{ backgroundColor: data.color }}>
                    <div
                        className="absolute right-3 top-1 px-1.5 py-0.5 rounded-sm text-[7px] font-black tracking-widest"
                        style={{ backgroundColor: `${data.color}30`, color: data.color }}
                    >
                        {NODE_TYPE_LABELS[data.type]}
                    </div>
                </div>

                <div className="p-3">
                    <div className="flex items-start gap-3">
                        {/* Icon Box */}
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all"
                            style={{
                                backgroundColor: `${data.color}${data.status === 'running' ? '35' : '20'}`,
                                color: data.color,
                                boxShadow: data.status === 'running' ? `0 0 12px ${data.color}50` : 'none'
                            }}
                        >
                            {data.status === 'running' ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Icon size={20} />
                                </motion.div>
                            ) : (
                                <Icon size={20} />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold text-gray-200 truncate">{data.label}</h4>
                                <div className="shrink-0">
                                    {data.status === 'success' && <CheckCircle2 size={12} className="text-emerald-500" />}
                                    {data.status === 'running' && <Loader2 size={12} className="text-purple-500 animate-spin" />}
                                    {data.status === 'error' && <X size={12} className="text-red-500" />}
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5">{data.subLabel}</p>
                        </div>
                    </div>
                </div>

                {/* Connection Points */}
                {data.type !== 'trigger' && (
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-full border-2 border-[#18181b] transition-all"
                        style={{ backgroundColor: data.color, boxShadow: `0 0 6px ${data.color}80` }}
                    />
                )}
                <div
                    className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-full border-2 border-[#18181b] group-hover:scale-125 transition-all cursor-crosshair"
                    style={{ backgroundColor: data.color, boxShadow: `0 0 6px ${data.color}80` }}
                />
            </div>
        </motion.div>
    );
};

const Connection = ({ start, end, label, animated, status, subFlow }: {
    start: Position; end: Position; label?: string; animated?: boolean; status?: string; subFlow?: boolean;
}) => {
    const cp1 = { x: start.x + Math.abs(end.x - start.x) / 2, y: start.y };
    const cp2 = { x: end.x - Math.abs(end.x - start.x) / 2, y: end.y };
    const path = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;

    // Sub-flow (tool connection): thin dashed gray line, simple
    if (subFlow) {
        const isSubActive = animated;
        return (
            <g>
                <path d={path} fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeDasharray="5 4" />
                {isSubActive && (
                    <motion.path
                        d={path}
                        fill="none"
                        stroke="#444"
                        strokeWidth="1.5"
                        strokeDasharray="5 4"
                        initial={{ pathLength: 0, opacity: 0.6 }}
                        animate={{ pathLength: 1, opacity: 0 }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    />
                )}
                {label && (
                    <g transform={`translate(${(start.x + end.x) / 2}, ${(start.y + end.y) / 2})`}>
                        <rect x="-14" y="-8" width="28" height="16" rx="3" fill="#111" stroke="#2a2a2a" />
                        <text x="0" y="3.5" textAnchor="middle" fill="#555" fontSize="8" fontWeight="600">{label}</text>
                    </g>
                )}
            </g>
        );
    }

    const baseColor = status === 'error' ? '#ef444440' : status === 'success' ? '#10b98130' : '#3a3a3a';
    const activeColor = status === 'success' ? '#10b981' : '#a855f7';

    return (
        <g>
            <path d={path} fill="none" stroke={baseColor} strokeWidth="2" strokeDasharray={status === 'error' ? '6 4' : 'none'} />
            {(animated || status === 'success') && (
                <>
                    <motion.path
                        d={path} fill="none" stroke={activeColor} strokeWidth="6" opacity={0.2}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
                        transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                    />
                    <motion.path
                        d={path} fill="none" stroke={activeColor} strokeWidth="2" strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 1 }}
                        animate={{ pathLength: 1, opacity: 0 }}
                        transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                    />
                </>
            )}
            {label && (
                <g transform={`translate(${(start.x + end.x) / 2}, ${(start.y + end.y) / 2})`}>
                    <rect x="-22" y="-10" width="44" height="20" rx="4" fill="#18181b" stroke="#2a2a2a" />
                    <text x="0" y="4" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="700">{label}</text>
                </g>
            )}
        </g>
    );
};

const ResultCard = ({ data, onClose }: { data: AIResponse['data'], onClose: () => void }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExternalLink = () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(data.name)}+name+meaning+and+origin`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-[400px] max-h-[calc(100%-2rem)] flex flex-col bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
        >
            {/* Header — fixed, never scrolls */}
            <div className="h-24 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40 px-5 py-4 relative shrink-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10 p-1 hover:bg-white/10 rounded-full">
                    <X size={16} />
                </button>
                <div className="flex items-end h-full relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-white">{data.name}</h2>
                            <div className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[9px] text-white/70 font-bold uppercase tracking-wider backdrop-blur-md">
                                Profile
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-purple-200/70 text-xs">
                            <Globe2 size={12} />
                            <span className="font-medium">{data.origin}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body — scrollable */}
            <div className="overflow-y-auto flex-1 p-4 space-y-4 scrollbar-none">
                <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1.5">Meaning & Ethos</h3>
                    <p className="text-gray-200 text-xs leading-relaxed font-medium">"{data.meaning}"</p>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">AI Cluster Profiling</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {data.traits.map((trait, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-300 font-medium">
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1.5">Metadata Analysis</h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed italic">{data.cultural_significance}</p>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="flex gap-2.5">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="shrink-0"
                        >
                            <Sparkles size={14} className="text-amber-500" />
                        </motion.div>
                        <p className="text-[11px] text-amber-200/90 italic leading-relaxed">"{data.inspiration}"</p>
                    </div>
                </div>
            </div>

            {/* Footer Actions — fixed, never scrolls */}
            <div className="flex items-center gap-2 p-4 pt-0 shrink-0">
                <button
                    onClick={handleCopy}
                    className="flex-1 h-9 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold text-gray-300 transition-all"
                >
                    {copied ? (
                        <><CheckCircle2 size={13} className="text-emerald-400" /> Copied!</>
                    ) : (
                        <><Copy size={13} /> Copy JSON</>
                    )}
                </button>
                <button
                    onClick={handleExternalLink}
                    title="Explore Origin"
                    className="h-9 px-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-300 transition-all"
                >
                    <ExternalLink size={13} />
                </button>
            </div>
        </motion.div>
    );
};

export default function AutomationDemo() {
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [edges] = useState(INITIAL_EDGES);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionStep, setExecutionStep] = useState(0);
    const [zoom, setZoom] = useState(0.65);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logsContainerRef = useRef<HTMLDivElement>(null);

    const [inputName, setInputName] = useState("");
    const [resultData, setResultData] = useState<AIResponse['data'] | null>(null);

    const [stats, setStats] = useState({
        executions: 0,
        latency: 0,
        successRate: 100,
        totalNodes: INITIAL_NODES.length
    });

    const getNodePos = useCallback((id: string, type: 'input' | 'output' = 'output') => {
        const node = nodes.find(n => n.id === id);
        if (!node) return { x: 0, y: 0 };
        const width = 180;
        const height = 70;
        return type === 'input'
            ? { x: node.position.x, y: node.position.y + height / 2 }
            : { x: node.position.x + width, y: node.position.y + height / 2 };
    }, [nodes]);

    const addLog = (message: string, type: LogEntry['type'] = 'info') => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setLogs(prev => {
            const newLogs = [...prev, { id: Math.random().toString(36).substr(2, 9), time: timeStr, message, type }];
            return newLogs.slice(-50);
        });
    };

    // Reset Workflow State
    const handleReset = () => {
        setIsExecuting(false);
        setResultData(null);
        setExecutionStep(0);
        setNodes(INITIAL_NODES.map(n => ({ ...n, status: 'idle' })));
        setLogs([]);
        addLog("Workflow state reset", "info");
    };

    // Execution Logic
    const handleExecute = async () => {
        const nameToProcess = inputName.trim();
        if (!nameToProcess) return;

        const startTime = Date.now();
        setIsExecuting(true);
        setResultData(null);
        setLogs([]);
        setExecutionStep(0);
        setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));

        try {
            // --- Step 1: Webhook Trigger ---
            addLog(`[webhook] Incoming request for "${nameToProcess}"`, "info");
            setExecutionStep(1);
            setNodes(prev => prev.map(n => n.id === 'webhook' ? { ...n, status: 'success' } : n));
            await new Promise(r => setTimeout(r, 600));

            // --- Step 2: Security & Shield ---
            setExecutionStep(2);
            addLog(`[security] Verifying JWT & Checking Rate Limits...`, "info");
            setNodes(prev => prev.map(n => n.id === 'security' ? { ...n, status: 'running' } : n));
            await new Promise(r => setTimeout(r, 800));

            if (nameToProcess.toLowerCase() === "error") {
                throw new Error("Simulated system failure: Malformed payload detected");
            }
            if (nameToProcess.length > 30) {
                throw new Error("Payload size limit exceeded");
            }

            addLog(`[security] ✓ Security check passed`, "success");
            setNodes(prev => prev.map(n => n.id === 'security' ? { ...n, status: 'success' } : n));

            // --- Step 3: AI Engine + LLM ---
            setExecutionStep(3);
            addLog(`[ai-agent] Initializing Claude 3.5 Sonnet instance...`, "info");
            setNodes(prev => prev.map(n =>
                ['ai-agent', 'llm-provider'].includes(n.id) ? { ...n, status: 'running' } : n
            ));

            const response = await fetch("https://n8n.pipisara.me/webhook/ai-name-intelligence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameToProcess })
            });

            if (!response.ok) throw new Error(`Upstream AI Error: ${response.status}`);

            addLog(`[ai-agent] Intelligence gathered successfully`, "success");
            setNodes(prev => prev.map(n =>
                ['ai-agent', 'llm-provider'].includes(n.id) ? { ...n, status: 'success' } : n
            ));

            // --- Step 4: Persistence ---
            setExecutionStep(4);
            addLog(`[persistence] Committing to Vector Database...`, "info");
            setNodes(prev => prev.map(n =>
                ['persistence', 'cache'].includes(n.id) ? { ...n, status: 'running' } : n
            ));
            await new Promise(r => setTimeout(r, 700));
            addLog(`[cache] Schema synchronized`, "info");
            addLog(`[persistence] ✓ Records persisted at index 0x${Math.floor(Math.random() * 0xffffff).toString(16)}`, "success");
            setNodes(prev => prev.map(n =>
                ['persistence', 'cache'].includes(n.id) ? { ...n, status: 'success' } : n
            ));

            // --- Step 5: Final Response ---
            setExecutionStep(5);
            addLog(`[response] Returning JSON payload to client`, "info");
            setNodes(prev => prev.map(n => n.id === 'response' ? { ...n, status: 'success' } : n));

            const result: AIResponse = await response.json();
            if (result.status === 'error') throw new Error(result.message || "Logic Engine Error");

            const latency = Date.now() - startTime;
            setResultData(result.data);
            setStats(prev => ({
                executions: prev.executions + 1,
                latency: Math.round((prev.latency * prev.executions + latency) / (prev.executions + 1)),
                successRate: Math.round((prev.executions * prev.successRate + 100) / (prev.executions + 1)),
                totalNodes: INITIAL_NODES.length
            }));
            addLog(`[pipeline] Complete — Total latency: ${latency}ms`, "success");

        } catch (err: any) {
            addLog(`[error] CRITICAL: ${err.message}`, "error");

            // Highlight Error Path
            setNodes(prev => prev.map(n => {
                if (n.status === 'running') return { ...n, status: 'error' };
                if (['error-handler', 'slack-alert'].includes(n.id)) return { ...n, status: 'error' };
                return n;
            }));

            addLog(`[error-handler] Exception trapped. Routing to Slack alert.`, "warning");
            addLog(`[slack-alert] Admin notified of failure.`, "info");

            setStats(prev => ({
                ...prev,
                executions: prev.executions + 1,
                successRate: Math.round((prev.executions * prev.successRate + 0) / (prev.executions + 1))
            }));
        } finally {
            setIsExecuting(false);
        }
    };

    // Auto-scroll logs
    useEffect(() => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const updateNodePosition = (id: string, pos: Position) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, position: pos } : n));
    };

    return (
        <div className="w-full h-full bg-[#09090b] relative overflow-hidden flex flex-col font-sans select-none text-foreground">

            {/* Top Bar */}
            <div className="h-16 border-b border-white/5 bg-[#0f0f13] px-6 flex items-center justify-between z-40 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] relative">
                            <BrainCircuit size={22} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-tight">AI Intelligence Pipeline v2.4</h2>
                        <p className="text-[10px] text-gray-500 max-w-[280px] leading-tight mt-0.5 font-medium uppercase tracking-wider">
                            Real-time autonomous automation workflow.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <input
                            type="text"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder="Enter a name to analyze..."
                            maxLength={30}
                            disabled={isExecuting}
                            className="h-10 w-64 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all disabled:opacity-50 ring-0 focus:ring-1 focus:ring-purple-500/20 shadow-inner"
                            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-gray-700 pointer-events-none group-focus-within:text-gray-500 transition-colors">
                            {inputName.length}/30
                        </div>
                    </div>

                    <button
                        onClick={handleExecute}
                        disabled={isExecuting || !inputName.trim()}
                        className={`h-10 px-6 rounded-xl flex items-center gap-2 text-xs font-black transition-all
                        ${isExecuting
                                ? 'bg-purple-500/10 text-purple-400 cursor-not-allowed border border-purple-500/20'
                                : !inputName.trim()
                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_8px_24px_-4px_rgba(168,85,247,0.4)] hover:scale-[1.03] active:scale-[0.98]'
                            }
                    `}
                    >
                        {isExecuting ? (
                            <><Loader2 size={14} className="animate-spin" /> EXECUTING...</>
                        ) : (
                            <><Play size={14} fill="currentColor" /> RUN PIPELINE</>
                        )}
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <button
                        onClick={handleReset}
                        title="Reset Workflow"
                        className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all flex items-center justify-center"
                    >
                        <RotateCcw size={16} />
                    </button>

                    <button className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all flex items-center justify-center">
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Execution Progress Bar */}
            <div className="h-0.5 bg-white/5 shrink-0 relative overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-indigo-500"
                    style={{ boxShadow: '0 0 8px rgba(168,85,247,0.7)' }}
                    animate={{ width: isExecuting ? `${(executionStep / 5) * 100}%` : executionStep >= 5 ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            {/* Editor Area */}
            <div className="relative flex-1 bg-[#09090b] overflow-hidden">
                {/* Background Grid - Stays fixed or moves depending on approach. 
                    Let's make it follow the pan. */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(#ffffff0a 1px, transparent 1px)`,
                        backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
                        backgroundPosition: `${pan.x}px ${pan.y}px`,
                    }}
                />

                {/* Canvas Panning Wrapper */}
                <motion.div
                    drag
                    dragMomentum={false}
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                    onDrag={(_, info) => {
                        setPan(prev => ({
                            x: prev.x + info.delta.x,
                            y: prev.y + info.delta.y
                        }));
                    }}
                >
                    {/* Zoomable Content */}
                    <motion.div
                        className="absolute inset-0 origin-center"
                        animate={{ scale: zoom, x: pan.x, y: pan.y }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {/* Edges */}
                        <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: '5000px', height: '5000px', left: '-2000px', top: '-1500px' }}>
                            <g transform="translate(2000, 1500)">
                                {edges.map(edge => {
                                    const start = getNodePos(edge.source, 'output');
                                    const end = getNodePos(edge.target, 'input');
                                    const sourceNode = nodes.find(n => n.id === edge.source);
                                    const targetNode = nodes.find(n => n.id === edge.target);

                                    const isAnimated = sourceNode?.status === 'running' || sourceNode?.status === 'success';
                                    const status = targetNode?.status === 'success' ? 'success' : sourceNode?.status === 'error' ? 'error' : 'idle';

                                    return (
                                        <Connection
                                            key={edge.id}
                                            start={start}
                                            end={end}
                                            label={edge.label}
                                            animated={isAnimated}
                                            status={status}
                                            subFlow={edge.subFlow}
                                        />
                                    );
                                })}
                            </g>
                        </svg>

                        {/* Nodes Container */}
                        <div className="absolute inset-0 z-20">
                            {nodes.map(node => (
                                <Node
                                    key={node.id}
                                    data={node}
                                    scale={zoom}
                                    onDrag={updateNodePosition}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Stats Overlay Panel (New) */}
                <div className="absolute top-6 right-6 z-40 flex flex-col gap-3 pointer-events-none">
                    <div className="bg-[#18181b]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 w-56 flex flex-col gap-4 pointer-events-auto">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Instance Stats</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className="text-[9px] text-emerald-500 font-bold uppercase">Active</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] text-gray-500 font-medium">Executions</span>
                                <span className="text-sm font-black text-white">{stats.executions}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 text-right">
                                <span className="text-[9px] text-gray-500 font-medium">Avg Latency</span>
                                <span className="text-sm font-black text-white">{stats.latency}ms</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] text-gray-500 font-medium">Success Rate</span>
                                <span className="text-sm font-black text-emerald-400">{stats.successRate}%</span>
                            </div>
                            <div className="flex flex-col gap-0.5 text-right">
                                <span className="text-[9px] text-gray-500 font-medium">Total Nodes</span>
                                <span className="text-sm font-black text-purple-400">{stats.totalNodes}</span>
                            </div>
                        </div>

                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                animate={{ width: `${stats.successRate}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Live Console Overlay (Fixed position) */}
                <div className="absolute bottom-6 left-6 w-72 z-40 flex flex-col gap-3 pointer-events-none">
                    <div className="bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
                        <div className="h-9 px-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <Terminal size={12} className="text-purple-400" />
                                <span>Execution Stream</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] text-gray-500 font-mono">LIVE</span>
                            </div>
                        </div>

                        <div
                            ref={logsContainerRef}
                            className="h-40 overflow-y-auto p-4 font-mono text-[10px] space-y-2 scrollbar-none"
                        >
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-2 opacity-50">
                                    <Clock size={20} className="mb-1" />
                                    <span>Awaiting triggers...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {logs.map(log => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex gap-2.5 items-start"
                                        >
                                            <span className="text-gray-600 shrink-0 select-none opacity-50">[{log.time}]</span>
                                            <span className={`
                                                break-words flex-1 leading-relaxed
                                                ${log.type === 'error' ? 'text-red-400 bg-red-400/5 px-1 rounded' : ''}
                                                ${log.type === 'success' ? 'text-emerald-400' : ''}
                                                ${log.type === 'warning' ? 'text-amber-400' : ''}
                                                ${log.type === 'info' ? 'text-gray-400' : ''}
                                            `}>
                                                {log.type === 'success' && '✓ '}
                                                {log.message}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Overlay */}
                <AnimatePresence>
                    {resultData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        >
                            <ResultCard data={resultData} onClose={() => setResultData(null)} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Canvas Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 items-center">
                    {/* Zoom Level Pill */}
                    <div className="px-3 py-1 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
                        <span className="text-[10px] font-black text-gray-400 tabular-nums">{Math.round(zoom * 100)}%</span>
                    </div>

                    <div className="p-1.5 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-1 shadow-2xl">
                        <button
                            onClick={() => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 1.5))}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white active:scale-95"
                            title="Zoom In"
                        >
                            <ZoomIn size={18} />
                        </button>
                        <button
                            onClick={() => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.3))}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white active:scale-95"
                            title="Zoom Out"
                        >
                            <ZoomOut size={18} />
                        </button>
                        <div className="h-px bg-white/10 mx-2 my-1" />
                        <button
                            onClick={() => { setZoom(0.65); setPan({ x: 0, y: 0 }); }}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white active:scale-95"
                            title="Recenter Canvas"
                        >
                            <Maximize size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
