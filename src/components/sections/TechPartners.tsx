import React from 'react';
import LogoLoop from '../ui/LogoLoop';
import { SiReact, SiCisco, SiN8N, SiWordpress, SiOpenai, SiDocker, SiDigitalocean, SiRocket, SiAmazonwebservices, SiKubernetes, SiGithub } from 'react-icons/si';
import { VscVscode } from "react-icons/vsc";

const techLogos = [
    { node: <SiReact />, title: "React" },
    { node: <SiOpenai />, title: "ChatGPT" },
    { node: <SiRocket />, title: "Antigravity" },
    { node: <SiDocker />, title: "Docker" },
    { node: <SiKubernetes />, title: "Kubernetes" },
    { node: <SiAmazonwebservices />, title: "AWS" },
    { node: <SiDigitalocean />, title: "DigitalOcean" },
    { node: <SiGithub />, title: "GitHub" },
    { node: <SiCisco />, title: "Cisco" },
    { node: <SiN8N />, title: "n8n" },
    { node: <SiWordpress />, title: "WordPress" },
    { node: <VscVscode />, title: "VS Code" },
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

            <div className="max-w-4xl mx-auto px-4">
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <LogoLoop
                        logos={techLogos}
                        speed={50}
                        direction="left"
                        logoHeight={60}
                        gap={120}
                        hoverSpeed={15}
                        scaleOnHover
                        fadeOut
                        fadeOutColor="hsl(var(--background))" // Use background variable for theme support
                        ariaLabel="Technology partners"
                    />
                </div>
            </div>
        </section>
    );
};

export default TechPartners;
