import React from "react"
import { motion } from "framer-motion"

const FloatingElements: React.FC = () => {
  const elements = [
    {
      type: "paperclip",
      x: "92%",
      y: "20%",
      rotate: 25,
      delay: 2,
    },
    {
      type: "star",
      x: "3%",
      y: "35%",
      rotate: -15,
      delay: 2.5,
    },
    {
      type: "arrow",
      x: "88%",
      y: "65%",
      rotate: -30,
      delay: 3,
    },
    {
      type: "circle",
      x: "6%",
      y: "72%",
      rotate: 0,
      delay: 3.5,
    },
  ]

  const renderElement = (type: string) => {
    switch (type) {
      case "paperclip":
        return (
          <svg width="30" height="60" viewBox="0 0 30 60" fill="none">
            <motion.path
              d="M15 5 C 5 5 5 20 5 25 L 5 45 C 5 55 25 55 25 45 L 25 20 C 25 12 15 12 15 20 L 15 40"
              stroke="#999"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 2 }}
            />
          </svg>
        )
      case "star":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <motion.path
              d="M20 2 L24 15 L38 15 L27 23 L31 37 L20 29 L9 37 L13 23 L2 15 L16 15 Z"
              stroke="var(--color-primary-dark)"
              strokeWidth="2"
              fill="var(--color-primary)"
              fillOpacity="0.3"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 2.5, type: "spring" }}
            />
          </svg>
        )
      case "arrow":
        return (
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
            <motion.path
              d="M5 20 Q 20 5 35 20 T 55 20"
              stroke="var(--color-text)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 3 }}
            />
            <motion.path
              d="M48 14 L55 20 L48 26"
              stroke="var(--color-text)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.2 }}
            />
          </svg>
        )
      case "circle":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              stroke="var(--color-sticky-pink)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 3.5 }}
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {elements.map((el, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: el.x,
            top: el.y,
          }}
          animate={{
            y: [0, -8, 0, 8, 0],
            rotate: [el.rotate, el.rotate + 3, el.rotate, el.rotate - 3, el.rotate],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {renderElement(el.type)}
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingElements
