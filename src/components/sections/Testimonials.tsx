import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Mitchell",
        role: "CTO, RetailNova",
        text: "KOVIRA completely transformed our POS infrastructure. Transactions are faster, reporting is real-time, and our team loves the interface. They delivered ahead of schedule.",
        rating: 5,
    },
    {
        name: "James Okonkwo",
        role: "Founder, FinEdge",
        text: "Their cybersecurity audit revealed vulnerabilities we never knew existed. The remediation was thorough and professional. We now sleep better at night.",
        rating: 5,
    },
    {
        name: "Priya Sharma",
        role: "VP Operations, LogiTrack",
        text: "The ERP system KOVIRA built handles our entire supply chain. Inventory accuracy went from 82% to 99.4%. The ROI was visible within the first quarter.",
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="section-padding">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Testimonials</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Trusted by <span className="text-gradient">Industry Leaders</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="glass rounded-xl p-6 flex flex-col"
                        >
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.rating }).map((_, si) => (
                                    <Star key={si} size={16} className="fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-foreground/90 leading-relaxed mb-6 flex-1">"{t.text}"</p>
                            <div>
                                <p className="font-semibold text-sm">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
