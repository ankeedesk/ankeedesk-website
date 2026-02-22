import React, { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const COLORS = [
  { name: "Black", value: "#0B0B0B" },
  { name: "Yellow", value: "#FDFF97" },
  { name: "Pink", value: "#ff97b5" },
  { name: "Blue", value: "#97d4ff" },
  { name: "Green", value: "#97ffb5" },
  { name: "Orange", value: "#ffc397" },
]

const BRUSH_SIZES = [2, 4, 8, 14]

interface Point {
  x: number
  y: number
}

interface Stroke {
  points: Point[]
  color: string
  size: number
  eraser: boolean
}

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const currentStrokeRef = useRef<Stroke | null>(null)
  const rafRef = useRef<number>(0)
  const scrollRef = useRef(0)

  const [isDrawing, setIsDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState(false)
  const [color, setColor] = useState(COLORS[0].value)
  const [brushSize, setBrushSize] = useState(4)
  const [isEraser, setIsEraser] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    const scrollY = scrollRef.current

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const allStrokes = currentStrokeRef.current
      ? [...strokesRef.current, currentStrokeRef.current]
      : strokesRef.current

    for (const stroke of allStrokes) {
      if (stroke.points.length < 2) {
        if (stroke.points.length === 1) {
          const p = stroke.points[0]
          const sy = p.y - scrollY
          if (sy < -50 || sy > h + 50) continue
          ctx.beginPath()
          ctx.arc(p.x, sy, stroke.size / 2, 0, Math.PI * 2)
          ctx.fillStyle = stroke.eraser ? "rgba(0,0,0,0)" : stroke.color
          if (stroke.eraser) {
            ctx.globalCompositeOperation = "destination-out"
            ctx.fillStyle = "rgba(0,0,0,1)"
            ctx.arc(p.x, sy, stroke.size * 1.5, 0, Math.PI * 2)
          } else {
            ctx.globalCompositeOperation = "source-over"
          }
          ctx.fill()
          ctx.globalCompositeOperation = "source-over"
        }
        continue
      }

      const minY = Math.min(...stroke.points.map((p) => p.y))
      const maxY = Math.max(...stroke.points.map((p) => p.y))
      if (maxY - scrollY < -50 || minY - scrollY > h + 50) continue

      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y - scrollY)

      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1]
        const cur = stroke.points[i]
        const mx = (prev.x + cur.x) / 2
        const my = (prev.y + cur.y) / 2 - scrollY
        ctx.quadraticCurveTo(prev.x, prev.y - scrollY, mx, my)
      }

      const last = stroke.points[stroke.points.length - 1]
      ctx.lineTo(last.x, last.y - scrollY)

      if (stroke.eraser) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.lineWidth = stroke.size * 3
      } else {
        ctx.globalCompositeOperation = "source-over"
        ctx.lineWidth = stroke.size
      }
      ctx.strokeStyle = stroke.eraser ? "rgba(0,0,0,1)" : stroke.color
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
      ctx.globalCompositeOperation = "source-over"
    }
  }, [])

  useEffect(() => {
    sizeCanvas()
    const onResize = () => {
      sizeCanvas()
      redraw()
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [sizeCanvas, redraw])

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY
      if (strokesRef.current.length > 0 || currentStrokeRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(redraw)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [redraw])

  const getPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    return { x: clientX, y: clientY + window.scrollY }
  }

  const onStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawMode) return
    setIsDrawing(true)
    setHasDrawn(true)
    const pos = getPos(e)
    currentStrokeRef.current = {
      points: [pos],
      color,
      size: brushSize,
      eraser: isEraser,
    }
    redraw()
  }

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !drawMode || !currentStrokeRef.current) return
    const pos = getPos(e)
    currentStrokeRef.current.points.push(pos)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(redraw)
  }

  const onEnd = () => {
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      strokesRef.current.push(currentStrokeRef.current)
    }
    currentStrokeRef.current = null
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    strokesRef.current = []
    currentStrokeRef.current = null
    setHasDrawn(false)
    redraw()
  }

  const toggleDrawMode = () => {
    const next = !drawMode
    setDrawMode(next)
    setShowToolbar(next)
    if (!next) setIsEraser(false)
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: drawMode ? 900 : 1,
          pointerEvents: drawMode ? "auto" : "none",
          cursor: drawMode ? (isEraser ? "cell" : "crosshair") : "default",
          touchAction: drawMode ? "none" : "auto",
        }}
      />

      {/* FAB toggle */}
      <motion.button
        onClick={toggleDrawMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: drawMode ? 0 : [0, -5, 5, -3, 0],
          backgroundColor: drawMode ? "#0B0B0B" : "#FDFF97",
          color: drawMode ? "#FDFF97" : "#0B0B0B",
        }}
        transition={{
          rotate: { duration: 0.6, delay: 2, repeat: drawMode ? 0 : Infinity, repeatDelay: 8 },
        }}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={drawMode ? "Stop drawing" : "Start drawing"}
      >
        {drawMode ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        )}
      </motion.button>

      {/* Toolbar */}
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              bottom: 96,
              right: 28,
              width: 56,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              borderRadius: 16,
              padding: "14px 0",
              boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
              zIndex: 9998,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
            }}
          >
            {COLORS.map((c) => (
              <motion.button
                key={c.value}
                onClick={() => { setColor(c.value); setIsEraser(false) }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.85 }}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: c.value,
                  border: color === c.value && !isEraser
                    ? "3px solid #0B0B0B"
                    : c.value === "#0B0B0B" ? "2px solid #555" : "2px solid rgba(0,0,0,0.1)",
                  cursor: "pointer", padding: 0,
                  boxShadow: color === c.value && !isEraser ? "0 0 0 2px rgba(253,255,151,0.5)" : "none",
                }}
                aria-label={`Color: ${c.name}`}
              />
            ))}
            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.1)" }} />
            {BRUSH_SIZES.map((size) => (
              <motion.button
                key={size}
                onClick={() => { setBrushSize(size); setIsEraser(false) }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: brushSize === size && !isEraser ? "rgba(0,0,0,0.08)" : "transparent",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                }}
                aria-label={`Brush size ${size}`}
              >
                <div style={{ width: Math.max(4, size), height: Math.max(4, size), borderRadius: "50%", background: "#0B0B0B" }} />
              </motion.button>
            ))}
            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.1)" }} />
            <motion.button
              onClick={() => setIsEraser(!isEraser)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: isEraser ? "#0B0B0B" : "transparent",
                border: isEraser ? "none" : "1.5px solid rgba(0,0,0,0.15)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: isEraser ? "#fff" : "#0B0B0B", padding: 0,
              }}
              aria-label="Eraser"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                <path d="M22 21H7" />
                <path d="m5 11 9 9" />
              </svg>
            </motion.button>
            {hasDrawn && (
              <motion.button
                onClick={clearCanvas}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "#ff4444", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", padding: 0,
                }}
                aria-label="Clear canvas"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <DrawHint drawMode={drawMode} hasDrawn={hasDrawn} />
    </>
  )
}

function DrawHint({ drawMode, hasDrawn }: { drawMode: boolean; hasDrawn: boolean }) {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const timer = setTimeout(() => setShow(true), 4000)
    const hide = setTimeout(() => { setShow(false); setDismissed(true) }, 10000)
    return () => { clearTimeout(timer); clearTimeout(hide) }
  }, [dismissed])

  useEffect(() => {
    if (drawMode || hasDrawn) { setShow(false); setDismissed(true) }
  }, [drawMode, hasDrawn])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            position: "fixed",
            bottom: 92,
            right: 56,
            transform: "translateY(50%)",
            background: "var(--color-text)",
            color: "var(--color-primary)",
            padding: "10px 18px",
            borderRadius: 8,
            fontFamily: "var(--font-handwritten)",
            fontSize: "1.2rem",
            zIndex: 9997,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          Psst... click to doodle on the page!
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DrawingCanvas
