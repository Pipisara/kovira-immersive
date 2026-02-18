import { motion } from "framer-motion";
import { CheckCircle, Zap, Headphones, TrendingUp, Lock, Users } from "lucide-react";

const reasons = [
    { icon: Zap, title: "Rapid Deployment", desc: "We move fast without compromising quality, delivering solutions on aggressive timelines." },
    { icon: Lock, title: "Security-First", desc: "Every system we build is hardened against threats with industry-leading security practices." },
    { icon: TrendingUp, title: "Scalable Architecture", desc: "Our solutions grow with you—designed for today's needs and tomorrow's demands." },
    { icon: Users, title: "Dedicated Teams", desc: "A named team of experts works with you, not a rotating cast of anonymous contractors." },
    { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock monitoring and support to keep your operations running smoothly." },
    { icon: CheckCircle, title: "Proven Track Record", desc: "500+ successful projects across industries from retail to healthcare to fintech." },
];

export default function WhyChooseUs() {
    return (
        <section id="why-us" className="section-padding">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Why KOVIRA</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Built Different, <span className="text-gradient">Built Better</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((r, i) => (
                        <motion.div
                            key={r.title}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex gap-4 p-5 rounded-xl hover:bg-secondary/50 transition-colors duration-200"
                        >
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
                                <r.icon className="text-primary" size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">{r.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
