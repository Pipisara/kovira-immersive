import React, { useState, useEffect, useRef } from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
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
    Sparkles
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
    {
        id: "webhook",
        type: "trigger",
        label: "Webhook",
        subLabel: "Receive Name",
        icon: Zap,
        position: { x: 50, y: 250 },
        color: "#22c55e", // Green
        status: "idle",
        outputs: ["main"],
    },
    {
        id: "validation",
        type: "action",
        label: "Validator",
        subLabel: "Sanitize Input",
        icon: Code,
        position: { x: 300, y: 250 },
        color: "#f59e0b", // Amber
        status: "idle",
        outputs: ["main"],
    },
    {
        id: "ai-engine",
        type: "action",
        label: "AI Engine",
        subLabel: "LLM Processing",
        icon: BrainCircuit,
        position: { x: 550, y: 250 },
        color: "#a855f7", // Purple
        status: "idle",
        outputs: ["main"],
    },
    {
        id: "database",
        type: "action",
        label: "Enrichment",
        subLabel: "Cultural DB",
        icon: Database,
        position: { x: 800, y: 250 },
        color: "#3b82f6", // Blue
        status: "idle",
        outputs: ["main"],
    },
    {
        id: "response",
        type: "action",
        label: "Response",
        subLabel: "Return JSON",
        icon: Terminal,
        position: { x: 1050, y: 250 },
        color: "#ea4335", // Red
        status: "idle",
        outputs: ["main"],
    },
];

const INITIAL_EDGES: EdgeData[] = [
    { id: "e1", source: "webhook", target: "validation" },
    { id: "e2", source: "validation", target: "ai-engine" },
    { id: "e3", source: "ai-engine", target: "database" },
    { id: "e4", source: "database", target: "response" },
];

// --- Components ---

const Node = ({
    data,
    scale,
    onDragEnd
}: {
    data: NodeData;
    scale: number;
    onDragEnd: (id: string, pos: Position) => void
}) => {
    const Icon = data.icon;

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={(_, info: PanInfo) => {
                onDragEnd(data.id, {
                    x: data.position.x + (info.offset.x / scale),
                    y: data.position.y + (info.offset.y / scale)
                });
            }}
            initial={{ x: data.position.x, y: data.position.y }}
            className="absolute touch-none cursor-grab active:cursor-grabbing group z-20"
            onPointerDown={(e) => e.stopPropagation()}
        >
            {/* Node Body */}
            <div className={`
            relative w-[180px] bg-[#1a1a1a] rounded-xl border border-white/10 shadow-xl 
            group-hover:border-white/20 transition-all overflow-hidden
            ${data.status === 'running' ? 'ring-2 ring-purple-500/50' : ''}
            ${data.status === 'success' ? 'ring-2 ring-emerald-500/50' : ''}
            ${data.status === 'error' ? 'ring-2 ring-red-500/50' : ''}
        `}>
                {/* Header / Color Strip */}
                <div className="h-1 w-full" style={{ backgroundColor: data.color }} />

                <div className="p-3">
                    <div className="flex items-start gap-3">
                        {/* Icon Box */}
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${data.color}20`, color: data.color }}
                        >
                            <Icon size={20} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-gray-200 truncate">{data.label}</h4>
                                {data.status === 'success' && <CheckCircle2 size={12} className="text-emerald-500" />}
                                {data.status === 'running' && <Loader2 size={12} className="text-purple-500 animate-spin" />}
                            </div>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5">{data.subLabel}</p>
                        </div>
                    </div>
                </div>

                {/* Connection Points */}
                {data.type !== 'trigger' && (
                    <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-gray-400 rounded-full border-2 border-[#1a1a1a]" />
                )}
                <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-gray-400 rounded-full border-2 border-[#1a1a1a] group-hover:scale-125 transition-transform cursor-crosshair" />
            </div>
        </motion.div>
    );
};

const Connection = ({ start, end, label, animated }: { start: Position; end: Position; label?: string; animated?: boolean }) => {
    const cp1 = { x: start.x + Math.abs(end.x - start.x) / 2, y: start.y };
    const cp2 = { x: end.x - Math.abs(end.x - start.x) / 2, y: end.y };
    const path = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;

    return (
        <g>
            <path d={path} fill="none" stroke="#4a4a4a" strokeWidth="2" />
            {animated && (
                <motion.path
                    d={path}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
                />
            )}
            {label && (
                <g transform={`translate(${(start.x + end.x) / 2}, ${(start.y + end.y) / 2})`}>
                    <rect x="-20" y="-10" width="40" height="20" rx="4" fill="#1a1a1a" stroke="#333" />
                    <text x="0" y="4" textAnchor="middle" fill="#888" fontSize="9" fontWeight="500">{label}</text>
                </g>
            )}
        </g>
    );
};

const ResultCard = ({ data, onClose }: { data: AIResponse['data'], onClose: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
            {/* Header */}
            <div className="h-32 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors">
                    <X size={16} />
                </button>
                <div className="flex items-end h-full">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">{data.name}</h2>
                        <div className="flex items-center gap-2 text-purple-200/70 text-sm">
                            <Globe2 size={14} />
                            <span>{data.origin}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Meaning</h3>
                    <p className="text-gray-200 text-sm leading-relaxed font-medium">"{data.meaning}"</p>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Personality Traits</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.traits.map((trait, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Cultural Significance</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{data.cultural_significance}</p>
                </div>

                <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="flex gap-2">
                        <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-200/90 italic">"{data.inspiration}"</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function AutomationDemo() {
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [edges] = useState(INITIAL_EDGES);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionStep, setExecutionStep] = useState(0); // 0: idle, 1: validation, 2: AI, 3: DB, 4: Response
    const [zoom, setZoom] = useState(0.65);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logsContainerRef = useRef<HTMLDivElement>(null);

    const [inputName, setInputName] = useState("");
    const [resultData, setResultData] = useState<AIResponse['data'] | null>(null);

    const getNodePos = (id: string, type: 'input' | 'output' = 'output') => {
        const node = nodes.find(n => n.id === id);
        if (!node) return { x: 0, y: 0 };
        const width = 180;
        const height = 70;
        return type === 'input'
            ? { x: node.position.x, y: node.position.y + height / 2 }
            : { x: node.position.x + width, y: node.position.y + height / 2 };
    };

    const addLog = (message: string, type: LogEntry['type'] = 'info') => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setLogs(prev => [...prev, { id: Math.random().toString(36), time: timeStr, message, type }]);
    };

    // Execution Logic
    const handleExecute = async () => {
        const nameToProcess = inputName.trim();
        if (!nameToProcess) return;

        setIsExecuting(true);
        setResultData(null);
        setLogs([]);
        setExecutionStep(0);
        setNodes(INITIAL_NODES.map(n => ({ ...n, status: 'idle' })));

        try {
            // --- Step 1: Webhook & Validation ---
            addLog("Connecting to automation engine...", "info");
            setExecutionStep(1);
            setNodes(prev => prev.map(n => n.id === 'webhook' ? { ...n, status: 'success' } : n));

            await new Promise(r => setTimeout(r, 600)); // Visual delay
            setNodes(prev => prev.map(n => n.id === 'validation' ? { ...n, status: 'running' } : n));

            if (nameToProcess.length > 30) {
                throw new Error("Name is too long (max 30 chars)");
            }
            addLog("Input validated successfully", "success");
            setNodes(prev => prev.map(n => n.id === 'validation' ? { ...n, status: 'success' } : n));

            // --- Step 2: AI Processing (Real Fetch) ---
            setExecutionStep(2);
            setNodes(prev => prev.map(n => n.id === 'ai-engine' ? { ...n, status: 'running' } : n));
            addLog("AI analyzing linguistic origins...", "info");

            const response = await fetch("http://n8n.pipisara.me:5678/webhook/ai-name-intelligence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameToProcess })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            addLog("Generating personality profile...", "info");
            setNodes(prev => prev.map(n => n.id === 'ai-engine' ? { ...n, status: 'success' } : n));

            // --- Step 3: DB & Formatting ---
            setExecutionStep(3);
            setNodes(prev => prev.map(n => n.id === 'database' ? { ...n, status: 'running' } : n));
            await new Promise(r => setTimeout(r, 800)); // Visual delay for effect
            setNodes(prev => prev.map(n => n.id === 'database' ? { ...n, status: 'success' } : n));

            // --- Step 4: Final Response ---
            setExecutionStep(4);
            setNodes(prev => prev.map(n => n.id === 'response' ? { ...n, status: 'success' } : n));

            const result: AIResponse = await response.json();
            if (result.status === 'error') {
                throw new Error(result.message || "Unknown error from AI engine");
            }

            setResultData(result.data);
            addLog("Workflow completed successfully", "success");
            addLog(`Execution ID: ${result.execution_id}`, "info");

        } catch (err: any) {
            addLog(`Error: ${err.message}`, "error");
            setNodes(prev => prev.map(n => n.status === 'running' ? { ...n, status: 'error' } : n));
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

    // Dynamic status logic for visual edges
    const getSimulatedNodeStatus = (node: NodeData) => {
        // In this version we rely on declarative state updates in handleExecute, 
        // but we can fallback or augment here if needed.
        return node.status;
    };

    // Helper for nodes array (so edges know what to track)
    const renderedNodes = nodes;

    return (
        <div className="w-full h-full bg-[#0F0F0F] relative overflow-hidden flex flex-col font-sans select-none text-foreground">

            {/* Top Bar */}
            <div className="h-16 border-b border-white/5 bg-[#141414] px-4 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                        <BrainCircuit size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-200">AI Name Intelligence</h2>
                        <p className="text-[10px] text-gray-500 max-w-[250px] leading-tight mt-0.5">
                            Experience live AI-powered automation. Your input is processed in real-time.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <input
                            type="text"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder="Enter a name..."
                            maxLength={30}
                            disabled={isExecuting}
                            className="h-9 w-48 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all disabled:opacity-50"
                            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-600 pointer-events-none group-focus-within:opacity-0">
                            {inputName.length}/30
                        </div>
                    </div>

                    <button
                        onClick={handleExecute}
                        disabled={isExecuting || !inputName.trim()}
                        className={`h-9 px-4 rounded-lg flex items-center gap-2 text-xs font-bold transition-all
                        ${isExecuting
                                ? 'bg-purple-500/20 text-purple-300 cursor-not-allowed border border-purple-500/30'
                                : !inputName.trim()
                                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20 hover:scale-[1.02]'
                            }
                    `}
                    >
                        {isExecuting ? (
                            <><Loader2 size={12} className="animate-spin" /> Processing...</>
                        ) : (
                            <><Play size={12} fill="currentColor" /> Execute Workflow</>
                        )}
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    <button className="h-8 w-8 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                        <Settings size={14} />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="relative flex-1 bg-[#0F0F0F] overflow-hidden cursor-grab active:cursor-grabbing">
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                        backgroundPosition: '10px 10px'
                    }}
                />

                {/* Canvas */}
                <motion.div
                    className="absolute inset-0 origin-top-left"
                    animate={{ scale: zoom }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Edges */}
                    <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: '300%', height: '300%' }}>
                        {edges.map(edge => {
                            const start = getNodePos(edge.source, 'output');
                            const end = getNodePos(edge.target, 'input');
                            // Animate edge if source is running or success. 
                            const sourceNode = nodes.find(n => n.id === edge.source);
                            const isAnimated = sourceNode?.status === 'running' || sourceNode?.status === 'success';

                            return (
                                <Connection
                                    key={edge.id}
                                    start={start}
                                    end={end}
                                    label={edge.label}
                                    animated={isAnimated}
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes */}
                    {nodes.map(node => (
                        <Node
                            key={node.id}
                            data={node}
                            scale={zoom}
                            onDragEnd={(id, pos) => setNodes(prev => prev.map(n => n.id === id ? { ...n, position: pos } : n))}
                        />
                    ))}
                </motion.div>

                {/* Logic Console Window */}
                <div className="absolute bottom-4 left-4 w-60 z-30 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
                        <div className="h-7 px-2.5 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-300">
                                <Terminal size={10} className="text-gray-500" />
                                <span>Live Execution Log</span>
                            </div>
                        </div>

                        <div
                            ref={logsContainerRef}
                            className="h-32 overflow-y-auto p-2 font-mono text-[9px] space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                        >
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-1">
                                    <Clock size={16} className="opacity-20" />
                                    <span className="opacity-40">Ready...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {logs.map(log => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex gap-1.5 items-start"
                                        >
                                            <span className="text-gray-600 shrink-0 select-none opacity-70">[{log.time}]</span>
                                            <span className={`
                                              break-words flex-1
                                              ${log.type === 'error' ? 'text-red-400' : ''}
                                              ${log.type === 'success' ? 'text-emerald-400' : ''}
                                              ${log.type === 'warning' ? 'text-amber-400' : ''}
                                              ${log.type === 'info' ? 'text-gray-300' : ''}
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
                        <div className="absolute inset-0 z-40 bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                            <div className="pointer-events-auto">
                                <ResultCard data={resultData} onClose={() => setResultData(null)} />
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Floating Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
                    <div className="p-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg flex flex-col gap-1 shadow-xl">
                        <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
                            <ZoomIn size={14} />
                        </button>
                        <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
                            <ZoomOut size={14} />
                        </button>
                        <div className="h-px bg-white/10 my-0.5" />
                        <button onClick={() => setZoom(0.65)} className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
                            <Maximize size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
