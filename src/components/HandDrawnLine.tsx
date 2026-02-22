import React from "react"
import { motion } from "framer-motion"

interface HandDrawnLineProps {
  width?: number
  color?: string
  delay?: number
}

const HandDrawnLine: React.FC<HandDrawnLineProps> = ({
  width = 200,
  color = "var(--color-text)",
  delay = 0,
}) => {
  const d = `M 0 10 Q ${width * 0.15} 4, ${width * 0.3} 10 Q ${width * 0.5} 16, ${width * 0.7} 9 Q ${width * 0.85} 4, ${width} 11`

  return (
    <motion.svg
      width={width}
      height="20"
      viewBox={`0 0 ${width} 20`}
      style={{ overflow: "visible" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeInOut" }}
      />
    </motion.svg>
  )
}

export default HandDrawnLine
