"use client"

import { useState, useEffect } from "react"

export default function GlitchOverlay({ active = false, intensity = 0.3 }) {
  const [glitches, setGlitches] = useState([])

  useEffect(() => {
    if (!active) {
      setGlitches([])
      return
    }

    // Generate random glitch elements
    const generateGlitches = () => {
      const newGlitches = []
      const count = Math.floor(Math.random() * 5) + 3

      for (let i = 0; i < count; i++) {
        newGlitches.push({
          id: i,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 50 + 10}%`,
          height: `${Math.random() * 5 + 1}px`,
          opacity: Math.random() * 0.5 + 0.25,
          transform: `translateX(${Math.random() * 20 - 10}px)`,
          delay: Math.random() * 0.5,
        })
      }

      setGlitches(newGlitches)
    }

    // Create glitch effect at random intervals
    const interval = setInterval(() => {
      if (Math.random() < intensity) {
        generateGlitches()

        // Clear glitches after a short time
        setTimeout(() => {
          setGlitches([])
        }, 200)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [active, intensity])

  if (!active && glitches.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {glitches.map((glitch) => (
        <div
          key={glitch.id}
          className="absolute bg-green-500"
          style={{
            top: glitch.top,
            left: glitch.left,
            width: glitch.width,
            height: glitch.height,
            opacity: glitch.opacity,
            transform: glitch.transform,
            transition: `all ${glitch.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
