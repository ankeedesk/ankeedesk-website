import React from "react"
import { motion } from "framer-motion"

interface SmoothRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

const directionMap = {
  up: { y: 1, x: 0 },
  down: { y: -1, x: 0 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
}

const SmoothReveal: React.FC<SmoothRevealProps> = ({
  children,
  delay = 0,
  direction = "up",
  distance = 60,
  duration = 0.8,
  className,
  style,
}) => {
  const d = directionMap[direction]
  return (
    <motion.div
      className={className}
      style={style}
      initial={{
        opacity: 0,
        x: d.x * distance,
        y: d.y * distance,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}

export default SmoothReveal
