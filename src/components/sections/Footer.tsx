import { Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const footerLinks = {
    Services: ["POS Systems", "Cloud Hosting", "Cybersecurity", "Web Development", "API Integrations"],
    Company: ["About Us", "Careers", "Blog", "Press Kit"],
    Support: ["Contact", "Documentation", "Status", "SLA"],
};

export default function Footer() {
    return (
        <footer className="border-t border-border/50 section-padding pb-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="Kovira Technologies" className="h-40 w-auto object-contain" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                            Engineering the future of technology with scalable, secure, and innovative digital solutions.
                        </p>
                        <div className="flex gap-3">
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-semibold text-sm mb-4">{category}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                                        >
                                            {link}
                                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">© 2026 KOVIRA Technologies. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
