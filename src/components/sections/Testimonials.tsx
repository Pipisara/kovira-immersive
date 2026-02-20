"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

const testimonials = [
    {
        name: "Sarah Mitchell",
        title: "CTO, RetailNova",
        quote: "KOVIRA completely transformed our POS infrastructure. Transactions are faster, reporting is real-time, and our team loves the interface. They delivered ahead of schedule.",
    },
    {
        name: "James Okonkwo",
        title: "Founder, FinEdge",
        quote: "Their cybersecurity audit revealed vulnerabilities we never knew existed. The remediation was thorough and professional. We now sleep better at night.",
    },
    {
        name: "Priya Sharma",
        title: "VP Operations, LogiTrack",
        quote: "The ERP system KOVIRA built handles our entire supply chain. Inventory accuracy went from 82% to 99.4%. The ROI was visible within the first quarter.",
    },
    {
        name: "Michael Chen",
        title: "Director, TechFlow Solutions",
        quote: "The scalability of Kovira's platform is unmatched. We integrated it across 50+ locations in record time without a single hour of downtime.",
    },
    {
        name: "Elena Rodriguez",
        title: "Head of Digital, Global Markets",
        quote: "Working with Kovira was a game-changer. Their proactive approach to problem-solving and deep technical expertise saved us months of development.",
    }
];

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: {
        quote: string;
        name: string;
        title: string;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);
    const [start, setStart] = useState(false);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }
    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "forwards",
                );
            } else {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "reverse",
                );
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "120s");
            }
        }
    };
    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className,
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]",
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-8 py-6 md:w-[450px]"
                        key={item.name + idx}
                    >
                        <blockquote>
                            <div
                                aria-hidden="true"
                                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                            ></div>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((_, si) => (
                                    <Star key={si} size={14} className="fill-primary text-primary" />
                                ))}
                            </div>
                            <span className="relative z-20 text-sm leading-[1.6] font-normal text-foreground/90">
                                "{item.quote}"
                            </span>
                            <div className="relative z-20 mt-6 flex flex-row items-center">
                                <span className="flex flex-col gap-1">
                                    <span className="text-sm leading-[1.6] font-semibold text-foreground">
                                        {item.name}
                                    </span>
                                    <span className="text-xs leading-[1.6] font-normal text-muted-foreground">
                                        {item.title}
                                    </span>
                                </span>
                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function Testimonials() {
    return (
        <section id="testimonials" className="section-padding overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Testimonials</p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Trusted by <span className="text-gradient">Industry Leaders</span>
                    </h2>
                </motion.div>

                <div className="flex flex-col gap-8">
                    <InfiniteMovingCards
                        items={testimonials}
                        direction="left"
                        speed="slow"
                        className="hidden md:block"
                    />
                    <InfiniteMovingCards
                        items={testimonials.slice().reverse()}
                        direction="right"
                        speed="slow"
                    />
                </div>
            </div>
        </section>
    );
}
