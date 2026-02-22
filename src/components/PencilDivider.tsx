import React, { useRef, useEffect, useCallback, useState } from "react"
import { useInView } from "react-intersection-observer"

const DOODLE_VARIANTS = [
  // Variant 0: wavy line with loops and stars
  (ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    const cy = h / 2
    const totalLen = w * 0.8
    const startX = w * 0.1
    const drawn = totalLen * progress

    ctx.beginPath()
    ctx.moveTo(startX, cy)
    const steps = Math.floor(drawn)
    for (let i = 1; i <= steps; i++) {
      const x = startX + i
      const y =
        cy +
        Math.sin(i * 0.025) * 12 +
        Math.sin(i * 0.06) * 6 +
        Math.cos(i * 0.01) * 4
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = "#0B0B0B"
    ctx.lineWidth = 2.2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    // Small doodles along the path
    const doodlePoints = [0.2, 0.4, 0.6, 0.8]
    doodlePoints.forEach((pct) => {
      if (progress > pct + 0.05) {
        const dx = startX + totalLen * pct
        const dy =
          cy +
          Math.sin(dx * 0.025) * 12 +
          Math.sin(dx * 0.06) * 6 +
          Math.cos(dx * 0.01) * 4
        const localP = Math.min(1, (progress - pct - 0.05) / 0.08)
        ctx.globalAlpha = localP
        drawSmallStar(ctx, dx, dy - 16, 5 * localP)
        ctx.globalAlpha = 1
      }
    })

    // Pen tip follows the drawn line
    if (progress < 1 && progress > 0.01) {
      const tipX = startX + drawn
      const tipY =
        cy +
        Math.sin(drawn * 0.025) * 12 +
        Math.sin(drawn * 0.06) * 6 +
        Math.cos(drawn * 0.01) * 4
      drawPenTip(ctx, tipX, tipY, -0.3)
    }
  },

  // Variant 1: looping scribble with circles
  (ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    const cy = h / 2
    const totalLen = w * 0.8
    const startX = w * 0.1
    const drawn = totalLen * progress

    ctx.beginPath()
    ctx.moveTo(startX, cy)
    const steps = Math.floor(drawn)
    for (let i = 1; i <= steps; i++) {
      const t = i / totalLen
      const loopY = Math.sin(t * Math.PI * 6) * 10
      const drift = Math.sin(t * Math.PI * 2) * 5
      ctx.lineTo(startX + i, cy + loopY + drift)
    }
    ctx.strokeStyle = "#0B0B0B"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    // Small circles at intervals
    const circlePoints = [0.25, 0.5, 0.75]
    circlePoints.forEach((pct) => {
      if (progress > pct + 0.04) {
        const cx2 = startX + totalLen * pct
        const localP = Math.min(1, (progress - pct - 0.04) / 0.06)
        ctx.globalAlpha = localP
        ctx.beginPath()
        ctx.arc(cx2, cy - 18, 6 * localP, 0, Math.PI * 2)
        ctx.strokeStyle = "#0B0B0B"
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    })

    if (progress < 1 && progress > 0.01) {
      const tipX = startX + drawn
      const t = drawn / totalLen
      const tipY =
        cy + Math.sin(t * Math.PI * 6) * 10 + Math.sin(t * Math.PI * 2) * 5
      drawPenTip(ctx, tipX, tipY, -0.2)
    }
  },

  // Variant 2: zigzag with hearts
  (ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    const cy = h / 2
    const totalLen = w * 0.8
    const startX = w * 0.1
    const drawn = totalLen * progress
    const segW = 30

    ctx.beginPath()
    ctx.moveTo(startX, cy)
    const steps = Math.floor(drawn)
    for (let i = 1; i <= steps; i++) {
      const seg = Math.floor(i / segW)
      const within = (i % segW) / segW
      const up = seg % 2 === 0
      const y = up ? cy - within * 10 + (1 - within) * 0 : cy - 10 + within * 10
      ctx.lineTo(startX + i, y + Math.sin(i * 0.08) * 2)
    }
    ctx.strokeStyle = "#0B0B0B"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    const heartPoints = [0.3, 0.65]
    heartPoints.forEach((pct) => {
      if (progress > pct + 0.05) {
        const hx = startX + totalLen * pct
        const localP = Math.min(1, (progress - pct - 0.05) / 0.08)
        ctx.globalAlpha = localP
        drawSmallHeart(ctx, hx, cy - 18, 6 * localP)
        ctx.globalAlpha = 1
      }
    })

    if (progress < 1 && progress > 0.01) {
      const tipX = startX + drawn
      const seg = Math.floor(drawn / segW)
      const within = (drawn % segW) / segW
      const up = seg % 2 === 0
      const tipY =
        (up ? cy - within * 10 : cy - 10 + within * 10) +
        Math.sin(drawn * 0.08) * 2
      drawPenTip(ctx, tipX, tipY, -0.4)
    }
  },

  // Variant 3: smooth S-curves with arrows
  (ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    const cy = h / 2
    const totalLen = w * 0.8
    const startX = w * 0.1
    const drawn = totalLen * progress

    ctx.beginPath()
    ctx.moveTo(startX, cy)
    const steps = Math.floor(drawn)
    for (let i = 1; i <= steps; i++) {
      const t = i / totalLen
      const y = cy + Math.sin(t * Math.PI * 3) * 14
      ctx.lineTo(startX + i, y)
    }
    ctx.strokeStyle = "#0B0B0B"
    ctx.lineWidth = 2.2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    // Small arrow doodles
    if (progress > 0.55) {
      const localP = Math.min(1, (progress - 0.55) / 0.1)
      const ax = startX + totalLen * 0.5
      ctx.globalAlpha = localP
      ctx.beginPath()
      ctx.moveTo(ax - 8, cy - 20)
      ctx.lineTo(ax, cy - 28)
      ctx.lineTo(ax + 8, cy - 20)
      ctx.strokeStyle = "#0B0B0B"
      ctx.lineWidth = 1.8
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ax, cy - 28)
      ctx.lineTo(ax, cy - 14)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    if (progress < 1 && progress > 0.01) {
      const tipX = startX + drawn
      const t = drawn / totalLen
      const tipY = cy + Math.sin(t * Math.PI * 3) * 14
      drawPenTip(ctx, tipX, tipY, -0.25)
    }
  },
]

function drawPenTip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  // Pen barrel (extends right/up from the tip)
  const bw = 5
  const tipH = 10
  const barrelH = 28

  // Barrel
  ctx.fillStyle = "#444"
  ctx.beginPath()
  ctx.roundRect(-bw / 2, -tipH - barrelH, bw, barrelH, 1)
  ctx.fill()

  // Grip rings
  ctx.strokeStyle = "#666"
  ctx.lineWidth = 0.8
  for (let i = 0; i < 3; i++) {
    const gy = -tipH - 4 - i * 3
    ctx.beginPath()
    ctx.moveTo(-bw / 2, gy)
    ctx.lineTo(bw / 2, gy)
    ctx.stroke()
  }

  // Nib / tip cone
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-bw / 2, -tipH)
  ctx.lineTo(bw / 2, -tipH)
  ctx.closePath()
  ctx.fillStyle = "#888"
  ctx.fill()

  // Ink dot
  ctx.beginPath()
  ctx.arc(0, 1, 1.5, 0, Math.PI * 2)
  ctx.fillStyle = "#0B0B0B"
  ctx.fill()

  ctx.restore()
}

function drawSmallStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
    const px = x + Math.cos(angle) * r
    const py = y + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.strokeStyle = "#0B0B0B"
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawSmallHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number
) {
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.4)
  ctx.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.5, y - s, x, y - s * 0.5)
  ctx.bezierCurveTo(x + s * 0.5, y - s, x + s, y - s * 0.3, x, y + s * 0.4)
  ctx.strokeStyle = "#0B0B0B"
  ctx.lineWidth = 1.5
  ctx.stroke()
}

interface PencilDividerProps {
  variant?: number
}

const PencilDivider: React.FC<PencilDividerProps> = ({ variant }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const progressRef = useRef(0)
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })
  const variantIdx = useRef(
    variant !== undefined
      ? variant
      : Math.floor(Math.random() * DOODLE_VARIANTS.length)
  )

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    DOODLE_VARIANTS[variantIdx.current](ctx, w, h, progressRef.current)
  }, [])

  useEffect(() => {
    if (!inView) return

    const animate = () => {
      progressRef.current += (1 - progressRef.current) * 0.025
      if (progressRef.current > 0.998) progressRef.current = 1
      draw()
      if (progressRef.current < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    progressRef.current = 0
    animRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animRef.current)
  }, [inView, draw])

  return (
    <div
      ref={ref}
      style={{
        padding: "16px 0",
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: 100,
          display: "block",
        }}
      />
    </div>
  )
}

export default PencilDivider
