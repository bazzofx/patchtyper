"use client"

import { useEffect, useRef } from "react"

export default function ParticleExplosion() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles = []
    const particleCount = 100
    const colors = ["#ef4444", "#f97316", "#f59e0b", "#06b6d4", "#3b82f6"]

    // Create explosion particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3 + 1

      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        life: 1, // 0-1 for opacity
        decay: Math.random() * 0.02 + 0.01,
      })
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update position
        p.x += p.speedX
        p.y += p.speedY

        // Reduce life
        p.life -= p.decay

        // Remove dead particles
        if (p.life <= 0) {
          particles.splice(i, 1)
          i--
          continue
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle =
          p.color +
          Math.floor(p.life * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Draw glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(p.x, p.y, p.radius / 2, p.x, p.y, p.radius * 2)
        gradient.addColorStop(
          0,
          p.color +
            Math.floor(p.life * 100)
              .toString(16)
              .padStart(2, "0"),
        )
        gradient.addColorStop(1, p.color + "00")
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
