"use client"

import { useEffect, useRef } from "react"

export default function DataStream({ width = 300, height = 100, className = "" }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = width
    canvas.height = height

    // Binary data for the stream
    const binaryChars = "01"
    const streams = []

    // Create streams
    for (let i = 0; i < width / 10; i++) {
      streams.push({
        x: i * 10,
        y: Math.random() * height,
        speed: Math.random() * 2 + 1,
        chars: [],
        length: Math.floor(Math.random() * 10) + 5,
      })
    }

    const draw = () => {
      // Fade out previous frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, width, height)

      // Draw streams
      ctx.font = "10px monospace"

      streams.forEach((stream) => {
        // Move stream
        stream.y += stream.speed

        // Reset if off screen
        if (stream.y > height + stream.length * 10) {
          stream.y = -stream.length * 10
          stream.speed = Math.random() * 2 + 1
        }

        // Generate new character at head of stream
        if (Math.random() > 0.9 || stream.chars.length === 0) {
          stream.chars.unshift(binaryChars.charAt(Math.floor(Math.random() * binaryChars.length)))

          // Keep stream at fixed length
          if (stream.chars.length > stream.length) {
            stream.chars.pop()
          }
        }

        // Draw characters
        stream.chars.forEach((char, index) => {
          const y = stream.y - index * 10

          // Only draw if on screen
          if (y > 0 && y < height) {
            // Head of stream is brighter
            if (index === 0) {
              ctx.fillStyle = "#ffffff"
            } else {
              // Fade out toward the tail
              const alpha = 1 - index / stream.length
              ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`
            }

            ctx.fillText(char, stream.x, y)
          }
        })
      })
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
    }
  }, [width, height])

  return <canvas ref={canvasRef} width={width} height={height} className={`${className}`} />
}
