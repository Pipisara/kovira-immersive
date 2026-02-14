import { motion } from "framer-motion";
import {
  Monitor, Cpu, Globe, Cloud, Shield, Database, Code, Settings
} from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "POS Systems",
    description: "Custom point-of-sale solutions with real-time analytics, inventory sync, and multi-location management.",
  },
  {
    icon: Cpu,
    title: "Business Automation",
    description: "Streamline workflows with intelligent automation that reduces overhead and accelerates operations.",
  },
  {
    icon: Globe,
    title: "Networking & Infrastructure",
    description: "Enterprise-grade network design, deployment, and management for seamless connectivity.",
  },
  {
    icon: Code,
    title: "Web & App Development",
    description: "High-performance web applications and native mobile experiences built with modern frameworks.",
  },
  {
    icon: Cloud,
    title: "Cloud & Managed Services",
    description: "Scalable cloud hosting, migration, and 24/7 managed services to keep your business running.",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Comprehensive threat protection, compliance auditing, and security-first architecture.",
  },
  {
    icon: Database,
    title: "ERP & Inventory",
    description: "End-to-end enterprise resource planning with real-time inventory tracking and reporting.",
  },
  {
    icon: Settings,
    title: "API Integrations",
    description: "Seamless connections between your tools and platforms with custom API development.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function Services() {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">What We Do</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Comprehensive <span className="text-gradient">Solutions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We deliver end-to-end technology services tailored to your business needs.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group glass rounded-xl p-6 hover:border-primary/40 transition-colors duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow duration-300">
                <service.icon className="text-primary" size={22} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
