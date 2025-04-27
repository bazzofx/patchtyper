"use client"
import { motion } from "framer-motion"

export default function FloatingHint({ text }) {
  // Create a single floating element with very slow, elegant movement
  const floatingElements = Array.from({ length: 1 }, (_, i) => ({
    id: i,
    // Reduced movement range for subtlety
    initialX: Math.random() * 30 - 15,
    initialY: Math.random() * 30 - 15,
    // Very slow animation (60-90 seconds per cycle)
    speed: 60 + Math.random() * 30,
    // Longer fade-in for elegance
    fadeInDuration: 11,
    // Subtle rotation for added elegance
    rotation: Math.random() * 5 - 2.5,
    scale: 0.9,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute left-0 top-0 h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }} // Slightly increased opacity for better visibility
          transition={{
            duration: element.fadeInDuration,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-green-400"
            initial={{
              x: element.initialX,
              y: element.initialY,
              scale: element.scale,
              rotate: -element.rotation,
            }}
            animate={{
              x: [element.initialX, -element.initialX * 0.8, element.initialX],
              y: [element.initialY, -element.initialY * 0.8, element.initialY],
              rotate: [-element.rotation, element.rotation, -element.rotation],
            }}
            transition={{
              duration: element.speed,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: [0.43, 0.13, 0.23, 0.96], // Custom cubic bezier for more elegant movement
              repeatDelay: 1, // Pause briefly between cycles
            }}
            style={{
              textShadow: "0 0 15px rgba(34,197,94,0.5)",
              letterSpacing: "0.05em", // Slightly increased letter spacing for elegance
            }}
          >
            {text}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
