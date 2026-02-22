import React from "react"
import { motion } from "framer-motion"

const doodles = [
  { d: "M10 20 Q 30 5, 50 20 T 90 20", x: "5%", y: "15%" },
  { d: "M5 5 L 25 25 M25 5 L5 25", x: "85%", y: "10%" },
  { d: "M20 0 L20 40 M0 20 L40 20", x: "90%", y: "45%" },
  { d: "M10 30 Q 25 0 40 30 Q 55 60 70 30", x: "8%", y: "55%" },
  { d: "M5 20 C 15 0, 35 0, 45 20 C 55 40, 75 40, 85 20", x: "45%", y: "85%" },
  { d: "M20 5 L5 35 L35 35 Z", x: "75%", y: "70%" },
  { d: "M5 15 Q 20 5 35 15 Q 50 25 65 15", x: "15%", y: "82%" },
  { d: "M40 5 A 15 15 0 1 1 40 4.9 Z", x: "55%", y: "12%" },
  { d: "M5 5 Q 25 5 25 25 Q 25 45 5 45 Q 25 45 45 45 Q 45 25 45 5 Q 45 25 25 25", x: "30%", y: "50%" },
]

const DoodleBackground: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {doodles.map((doodle, i) => (
        <motion.svg
          key={i}
          width="90"
          height="60"
          viewBox="0 0 90 60"
          style={{
            position: "absolute",
            left: doodle.x,
            top: doodle.y,
            opacity: 0.07,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.07, scale: 1 }}
          transition={{
            delay: 1 + i * 0.2,
            duration: 0.8,
            type: "spring",
          }}
        >
          <motion.path
            d={doodle.d}
            fill="none"
            stroke="var(--color-text)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: 1.2 + i * 0.2,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      ))}
    </div>
  )
}

export default DoodleBackground
