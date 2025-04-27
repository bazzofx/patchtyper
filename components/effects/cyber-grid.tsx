"use client"

import { useEffect, useRef } from "react"

export default function CyberGrid({ opacity = 0.1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Draw cyber grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set line style
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 0.5

      // Grid size
      const gridSize = 30

      // Draw perspective grid
      const horizonY = canvas.height / 2
      const vanishingPointX = canvas.width / 2

      // Draw horizontal lines
      for (let y = horizonY; y < canvas.height; y += 20) {
        const factor = (y - horizonY) / (canvas.height - horizonY)

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.globalAlpha = 0.1 + factor * 0.2
        ctx.stroke()
      }

      // Draw vertical perspective lines
      const linesCount = 20
      for (let i = 0; i <= linesCount; i++) {
        const x = (canvas.width / linesCount) * i

        ctx.beginPath()
        ctx.moveTo(x, canvas.height)
        ctx.lineTo(vanishingPointX, horizonY)
        ctx.globalAlpha = 0.1 + (Math.abs(x - vanishingPointX) / (canvas.width / 2)) * 0.2
        ctx.stroke()
      }

      // Reset alpha
      ctx.globalAlpha = 1

      // Draw some random dots at grid intersections
      ctx.fillStyle = "#22c55e"
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = horizonY; y < canvas.height; y += gridSize) {
          if (Math.random() > 0.85) {
            ctx.beginPath()
            ctx.arc(x, y, 1, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    drawGrid()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawGrid()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ opacity }} />
}
