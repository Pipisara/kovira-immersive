import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollToSection = (id: string) => {
  const element = document.querySelector(id);
  if (element) {
    // Refresh ScrollTrigger to ensure all pinned offset calculations are correct
    ScrollTrigger.refresh();

    const offset = element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: offset,
      behavior: "smooth"
    });
  }
};
