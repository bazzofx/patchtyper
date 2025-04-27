"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, ShieldAlert, Clock, Terminal } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { gameConfig } from "@/lib/game-config"
import FloatingHint from "./floating-hint"

export default function ThreatCard({ threat, isActive }) {
  const [timeLeft, setTimeLeft] = useState(threat.timeLimit)
  const [progressValue, setProgressValue] = useState(100)

  // Calculate time left and progress
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - threat.createdAt) / 1000
      const remaining = Math.max(0, threat.timeLimit - elapsed)
      setTimeLeft(remaining)
      setProgressValue((remaining / threat.timeLimit) * 100)
    }, 100)

    return () => clearInterval(interval)
  }, [threat])

  // Get severity color
  const getSeverityColor = () => {
    switch (threat.severity) {
      case "critical":
        return "text-red-500"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      default:
        return "text-green-500"
    }
  }

  // Get progress color
  const getProgressColor = () => {
    if (progressValue > 60) return "bg-green-500"
    if (progressValue > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Generate hint based on config
  const generateHint = () => {
    if (!gameConfig.ui.showFixHint) return null

    const fix = threat.fix

    switch (gameConfig.ui.hintStyle) {
      case "full":
        return fix
      case "partial":
        // Show first letter of each word and replace rest with underscores
        return fix
          .split(" ")
          .map((word) => `${word[0]}${"_".repeat(word.length - 1)}`)
          .join(" ")
      case "floating":
        return null // Handled by FloatingHint component
      default:
        return null
    }
  }

  const hint = generateHint()

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-lg border ${
        isActive ? "border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "border-gray-800"
      } bg-gray-900/80 p-4 backdrop-blur-sm transition-all`}
    >
      {/* Floating hint in background */}
      {gameConfig.ui.hintStyle === "floating" && gameConfig.ui.showFixHint && <FloatingHint text={threat.fix} />}

      {/* Glow effect for active state */}
      {isActive && <div className="absolute inset-0 -z-10 bg-green-500/10 blur-xl" />}

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`h-5 w-5 ${getSeverityColor()}`} />
          <h3 className="font-medium text-white">{threat.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{timeLeft.toFixed(1)}s</span>
        </div>
      </div>

      <div className="mb-3 text-sm text-gray-400">{threat.description}</div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <div className="text-xs font-medium text-yellow-500">Fix required</div>
        </div>

        {hint && (
          <div className="flex items-center gap-1 text-xs text-green-400/70">
            <Terminal className="h-3 w-3" />
            <code className="font-mono">{hint}</code>
          </div>
        )}
      </div>

      <Progress value={progressValue} className="mt-3 h-1 bg-gray-800" indicatorClassName={getProgressColor()} />
    </motion.div>
  )
}
