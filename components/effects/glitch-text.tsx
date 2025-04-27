"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function GlitchText({ text, className = "", glitchFactor = 0.03, interval = 2000 }) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    // Store original text
    const originalText = text

    // Function to create glitched text
    const glitchText = () => {
      // Characters to use for glitching
      const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`"

      // Create glitched version
      let result = ""
      for (let i = 0; i < originalText.length; i++) {
        // Randomly decide whether to glitch this character
        if (Math.random() < glitchFactor) {
          result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          result += originalText[i]
        }
      }

      return result
    }

    // Set up glitch effect interval
    const glitchInterval = setInterval(() => {
      // Start glitch sequence
      setIsGlitching(true)

      // Create multiple rapid glitch frames
      let frameCount = 0
      const frames = 6
      const frameInterval = setInterval(() => {
        if (frameCount < frames) {
          setDisplayText(glitchText())
          frameCount++
        } else {
          // End glitch sequence
          setDisplayText(originalText)
          setIsGlitching(false)
          clearInterval(frameInterval)
        }
      }, 50)
    }, interval)

    return () => {
      clearInterval(glitchInterval)
    }
  }, [text, glitchFactor, interval])

  return (
    <motion.span
      className={`inline-block ${className} ${isGlitching ? "text-red-500" : ""}`}
      animate={
        isGlitching
          ? {
              x: [0, -2, 3, -1, 0],
              y: [0, 1, -1, 2, 0],
            }
          : {}
      }
      transition={{ duration: 0.2 }}
    >
      {displayText}
    </motion.span>
  )
}
