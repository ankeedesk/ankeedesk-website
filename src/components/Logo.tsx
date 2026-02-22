import React from "react"
import { motion } from "framer-motion"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
}

const sizes = {
  sm: { fontSize: "2rem", padding: "4px 8px" },
  md: { fontSize: "2.8rem", padding: "6px 12px" },
  lg: { fontSize: "4.5rem", padding: "8px 16px" },
  xl: { fontSize: "7rem", padding: "12px 24px" },
}

const Logo: React.FC<LogoProps> = ({ size = "md" }) => {
  const s = sizes[size]

  const letterVariants = {
    hidden: { opacity: 0, y: 30, rotate: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 200,
        damping: 12,
      },
    }),
  }

  return (
    <motion.div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily: "var(--font-handwritten)",
        fontSize: s.fontSize,
        color: "var(--color-text)",
        lineHeight: 1,
        userSelect: "none",
        padding: s.padding,
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.span
        custom={0}
        variants={letterVariants}
        initial="hidden"
        animate="visible"
        style={{ display: "inline-block" }}
      >
        a
      </motion.span>
      <motion.span
        custom={1}
        variants={letterVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "inline-block",
          fontWeight: "bold",
        }}
      >
        D
      </motion.span>
    </motion.div>
  )
}

export default Logo
