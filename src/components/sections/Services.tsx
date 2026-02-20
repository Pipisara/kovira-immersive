import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Monitor, Cpu, Globe, Cloud, Shield, Database, Code, Settings } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        icon: Monitor,
        title: "POS Systems",
        desc: "Enterprise-grade point-of-sale solutions with real-time analytics, inventory management, and seamless payment integration for retail and hospitality.",
    },
    {
        icon: Cpu,
        title: "Business Automation",
        desc: "Streamline operations with intelligent workflow automation, reducing manual overhead by up to 70% through custom-built process engines.",
    },
    {
        icon: Globe,
        title: "Networking Solutions",
        desc: "Scalable network architecture design, SD-WAN deployment, and 24/7 monitoring for enterprise-grade connectivity and uptime.",
    },
    {
        icon: Cloud,
        title: "Cloud Hosting",
        desc: "Managed cloud infrastructure on AWS, Azure, and GCP with auto-scaling, disaster recovery, and 99.99% SLA guarantees.",
    },
    {
        icon: Shield,
        title: "Cybersecurity",
        desc: "Comprehensive threat protection with penetration testing, SOC monitoring, zero-trust architecture, and regulatory compliance frameworks.",
    },
    {
        icon: Code,
        title: "Web Development",
        desc: "High-performance web applications and progressive web apps built with modern frameworks, optimized for speed and conversion.",
    },
    {
        icon: Database,
        title: "ERP Systems",
        desc: "Custom ERP implementations that unify finance, HR, supply chain, and operations into a single intelligent platform.",
    },
    {
        icon: Settings,
        title: "IT Consulting",
        desc: "Strategic technology advisory services including digital roadmaps, vendor selection, architecture reviews, and CTO-as-a-Service.",
    },
];

export default function Services() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const totalScroll = track.scrollWidth - window.innerWidth;

        // Each delay is half a viewport height — pause before and after horizontal scroll
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
                },
            });

            // Brief pause at the start before horizontal scroll begins
            tl.to({}, { duration: delayDuration });

            // Horizontal scroll — left to right (track moves left = content scrolls right)
            tl.to(track, {
                x: -totalScroll,
                ease: "none",
                duration: scrollDuration,
            });

            // Brief pause at the end
            tl.to({}, { duration: delayDuration });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="services"
            ref={containerRef as unknown as React.RefObject<HTMLDivElement>}
            className="relative overflow-hidden"
        >
            <div
                ref={trackRef}
                className="flex items-center min-h-screen gap-8 px-6 md:px-20 will-change-transform"
            >
                {/* Title block */}
                <div className="flex-shrink-0 w-[280px] sm:w-[400px]">
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
                        What We Do
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
                        Our <span className="text-gradient">Services</span>
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg">
                        End-to-end technology solutions engineered for growth.
                    </p>
                </div>

                {/* Cards */}
                {services.map((service, i) => (
                    <ServiceCard key={service.title} service={service} index={i} />
                ))}
            </div>
        </section>
    );
}

function ServiceCard({
    service,
    index,
}: {
    service: (typeof services)[0];
    index: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform =
            "perspective(800px) rotateY(0) rotateX(0) scale(1)";
    };

    const Icon = service.icon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex-shrink-0 w-[280px] sm:w-[350px]"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="glass rounded-2xl p-8 h-[400px] flex flex-col transition-all duration-200 hover:border-primary/40 hover:glow-primary cursor-default"
            >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4 text-foreground">
                    {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {service.desc}
                </p>
            </div>
        </motion.div>
    );
}
