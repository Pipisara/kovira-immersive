import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Cloud,
    Shield,
    Router as RouterIcon,
    Network,
    Wifi,
    Server,
    Monitor,
    Laptop,
    Smartphone,
    Layers as LayersIcon,
    Plus,
    Search,
    MousePointer2,
    Share2,
    Download,
    Save,
    Trash2,
    Settings2,
    Info,
    ChevronRight,
    Lock,
    Zap,
    X,
    Activity,
    HardDrive,
    Terminal
} from "lucide-react";

// --- Types ---

type Status = "optimal" | "warning" | "error" | "offline";

interface Position {
    x: number;
    y: number;
}

interface NodeData {
    id: string;
    type: "internet" | "firewall" | "router" | "switch" | "wireless" | "server" | "pc" | "laptop" | "smartphone";
    label: string;
    position: Position;
    icon: any;
    status: Status;
    latency: number;
    throughput?: string;
}

interface EdgeData {
    id: string;
    source: string;
    target: string;
    type: "solid" | "dashed";
}

// --- Icons Mapping ---
const ICON_MAP = {
    internet: Cloud,
    firewall: Shield,
    router: RouterIcon,
    switch: Network,
    wireless: Wifi,
    server: Server,
    pc: Monitor,
    laptop: Laptop,
    smartphone: Smartphone
};

// --- Constants & Initial Data ---

const INITIAL_NODES: NodeData[] = [
    { id: "internet", type: "internet", label: "Internet Gateway", position: { x: 500, y: 80 }, icon: Cloud, status: "optimal", latency: 12 },
    { id: "fw-top", type: "firewall", label: "Main Edge Firewall", position: { x: 500, y: 200 }, icon: Shield, status: "optimal", latency: 1 },
    { id: "core-router", type: "router", label: "Core Router 01", position: { x: 500, y: 350 }, icon: RouterIcon, status: "optimal", latency: 2 },
    { id: "fw-left", type: "firewall", label: "DMZ Firewall", position: { x: 380, y: 350 }, icon: Shield, status: "optimal", latency: 1 },
    { id: "switch-left", type: "switch", label: "Server Rack Switch", position: { x: 280, y: 350 }, icon: Network, status: "optimal", latency: 1 },
    { id: "auth-server", type: "server", label: "Auth Server", position: { x: 180, y: 350 }, icon: Server, status: "optimal", latency: 4 },
    { id: "db-server", type: "server", label: "Database Node", position: { x: 200, y: 550 }, icon: Server, status: "warning", latency: 45 },
    { id: "file-server", type: "server", label: "Asset Storage", position: { x: 300, y: 550 }, icon: Server, status: "optimal", latency: 8 },
    { id: "app-server", type: "server", label: "Application Server", position: { x: 400, y: 550 }, icon: Server, status: "optimal", latency: 15 },
    { id: "wireless-router", type: "wireless", label: "WAP Office-A", position: { x: 500, y: 560 }, icon: Wifi, status: "optimal", latency: 5 },
    { id: "smartphone", type: "smartphone", label: "Employee Phone", position: { x: 450, y: 750 }, icon: Smartphone, status: "optimal", latency: 22 },
    { id: "laptop", type: "laptop", label: "Company Laptop", position: { x: 550, y: 750 }, icon: Laptop, status: "optimal", latency: 18 },
    { id: "switch-right", type: "switch", label: "VLAN-20 Switch", position: { x: 700, y: 350 }, icon: Network, status: "optimal", latency: 1 },
    { id: "pc-1", type: "pc", label: "Station-01", position: { x: 620, y: 550 }, icon: Monitor, status: "optimal", latency: 5 },
    { id: "pc-2", type: "pc", label: "Station-02", position: { x: 700, y: 550 }, icon: Monitor, status: "offline", latency: 0 },
    { id: "pc-3", type: "pc", label: "Station-03", position: { x: 780, y: 550 }, icon: Monitor, status: "optimal", latency: 7 },
];

const INITIAL_EDGES: EdgeData[] = [
    { id: "e1", source: "internet", target: "fw-top", type: "solid" },
    { id: "e2", source: "fw-top", target: "core-router", type: "solid" },
    { id: "e3", source: "core-router", target: "fw-left", type: "solid" },
    { id: "e4", source: "fw-left", target: "switch-left", type: "solid" },
    { id: "e5", source: "switch-left", target: "auth-server", type: "solid" },
    { id: "e6", source: "switch-left", target: "file-server", type: "solid" },
    { id: "e7", source: "core-router", target: "wireless-router", type: "solid" },
    { id: "e8", source: "wireless-router", target: "smartphone", type: "dashed" },
    { id: "e9", source: "wireless-router", target: "laptop", type: "dashed" },
    { id: "e10", source: "core-router", target: "switch-right", type: "solid" },
    { id: "e11", source: "switch-right", target: "pc-1", type: "solid" },
    { id: "e12", source: "switch-right", target: "pc-2", type: "solid" },
    { id: "e13", source: "switch-right", target: "pc-3", type: "solid" },
    { id: "e14", source: "auth-server", target: "db-server", type: "dashed" },
];

// --- Sub-components ---

const LayersPanel = ({ activeLayer, setActiveLayer }: { activeLayer: string, setActiveLayer: (l: string) => void }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 left-6 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 p-5 z-50 pointer-events-auto"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500">
                    <LayersIcon size={18} />
                </div>
                <span className="text-sm font-bold text-gray-800">Layers</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><Plus size={16} /></button>
        </div>

        <div className="space-y-2">
            {[
                { id: 'physical', label: 'Physical Topology', desc: 'Hardware layout & cabling' },
                { id: 'logical', label: 'Logical Overlay', desc: 'VLANs & Subnets' },
                { id: 'security', label: 'Security Zones', desc: 'Firewall rules & DMZs' }
            ].map((layer) => (
                <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${activeLayer === layer.id ? 'bg-pink-50 border-pink-200' : 'hover:bg-gray-50 border-transparent'}`}
                >
                    <div className="text-[11px] font-bold text-gray-800">{layer.label}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5">{layer.desc}</div>
                </button>
            ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-[10px] text-gray-400">
            Learn more about <span className="text-blue-500 cursor-pointer hover:underline">canvas layering</span>.
        </div>
    </motion.div>
);

const Toolbar = ({ activeTool, setActiveTool, onSave }: { activeTool: string, setActiveTool: (t: string) => void, onSave: () => void }) => (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/90 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl z-50">
        {[
            { id: 'select', icon: MousePointer2, label: 'Select' },
            { id: 'add', icon: Plus, label: 'Add Node' },
            { id: 'connect', icon: Zap, label: 'Connect' },
            { id: 'delete', icon: Trash2, label: 'Remove' },
            { id: 'save', icon: Save, label: 'Save Draft' },
        ].map((item) => (
            <button
                key={item.id}
                onClick={() => item.id === 'save' ? onSave() : setActiveTool(item.id)}
                title={item.label}
                className={`p-3 rounded-xl transition-all ${activeTool === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
                <item.icon size={20} />
            </button>
        ))}
        <div className="w-px h-8 bg-white/10 mx-1" />
        <button className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10">
            <Share2 size={20} />
        </button>
    </div>
);

const NodeLibrary = ({ onAdd, selectedId }: { onAdd: (type: NodeData['type']) => void, selectedId: string | null }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`absolute top-20 transition-all duration-300 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 overflow-y-auto max-h-[400px] ${selectedId ? 'right-[310px]' : 'right-6'}`}
    >
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Components</h4>
        <div className="grid grid-cols-2 gap-2">
            {Object.entries(ICON_MAP).map(([type, Icon]: [any, any]) => (
                <button
                    key={type}
                    onClick={() => onAdd(type as any)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Icon size={20} />
                    </div>
                    <span className="text-[9px] font-medium text-gray-600 capitalize">{type}</span>
                </button>
            ))}
        </div>
    </motion.div>
);

const NetworkNode = ({
    data,
    isSelected,
    onClick,
    onDrag
}: {
    data: NodeData,
    isSelected: boolean,
    onClick: () => void,
    onDrag: (id: string, pos: Position) => void
}) => {
    const Icon = data.icon;
    const isIsometric = ['firewall', 'router', 'switch', 'server'].includes(data.type);

    const statusColors = {
        optimal: "text-blue-600 bg-blue-500/10",
        warning: "text-amber-600 bg-amber-500/10",
        error: "text-red-600 bg-red-500/10",
        offline: "text-gray-400 bg-gray-500/10"
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDrag={(_, info) => onDrag(data.id, { x: data.position.x + info.delta.x, y: data.position.y + info.delta.y })}
            style={{ left: data.position.x, top: data.position.y }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20`}
        >
            <div className="flex flex-col items-center gap-2">
                <div className={`
                    relative p-4 rounded-2xl transition-all duration-300
                    ${isSelected ? 'scale-110 shadow-[0_0_0_3px_#3b82f640,0_10px_30px_rgba(0,0,0,0.1)] bg-white' : 'scale-100'}
                    group-hover:scale-110
                `}>
                    <div className={`
                        relative z-10 flex items-center justify-center
                        ${data.status === 'offline' ? 'text-gray-300' : isIsometric ? 'text-blue-700' : 'text-blue-500'}
                    `}>
                        <Icon size={isIsometric ? 44 : 38} strokeWidth={1.2} />

                        {/* Status indicator pulse */}
                        {data.status !== 'offline' && (
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${data.status === 'optimal' ? 'bg-emerald-500' : data.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <span className={`text-[10px] font-bold whitespace-nowrap px-2 py-0.5 rounded-full border shadow-sm transition-colors ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/90 text-gray-700 border-gray-100'}`}>
                        {data.label}
                    </span>
                    {data.status !== 'offline' && (
                        <span className="text-[8px] font-medium text-gray-400 mt-1">
                            {data.latency}ms
                        </span>
                    )}
                </div>
            </div>

            {/* Selection indicators */}
            {isSelected && (
                <div className="absolute inset-x-0 -top-2 flex justify-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>
            )}
        </motion.div>
    );
};

export default function NetworkDemo() {
    const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
    const [edges, setEdges] = useState<EdgeData[]>(INITIAL_EDGES);
    const [zoom, setZoom] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState('select');
    const [activeLayer, setActiveLayer] = useState('physical');
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const selectedNode = useMemo(() => nodes.find(n => n.id === selectedId), [nodes, selectedId]);

    // Live Latency Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setNodes(curr => curr.map(n => {
                if (n.status === 'offline') return n;
                const jitter = Math.floor(Math.random() * 5) - 2;
                return { ...n, latency: Math.max(1, n.latency + jitter) };
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleNodeDrag = useCallback((id: string, pos: Position) => {
        setNodes(curr => curr.map(n => n.id === id ? { ...n, position: pos } : n));
    }, []);

    const handleAddNode = (type: keyof typeof ICON_MAP) => {
        const newNode: NodeData = {
            id: `node-${Date.now()}`,
            type,
            label: `New ${type}`,
            position: { x: 500, y: 400 },
            icon: ICON_MAP[type],
            status: "optimal",
            latency: 10
        };
        setNodes(curr => [...curr, newNode]);
        setSelectedId(newNode.id);
        setIsLibraryOpen(false);
    };

    const handleDeleteNode = () => {
        if (!selectedId) return;
        setNodes(curr => curr.filter(n => n.id !== selectedId));
        setEdges(curr => curr.filter(e => e.source !== selectedId && e.target !== selectedId));
        setSelectedId(null);
    };

    const updateNodeProperty = (property: string, value: any) => {
        if (!selectedId) return;
        setNodes(curr => curr.map(n => n.id === selectedId ? { ...n, [property]: value } : n));
    };

    const handleSave = () => {
        alert("Topology saved to repository.");
    };

    return (
        <div className="relative w-full h-full bg-[#f8f9fc] overflow-hidden rounded-xl border border-gray-200" onClick={() => setSelectedId(null)}>
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#2563eb 0.5px, transparent 0)`,
                    backgroundSize: `${25 * zoom}px ${25 * zoom}px`
                }}
            />

            {/* Nav Header */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-40">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <Activity size={22} />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-black text-gray-900 leading-none">NetArchitect <span className="text-blue-600 uppercase text-[10px] ml-1 tracking-tighter">Pro</span></h2>
                            <p className="text-[10px] text-gray-400 font-medium mt-1">Live Environment: <span className="text-emerald-500">Corporate_V3_Production</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Live Sync</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Settings2 size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg active:scale-95">
                        <Lock size={14} />
                        Freeze Model
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="relative w-full h-full pt-16 pointer-events-auto overflow-auto scrollbar-none cursor-grab active:cursor-grabbing">
                <div
                    className="min-w-full h-[1000px] transition-transform duration-75 relative"
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: '0 0'
                    }}
                >
                    {/* Connections Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {edges.map(edge => {
                            const source = nodes.find(n => n.id === edge.source);
                            const target = nodes.find(n => n.id === edge.target);
                            if (!source || !target) return null;

                            const x1 = source.position.x;
                            const y1 = source.position.y;
                            const x2 = target.position.x;
                            const y2 = target.position.y;

                            let pathData = `M ${x1} ${y1} L ${x2} ${y2}`;

                            // Advanced Bus Routing
                            if (edge.source === 'switch-left' && ['db-server', 'file-server', 'app-server'].includes(edge.target)) {
                                const busY = (y1 + y2) / 2;
                                pathData = `M ${x1} ${y1} V ${busY} H ${x2} V ${y2}`;
                            } else if (edge.source === 'switch-right' && edge.target.startsWith('pc-')) {
                                const busY = (y1 + y2) / 2;
                                pathData = `M ${x1} ${y1} V ${busY} H ${x2} V ${y2}`;
                            } else if (edge.id === 'e14') {
                                pathData = `M ${x1} ${y1} Q ${(x1 + x2) / 2 - 40} ${(y1 + y2) / 2} ${x2} ${y2}`;
                            }

                            return (
                                <g key={edge.id}>
                                    <path
                                        d={pathData}
                                        fill="none"
                                        stroke={target.status === 'offline' ? '#e2e8f0' : '#cbd5e1'}
                                        strokeWidth="2"
                                        strokeDasharray={edge.type === 'dashed' ? "6,6" : "0"}
                                        className="transition-all duration-500"
                                    />
                                    {/* Motion pulse on optimal paths */}
                                    {target.status === 'optimal' && !edge.id.includes('dashed') && (
                                        <motion.path
                                            d={pathData}
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                            strokeOpacity="0.3"
                                            strokeDasharray="10,20"
                                            animate={{ strokeDashoffset: -30 }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Nodes Layer */}
                    {nodes.map(node => (
                        <NetworkNode
                            key={node.id}
                            data={node}
                            isSelected={selectedId === node.id}
                            onClick={() => setSelectedId(node.id)}
                            onDrag={handleNodeDrag}
                        />
                    ))}
                </div>
            </div>

            {/* Interactive Overlays */}
            <LayersPanel activeLayer={activeLayer} setActiveLayer={(l) => setActiveLayer(l)} />

            <button
                onClick={(e) => { e.stopPropagation(); setIsLibraryOpen(!isLibraryOpen); }}
                className={`absolute top-20 transition-all duration-300 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl z-50 ${isLibraryOpen ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'} ${selectedId ? 'right-[310px]' : 'right-6'}`}
            >
                {isLibraryOpen ? <X size={24} /> : <Plus size={24} />}
            </button>
            {isLibraryOpen && <NodeLibrary onAdd={handleAddNode} selectedId={selectedId} />}

            <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} onSave={handleSave} />

            {/* Properties Sidebar */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        exit={{ x: 300 }}
                        className="absolute top-16 bottom-0 right-0 w-72 bg-white border-l border-gray-100 p-6 z-50 flex flex-col gap-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Element Inspector</h4>
                            <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-3">
                                <selectedNode.icon size={32} />
                            </div>
                            <input
                                className="bg-transparent text-center font-bold text-gray-800 focus:outline-none"
                                value={selectedNode.label}
                                onChange={(e) => updateNodeProperty('label', e.target.value)}
                            />
                            <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">{selectedNode.type}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Deployment Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['optimal', 'warning', 'error', 'offline'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => updateNodeProperty('status', s)}
                                            className={`p-2 rounded-xl text-[9px] font-bold uppercase transition-all ${selectedNode.status === s ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-blue-600" />
                                    <span className="text-[10px] font-bold text-blue-600">Latency</span>
                                </div>
                                <span className="text-xs font-black text-blue-700">{selectedNode.latency}ms</span>
                            </div>

                            <div className="space-y-3">
                                <h5 className="text-[10px] font-bold text-gray-500 uppercase">Specifications</h5>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <HardDrive size={12} className="text-gray-400" />
                                            <span className="text-[10px] text-gray-500">Resource Load</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-800">22% Peak</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Terminal size={12} className="text-gray-400" />
                                            <span className="text-[10px] text-gray-500">Security Patch</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600">v4.2.1</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-gray-100 flex gap-2">
                            <button
                                onClick={handleDeleteNode}
                                className="flex-1 flex items-center justify-center gap-2 p-3 bg-red-50 text-red-500 rounded-xl text-xs font-black hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={14} />
                                Delete Node
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Zoom Controls */}
            <div className="absolute bottom-8 right-8 flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-2xl shadow-xl z-50">
                <button
                    onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
                    className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <Search size={18} />
                </button>
                <div className="w-8 flex justify-center text-[10px] font-black text-gray-400">
                    {Math.round(zoom * 100)}%
                </div>
                <button
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
}
