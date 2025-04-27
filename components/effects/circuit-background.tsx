"use client"

import { useEffect, useRef } from "react"

export default function CircuitBackground({ opacity = 0.1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Draw circuit pattern
    const drawCircuit = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set line style
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 1

      // Grid size
      const gridSize = 50
      const cols = Math.ceil(canvas.width / gridSize)
      const rows = Math.ceil(canvas.height / gridSize)

      // Draw horizontal and vertical lines
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize
          const y = j * gridSize

          // Only draw some lines (random pattern)
          if (Math.random() > 0.7) {
            // Draw horizontal line
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + gridSize * (Math.random() > 0.5 ? 1 : 2), y)
            ctx.stroke()
          }

          if (Math.random() > 0.7) {
            // Draw vertical line
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + gridSize * (Math.random() > 0.5 ? 1 : 2))
            ctx.stroke()
          }

          // Draw nodes at some intersections
          if (Math.random() > 0.85) {
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fillStyle = "#22c55e"
            ctx.fill()
          }
        }
      }
    }

    drawCircuit()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawCircuit()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ opacity }} />
}
