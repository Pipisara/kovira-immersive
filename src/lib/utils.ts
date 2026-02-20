import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollToSection = (id: string) => {
  const element = document.querySelector(id);
  if (element) {
    // Refresh ScrollTrigger to ensure all pinned offset calculations are correct
    ScrollTrigger.refresh();

    gsap.to(window, {
      duration: 1.5,
      scrollTo: {
        y: id,
        autoKill: false,
      },
      ease: "power4.inOut",
    });
  }
};
