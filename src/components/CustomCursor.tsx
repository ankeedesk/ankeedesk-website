import React, { useEffect, useRef } from "react"
import { motion, useMotionValue } from "framer-motion"

const CustomCursor: React.FC = () => {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const isHovering = useRef(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)

    if (isTouchDevice) return

    const moveCursor = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.style.cursor === "pointer"
      ) {
        isHovering.current = true
        if (dotRef.current) {
          dotRef.current.style.transform = "translate(-50%, -50%) scale(0.5)"
          dotRef.current.style.opacity = "0.5"
        }
        if (ringRef.current) {
          ringRef.current.style.width = "60px"
          ringRef.current.style.height = "60px"
          ringRef.current.style.borderColor = "#fdff97"
          ringRef.current.style.background = "rgba(253, 255, 151, 0.08)"
        }
      }
    }

    const handleOut = () => {
      isHovering.current = false
      if (dotRef.current) {
        dotRef.current.style.transform = "translate(-50%, -50%) scale(1)"
        dotRef.current.style.opacity = "1"
      }
      if (ringRef.current) {
        ringRef.current.style.width = "40px"
        ringRef.current.style.height = "40px"
        ringRef.current.style.borderColor = "rgba(11,11,11,0.3)"
        ringRef.current.style.background = "transparent"
      }
    }

    window.addEventListener("mousemove", moveCursor, { passive: true })
    document.addEventListener("mouseover", handleOver)
    document.addEventListener("mouseout", handleOut)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseover", handleOver)
      document.removeEventListener("mouseout", handleOut)
    }
  }, [x, y])

  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null
  }

  return (
    <>
      <motion.div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--color-text)",
          pointerEvents: "none",
          zIndex: 99999,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          transition: "transform 0.2s, opacity 0.2s",
          mixBlendMode: "difference",
        }}
      />

      <motion.div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid rgba(11,11,11,0.3)",
          pointerEvents: "none",
          zIndex: 99998,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          transition: "width 0.3s, height 0.3s, border-color 0.3s, background 0.3s",
        }}
      />

      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
        @media (pointer: coarse) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  )
}

export default CustomCursor
