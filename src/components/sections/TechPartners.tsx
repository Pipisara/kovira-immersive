import React from 'react';
import LogoLoop from '../ui/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiVite, SiHtml5, SiCss3, SiJavascript, SiNodedotjs, SiCisco, SiN8N, SiWordpress } from 'react-icons/si';
import { VscVscode } from "react-icons/vsc";

const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
    { node: <SiVite />, title: "Vite", href: "https://vitejs.dev" },
    { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
    { node: <SiCisco />, title: "Cisco", href: "https://www.cisco.com" },
    { node: <SiN8N />, title: "n8n", href: "https://n8n.io" },
    { node: <SiWordpress />, title: "WordPress", href: "https://wordpress.org" },
    { node: <VscVscode />, title: "VS Code", href: "https://code.visualstudio.com" },
    { node: <SiHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { node: <SiCss3 />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
];

const TechPartners = () => {
    return (
        <section className="py-20 overflow-hidden relative" id="tech-stack">
            <div className="container mx-auto px-4 mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Modern Technology</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    We leverage the latest tools and frameworks to build immersive, high-performance experiences.
                </p>
            </div>

            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <LogoLoop
                    logos={techLogos}
                    speed={70}
                    direction="left"
                    logoHeight={55}
                    gap={70}
                    hoverSpeed={20}
                    scaleOnHover
                    fadeOut
                    fadeOutColor="hsl(var(--background))" // Use background variable for theme support
                    ariaLabel="Technology partners"
                />
            </div>
        </section>
    );
};

export default TechPartners;
