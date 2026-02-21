import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
    Monitor, Cpu, Globe, Cloud, Shield, Database, Code, Settings,
    Plus, ArrowUpRight
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceModal } from "./ServiceModal";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        icon: Monitor,
        title: "POS Systems",
        desc: "Enterprise-grade point-of-sale solutions with real-time analytics and inventory management.",
        longDesc: "Our POS systems are designed to transform your business operations. Beyond simple transactions, we provide a comprehensive ecosystem that bridges the gap between physical retail and digital intelligence. Experience lightning-fast processing, deep inventory insights, and multi-location synchronization that keeps your business moving at the speed of thought.",
        features: ["Real-time Analytics", "Inventory Management", "Cloud Sync", "Multi-payment Support", "Offline Mode"],
        color: "#3b82f6"
    },
    {
        icon: Cpu,
        title: "Business Automation",
        desc: "Streamline operations with intelligent workflow automation custom-built process engines.",
        longDesc: "Eliminate repetitive tasks and human error with our intelligent automation engines. We map your business processes and implement digital workflows that operate 24/7. From automated document processing to complex decision-making systems, we help your team focus on high-value strategic work while the machines handle the routine.",
        features: ["Workflow Orchestration", "AI RPA", "Custom Logic Engines", "ERP Integration", "Process Mining"],
        color: "#8b5cf6"
    },
    {
        icon: Globe,
        title: "Networking Solutions",
        desc: "Scalable network architecture design and 24/7 monitoring for enterprise connectivity.",
        longDesc: "In a hyper-connected world, your network is your lifeline. We design and deploy resilient, high-performance network infrastructures that grow with your enterprise. Our solutions prioritize security and uptime, utilizing SD-WAN technology and advanced monitoring to ensure your global operations never miss a beat.",
        features: ["SD-WAN Deployment", "Network Security", "24/7 Monitoring", "Global Load Balancing", "Zero Trust Architecture"],
        color: "#10b981"
    },
    {
        icon: Cloud,
        title: "Cloud Hosting",
        desc: "Managed cloud infrastructure on AWS, Azure, and GCP with auto-scaling and 99.99% SLA.",
        longDesc: "Scale without limits. Our managed cloud services take the complexity out of infrastructure, allowing you to deploy applications globally with ease. We optimize for performance and cost, ensuring your digital assets are always available, secure, and running on the most efficient resources available.",
        features: ["Auto-scaling", "Disaster Recovery", "Cost Optimization", "Multi-cloud Strategy", "Edge Computing"],
        color: "#06b6d4"
    },
    {
        icon: Shield,
        title: "Cybersecurity",
        desc: "Comprehensive threat protection with penetration testing and zero-trust architecture.",
        longDesc: "Security isn't just a layer; it's the foundation. Our cybersecurity solutions provide a proactive defense against evolving threats. We combine advanced threat detection with rigorous compliance frameworks and zero-trust principles to protect your data, your reputation, and your future.",
        features: ["Penetration Testing", "SOC Monitoring", "Identity Management", "Threat Intelligence", "Compliance Auditing"],
        color: "#ef4444"
    },
    {
        icon: Code,
        title: "Web Development",
        desc: "High-performance web applications built with modern frameworks, optimized for speed.",
        longDesc: "We don't just build websites; we craft digital experiences. Our development team uses cutting-edge technologies to create lightning-fast, responsive, and intuitive web applications. We focus on clean code, exceptional performance, and a user-centric design that converts visitors into loyal customers.",
        features: ["React & Next.js", "Progressive Web Apps", "Performance Optimization", "SEO Strategy", "Custom APIs"],
        color: "#f59e0b"
    },
    {
        icon: Database,
        title: "ERP Systems",
        desc: "Custom ERP implementations that unify finance, HR, and operations into one platform.",
        longDesc: "Bring every aspect of your business together. Our custom ERP solutions provide a single source of truth for your entire organization. Unify financial reporting, human resources, supply chain management, and operational workflows into a cohesive system that provides real-time visibility and drives data-informed decisions.",
        features: ["Resource Planning", "Financial Management", "HR Automation", "Supply Chain Control", "Business Intelligence"],
        color: "#ec4899"
    },
    {
        icon: Settings,
        title: "IT Consulting",
        desc: "Strategic technology advisory services including digital roadmaps and architecture reviews.",
        longDesc: "Navigate the digital landscape with confidence. Our consultants serve as your strategic technology partners, helping you align IT investments with business goals. From digital transformation roadmaps to architecture audits and CTO-as-a-Service, we provide the expertise needed to scale effectively in a tech-driven market.",
        features: ["Digital Roadmap", "Vendor Selection", "Architecture Audit", "CTO-as-a-Service", "Tech Stack Strategy"],
        color: "#6366f1"
    },
];

export default function Services() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const totalScroll = track.scrollWidth - window.innerWidth;

        const delayDuration = 1;
        const scrollDuration = 3;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: () => `+=${totalScroll + window.innerHeight}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 5,
                },
            });

            tl.to({}, { duration: delayDuration });

            tl.to(track, {
                x: -totalScroll,
                ease: "none",
                duration: scrollDuration,
            });

            tl.to({}, { duration: delayDuration });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="services"
            ref={containerRef as unknown as React.RefObject<HTMLDivElement>}
            className="relative overflow-hidden bg-background z-10"
        >
            <div
                ref={trackRef}
                className="flex items-center min-h-screen gap-8 px-6 md:px-20 will-change-transform"
            >
                {/* Title block */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-[280px] sm:w-[400px]"
                >
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
                        What We Do
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight">
                        Our <span className="text-gradient">Services</span>
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg">
                        End-to-end technology solutions engineered for growth and innovation.
                    </p>
                </motion.div>

                {/* Cards */}
                {services.map((service, i) => (
                    <ServiceCard
                        key={service.title}
                        service={service}
                        index={i}
                        onClick={() => setSelectedService(service)}
                    />
                ))}
            </div>

            <ServiceModal
                isOpen={!!selectedService}
                service={selectedService}
                onClose={() => setSelectedService(null)}
            />
        </section>
    );
}

function ServiceCard({
    service,
    index,
    onClick,
}: {
    service: (typeof services)[0];
    index: number;
    onClick: () => void;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform =
            "perspective(1000px) rotateY(0) rotateX(0) translateY(0)";
    };

    const Icon = service.icon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
            className="flex-shrink-0 w-[300px] sm:w-[380px] group"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                className="relative glass rounded-[2rem] p-8 h-[450px] flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer overflow-hidden"
            >
                {/* Background Glow */}
                <div
                    className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: service.color }}
                />

                <div className="flex justify-between items-start mb-8">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: `${service.color}15` }}
                    >
                        <Icon className="w-8 h-8" style={{ color: service.color }} />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                        {service.desc}
                    </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">
                    <span>Explore Details</span>
                    <div className="h-[1px] flex-1 bg-primary/10 group-hover:bg-primary/30 transition-colors" />
                    <Plus className="w-4 h-4" />
                </div>
            </div>
        </motion.div>
    );
}
