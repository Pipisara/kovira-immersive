"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function SmoothCursor() {
    const [isVisible, setIsVisible] = useState(false)

    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 700 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            // Only show cursor after first movement to avoid initial flash
            if (!isVisible) setIsVisible(true)
        }

        window.addEventListener("mousemove", moveCursor)

        return () => {
            window.removeEventListener("mousemove", moveCursor)
        }
    }, [cursorX, cursorY, isVisible])

    if (!isVisible) return null

    return (
        <motion.div
            className="fixed top-0 left-0 w-4 h-4 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
                x: "-50%",
                y: "-50%"
            }}
        >
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-50" />
        </motion.div>
    )
}
