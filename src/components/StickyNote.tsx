import React from "react"
import { motion } from "framer-motion"

interface StickyNoteProps {
  color?: string
  rotate?: number
  children: React.ReactNode
  className?: string
  delay?: number
  pinColor?: string
  hasTape?: boolean
  tapePosition?: "top" | "top-left" | "top-right"
  style?: React.CSSProperties
}

const tapePositions = {
  top: { top: -12, left: "50%", transform: "translateX(-50%) rotate(-2deg)" },
  "top-left": { top: -10, left: 15, transform: "rotate(-15deg)" },
  "top-right": { top: -10, right: 15, transform: "rotate(12deg)" },
}

const StickyNote: React.FC<StickyNoteProps> = ({
  color = "var(--color-sticky-yellow)",
  rotate = 0,
  children,
  className = "",
  delay = 0,
  pinColor,
  hasTape = false,
  tapePosition = "top",
  style = {},
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotate: rotate - 5, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 120,
        damping: 14,
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        y: -8,
        boxShadow: "4px 8px 24px rgba(0,0,0,0.2)",
        transition: { duration: 0.3 },
      }}
      className={className}
      style={{
        background: color,
        padding: "28px 24px",
        borderRadius: "2px",
        position: "relative",
        boxShadow: "2px 4px 12px rgba(0,0,0,0.15)",
        cursor: "default",
        ...style,
      }}
    >
      {/* Folded corner effect */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 0 24px 24px",
          borderColor: `transparent transparent rgba(0,0,0,0.08) transparent`,
        }}
      />

      {pinColor && (
        <div
          className="pin"
          style={{
            top: -6,
            left: "50%",
            transform: "translateX(-50%)",
            background: `radial-gradient(circle at 35% 35%, ${pinColor}, ${pinColor}88)`,
          }}
        />
      )}

      {hasTape && (
        <div
          className="tape"
          style={tapePositions[tapePosition] as React.CSSProperties}
        />
      )}

      {children}
    </motion.div>
  )
}

export default StickyNote
