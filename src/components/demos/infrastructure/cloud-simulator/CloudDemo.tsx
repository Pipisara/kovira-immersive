import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Server, Zap, CheckCircle2, Clock, Play, RotateCcw, TrendingUp, Activity } from "lucide-react";

interface Service {
    id: string;
    name: string;
    instances: number;
    cpu: number;
    status: "running" | "scaling" | "deploying" | "idle";
}

interface DeployStep {
    label: string;
    duration: number;
    done: boolean;
    active: boolean;
}

const initialServices: Service[] = [
    { id: "api", name: "API Gateway", instances: 3, cpu: 68, status: "running" },
    { id: "web", name: "Web Frontend", instances: 2, cpu: 45, status: "running" },
    { id: "worker", name: "Job Workers", instances: 1, cpu: 82, status: "running" },
    { id: "cache", name: "Redis Cache", instances: 1, cpu: 31, status: "running" },
];

const deploySteps: DeployStep[] = [
    { label: "Build Docker image", duration: 1200, done: false, active: false },
    { label: "Push to registry", duration: 800, done: false, active: false },
    { label: "Update Kubernetes manifest", duration: 600, done: false, active: false },
    { label: "Rolling deployment", duration: 1500, done: false, active: false },
    { label: "Health checks passing", duration: 1000, done: false, active: false },
    { label: "Traffic switched ✓", duration: 400, done: false, active: false },
];

const statusStyle: Record<Service["status"], string> = {
    running: "text-green-400 bg-green-500/10 border-green-500/30",
    scaling: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    deploying: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    idle: "text-muted-foreground bg-secondary border-border/30",
};

export default function CloudDemo() {
    const [services, setServices] = useState(initialServices);
    const [steps, setSteps] = useState(deploySteps);
    const [deploying, setDeploying] = useState(false);
    const [deployDone, setDeployDone] = useState(false);

    const reset = () => {
        setServices(initialServices);
        setSteps(deploySteps.map(s => ({ ...s, done: false, active: false })));
        setDeploying(false);
        setDeployDone(false);
    };

    const scaleService = (id: string) => {
        setServices(prev => prev.map(s => {
            if (s.id !== id) return s;
            const newInstances = Math.min(s.instances + 1, 6);
            return { ...s, instances: newInstances, status: "scaling", cpu: Math.max(20, s.cpu - 15) };
        }));
        setTimeout(() => {
            setServices(prev => prev.map(s => s.id === id ? { ...s, status: "running" } : s));
        }, 1500);
    };

    const deploy = () => {
        if (deploying || deployDone) return;
        setDeploying(true);
        let delay = 0;
        deploySteps.forEach((step, i) => {
            setTimeout(() => {
                setSteps(prev => prev.map((s, idx) => ({
                    ...s,
                    active: idx === i,
                    done: idx < i,
                })));
                if (i === deploySteps.length - 1) {
                    setTimeout(() => {
                        setSteps(prev => prev.map(s => ({ ...s, active: false, done: true })));
                        setDeploying(false);
                        setDeployDone(true);
                    }, step.duration);
                }
            }, delay);
            delay += step.duration;
        });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col gap-3 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-foreground">Cloud Deployment</h3>
                    <p className="text-xs text-muted-foreground">Kubernetes cluster — us-east-1</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={reset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border/50 text-xs text-muted-foreground hover:text-foreground transition-all">
                        <RotateCcw size={11} /> Reset
                    </button>
                    <button onClick={deploy} disabled={deploying || deployDone}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${deployDone
                            ? "bg-green-500/20 border border-green-500/40 text-green-400"
                            : deploying
                                ? "bg-sky-500/20 border border-sky-500/40 text-sky-400"
                                : "bg-sky-500 text-white hover:bg-sky-400"}`}>
                        {deploying ? <><Activity size={11} className="animate-pulse" /> Deploying…</>
                            : deployDone ? <><CheckCircle2 size={11} /> Deployed!</>
                                : <><Play size={11} /> Deploy v2.4.1</>}
                    </button>
                </div>
            </div>

            {/* Services grid */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
                {services.map((svc, i) => (
                    <motion.div key={svc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="glass rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Server size={11} className="text-sky-400" />
                                <span className="text-xs font-medium text-foreground">{svc.name}</span>
                            </div>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${statusStyle[svc.status]}`}>
                                {svc.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{svc.instances} instance{svc.instances !== 1 ? "s" : ""}</span>
                            <span className={svc.cpu > 75 ? "text-orange-400" : "text-green-400"}>{svc.cpu}% CPU</span>
                        </div>
                        <div className="h-1 bg-secondary rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${svc.cpu}%` }} transition={{ duration: 0.5 }}
                                className={`h-full rounded-full ${svc.cpu > 75 ? "bg-orange-500" : "bg-sky-500"}`} />
                        </div>
                        <button onClick={() => scaleService(svc.id)}
                            className="text-[10px] py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-colors flex items-center justify-center gap-1">
                            <TrendingUp size={9} /> Scale Up
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Deploy pipeline */}
            <div className="flex-1 glass rounded-xl p-3 overflow-y-auto min-h-0">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Deployment Pipeline
                </span>
                <div className="space-y-2">
                    {steps.map((step, i) => (
                        <motion.div key={i} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${step.done
                                ? "bg-green-500/20 border border-green-500/40"
                                : step.active
                                    ? "bg-sky-500/20 border border-sky-500/40"
                                    : "bg-secondary border border-border/30"}`}>
                                {step.done ? <CheckCircle2 size={9} className="text-green-400" />
                                    : step.active ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-2 h-2 rounded-full border border-sky-400 border-t-transparent" />
                                        : <Clock size={9} className="text-muted-foreground" />}
                            </div>
                            <span className={`text-xs transition-colors ${step.done ? "text-green-400" : step.active ? "text-sky-400" : "text-muted-foreground"}`}>
                                {step.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
