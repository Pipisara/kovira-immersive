import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {count}{suffix}
            </div>
            <div className="text-muted-foreground text-sm">{label}</div>
        </div>
    );
}

export default function About() {
    return (
        <section id="about" className="section-padding">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Who We Are</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Powering Digital <span className="text-gradient">Transformation</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        KOVIRA Technologies is a full-spectrum IT partner specializing in scalable solutions for modern enterprises. We combine deep technical expertise with strategic thinking to deliver systems that drive measurable impact.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 glass rounded-2xl p-8 md:p-12"
                >
                    <AnimatedCounter target={150} suffix="+" label="Clients Worldwide" />
                    <AnimatedCounter target={8} suffix="+" label="Years of Experience" />
                    <AnimatedCounter target={500} suffix="+" label="Projects Delivered" />
                    <AnimatedCounter target={99} suffix="%" label="Client Satisfaction" />
                </motion.div>
            </div>
        </section>
    );
}
