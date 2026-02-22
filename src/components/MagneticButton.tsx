import React, { useRef, useState } from "react"
import { motion } from "framer-motion"

interface MagneticButtonProps {
  children: React.ReactNode
  style?: React.CSSProperties
  href?: string
  onClick?: () => void
  strength?: number
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  style = {},
  href,
  onClick,
  strength = 0.3,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * strength
    const y = (e.clientY - top - height / 2) * strength
    setPosition({ x, y })
  }

  const reset = () => setPosition({ x: 0, y: 0 })

  const Tag = href ? motion.a : motion.div

  return (
    <Tag
      ref={ref as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.2 }}
      style={{
        display: "inline-block",
        textDecoration: "none",
        ...style,
      }}
    >
      <motion.div
        animate={{ x: position.x * 0.3, y: position.y * 0.3 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.2 }}
      >
        {children}
      </motion.div>
    </Tag>
  )
}

export default MagneticButton
