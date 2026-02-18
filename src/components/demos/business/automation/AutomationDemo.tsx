import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, Clock, AlertCircle, Zap, Mail, Database, FileText, Bell } from "lucide-react";

interface FlowNode {
    id: string;
    label: string;
    type: "trigger" | "action" | "condition" | "output";
    icon: React.ElementType;
    x: number;
    y: number;
    status: "idle" | "running" | "done" | "error";
}

const initialNodes: FlowNode[] = [
    { id: "n1", label: "New Lead", type: "trigger", icon: Bell, x: 0, y: 0, status: "idle" },
    { id: "n2", label: "Validate Data", type: "condition", icon: FileText, x: 1, y: 0, status: "idle" },
    { id: "n3", label: "Save to CRM", type: "action", icon: Database, x: 2, y: 0, status: "idle" },
    { id: "n4", label: "Send Welcome Email", type: "action", icon: Mail, x: 3, y: 0, status: "idle" },
    { id: "n5", label: "Notify Sales Team", type: "output", icon: Zap, x: 4, y: 0, status: "idle" },
];

const nodeColors: Record<FlowNode["type"], string> = {
    trigger: "border-blue-500/60 bg-blue-500/10 text-blue-400",
    condition: "border-yellow-500/60 bg-yellow-500/10 text-yellow-400",
    action: "border-indigo-500/60 bg-indigo-500/10 text-indigo-400",
    output: "border-green-500/60 bg-green-500/10 text-green-400",
};

const statusIcon: Record<FlowNode["status"], React.ElementType | null> = {
    idle: null,
    running: Clock,
    done: CheckCircle2,
    error: AlertCircle,
};

const statusColor: Record<FlowNode["status"], string> = {
    idle: "text-muted-foreground",
    running: "text-yellow-400 animate-pulse",
    done: "text-green-400",
    error: "text-red-400",
};

const runLog = [
    { time: "09:41:02", msg: "Trigger fired — new lead from web form", type: "info" },
    { time: "09:41:02", msg: "Validating lead data fields…", type: "info" },
    { time: "09:41:03", msg: "Validation passed ✓", type: "success" },
    { time: "09:41:03", msg: "Saving contact to CRM…", type: "info" },
    { time: "09:41:04", msg: "CRM record created (ID: #4821)", type: "success" },
    { time: "09:41:04", msg: "Sending welcome email to lead…", type: "info" },
    { time: "09:41:05", msg: "Email delivered successfully", type: "success" },
    { time: "09:41:05", msg: "Notifying sales team via Slack…", type: "info" },
    { time: "09:41:06", msg: "Workflow completed in 4.1s ✓", type: "success" },
];

export default function AutomationDemo() {
    const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const [logLines, setLogLines] = useState<typeof runLog>([]);
    const [activeNode, setActiveNode] = useState(-1);

    const reset = () => {
        setNodes(initialNodes.map(n => ({ ...n, status: "idle" })));
        setRunning(false);
        setDone(false);
        setLogLines([]);
        setActiveNode(-1);
    };

    const runWorkflow = () => {
        if (running || done) return;
        setRunning(true);
        setLogLines([]);
        setActiveNode(0);

        nodes.forEach((_, i) => {
            setTimeout(() => {
                setActiveNode(i);
                setNodes(prev => prev.map((n, idx) => ({
                    ...n,
                    status: idx < i ? "done" : idx === i ? "running" : "idle"
                })));
                // Add log lines for this step
                const logIdx = i * 2;
                if (runLog[logIdx]) setLogLines(prev => [...prev, runLog[logIdx]]);
                setTimeout(() => {
                    if (runLog[logIdx + 1]) setLogLines(prev => [...prev, runLog[logIdx + 1]]);
                    if (i === nodes.length - 1) {
                        setNodes(prev => prev.map(n => ({ ...n, status: "done" })));
                        setRunning(false);
                        setDone(true);
                        setActiveNode(-1);
                    }
                }, 600);
            }, i * 1200);
        });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-3 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-foreground">Automation Flow</h3>
                    <p className="text-xs text-muted-foreground">Lead Onboarding Pipeline</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={reset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border/50 text-xs text-muted-foreground hover:text-foreground transition-all">
                        <RotateCcw size={11} /> Reset
                    </button>
                    <button onClick={runWorkflow} disabled={running || done}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${done
                            ? "bg-green-500/20 border border-green-500/40 text-green-400"
                            : running
                                ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-400"
                                : "bg-indigo-500 text-white hover:bg-indigo-400"}`}>
                        {running ? <><Pause size={11} /> Running…</> : done ? <><CheckCircle2 size={11} /> Done!</> : <><Play size={11} /> Run Flow</>}
                    </button>
                </div>
            </div>

            {/* Flow nodes */}
            <div className="glass rounded-xl p-4 shrink-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {nodes.map((node, i) => {
                        const Icon = node.icon;
                        const StatusIcon = statusIcon[node.status];
                        return (
                            <div key={node.id} className="flex items-center gap-2 shrink-0">
                                <motion.div
                                    animate={node.status === "running" ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all min-w-[80px] ${nodeColors[node.type]} ${node.status === "running" ? "shadow-lg" : ""}`}>
                                    <Icon size={16} />
                                    <span className="text-[10px] font-medium text-center leading-tight">{node.label}</span>
                                    {StatusIcon && (
                                        <StatusIcon size={10} className={statusColor[node.status]} />
                                    )}
                                </motion.div>
                                {i < nodes.length - 1 && (
                                    <motion.div
                                        animate={{ opacity: node.status === "done" ? 1 : 0.3 }}
                                        className="w-6 h-0.5 bg-border shrink-0 relative">
                                        {node.status === "done" && (
                                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }}
                                                className="absolute inset-0 bg-indigo-500 rounded-full" />
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Log */}
            <div className="flex-1 glass rounded-xl p-4 overflow-y-auto min-h-0">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Execution Log
                </span>
                {logLines.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Press "Run Flow" to start the automation…</p>
                ) : (
                    <div className="space-y-1.5">
                        <AnimatePresence>
                            {logLines.map((line, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-2 text-xs">
                                    <span className="text-muted-foreground font-mono shrink-0">{line.time}</span>
                                    <span className={line.type === "success" ? "text-green-400" : "text-foreground/70"}>
                                        {line.msg}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
