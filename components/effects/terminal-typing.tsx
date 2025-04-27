"use client"

import { useState, useEffect } from "react"

export default function TerminalTyping({
  text,
  className = "",
  typingSpeed = 50,
  cursorBlink = true,
  onComplete = () => {},
  startDelay = 0,
}) {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let timeout

    // Reset and start typing after delay
    timeout = setTimeout(() => {
      setDisplayText("")
      setIsTyping(true)

      let currentIndex = 0
      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text.charAt(currentIndex))
          currentIndex++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
          onComplete()
        }
      }, typingSpeed)

      return () => clearInterval(typeInterval)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [text, typingSpeed, onComplete, startDelay])

  // Cursor blinking effect
  useEffect(() => {
    if (!cursorBlink) return

    const cursorInterval = setInterval(() => {
      if (!isTyping) {
        setShowCursor((prev) => !prev)
      } else {
        setShowCursor(true)
      }
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [isTyping, cursorBlink])

  return (
    <span className={`font-mono ${className}`}>
      {displayText}
      {showCursor && <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse"></span>}
    </span>
  )
}
