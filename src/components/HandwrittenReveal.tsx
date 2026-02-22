import React, { useRef, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

interface HandwrittenRevealProps {
  text: string
  fontSize?: number
  color?: string
  strokeWidth?: number
  duration?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

const HandwrittenReveal: React.FC<HandwrittenRevealProps> = ({
  text,
  fontSize = 72,
  color = "#0B0B0B",
  strokeWidth = 1.5,
  duration = 3,
  delay = 0,
  className,
  style,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dims, setDims] = useState({ width: 800, height: 100 })
  const [ready, setReady] = useState(false)
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    if (typeof document === "undefined") return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.font = `${fontSize}px JustMeAgainDownHere, cursive`
    const metrics = ctx.measureText(text)
    const w = Math.ceil(metrics.width) + 20
    const h = Math.ceil(fontSize * 1.4)
    setDims({ width: w, height: h })
    setReady(true)
  }, [text, fontSize])

  const lines = text.split("\n")
  const lineHeight = fontSize * 1.3

  return (
    <div ref={ref} className={className} style={style}>
      {ready && (
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${dims.width} ${lines.length > 1 ? lineHeight * lines.length + 10 : dims.height}`}
          style={{ overflow: "visible", display: "block" }}
        >
          <style>
            {`
              @font-face {
                font-family: "JustMeAgainDownHere";
                src: url("/fonts/JustMeAgainDownHere-Regular.ttf") format("truetype");
              }
            `}
          </style>
          {lines.map((line, lineIdx) => {
            const lineDelay = delay + lineIdx * (duration * 0.4)

            return (
              <React.Fragment key={lineIdx}>
                {/* Stroke layer — draws the text */}
                <text
                  x="10"
                  y={fontSize + lineIdx * lineHeight}
                  fontFamily="JustMeAgainDownHere, cursive"
                  fontSize={fontSize}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2000"
                  strokeDashoffset={inView ? "0" : "2000"}
                  style={{
                    transition: `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${lineDelay}s`,
                  }}
                >
                  {line}
                </text>

                {/* Fill layer — fades in after stroke completes */}
                <text
                  x="10"
                  y={fontSize + lineIdx * lineHeight}
                  fontFamily="JustMeAgainDownHere, cursive"
                  fontSize={fontSize}
                  fill={color}
                  opacity={inView ? 1 : 0}
                  style={{
                    transition: `opacity ${duration * 0.5}s ease ${lineDelay + duration * 0.6}s`,
                  }}
                >
                  {line}
                </text>
              </React.Fragment>
            )
          })}
        </svg>
      )}
    </div>
  )
}

export default HandwrittenReveal
