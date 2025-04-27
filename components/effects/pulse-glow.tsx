"use client"

import { motion } from "framer-motion"

export default function PulseGlow({ children, color = "rgba(34, 197, 94, 0.5)", intensity = 1, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-lg blur-xl z-0"
        animate={{
          opacity: [0.5 * intensity, 0.8 * intensity, 0.5 * intensity],
          scale: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
