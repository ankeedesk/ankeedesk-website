import React from "react"
import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  tag?: "h1" | "h2" | "h3" | "p" | "span"
  className?: string
  style?: React.CSSProperties
  delay?: number
  staggerChildren?: number
  handwritten?: boolean
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  tag = "h2",
  className = "",
  style = {},
  delay = 0,
  staggerChildren = 0.03,
  handwritten = false,
}) => {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  }

  const wordVariant = {
    hidden: { opacity: 0, y: 20, rotate: -2 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
  }

  const Tag = motion[tag]

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0 0.35em",
        fontFamily: handwritten ? "var(--font-handwritten)" : "inherit",
        ...style,
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariant}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}

export default AnimatedText
