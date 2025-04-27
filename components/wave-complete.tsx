"use client"

import { motion } from "framer-motion"
import { Shield, Trophy, Heart, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gameConfig } from "@/lib/game-config"
import PulseGlow from "./effects/pulse-glow"
import { useState, useEffect } from "react"
import { useSound } from "@/lib/sound-manager"

export default function WaveComplete({ wave, score, healthRestored, onContinue }) {
  const waveBonus = gameConfig.scoring.waveCompletionBonus * wave
  const [showAnimation, setShowAnimation] = useState(true)
  const { playSound } = useSound()

  // Play wave complete sound when component mounts
  useEffect(() => {
    playSound("waveComplete")
  }, [playSound])

  // Only show entrance animation briefly
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    playSound("buttonClick")
    onContinue()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 flex flex-col items-center rounded-lg border border-green-500/30 bg-black/90 p-8 text-center backdrop-blur-md"
    >
      {/* Brief success flash */}
      {showAnimation && (
        <motion.div
          className="absolute inset-0 z-20 bg-green-500/10 rounded-lg"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      )}

      <PulseGlow className="mb-4 rounded-full bg-green-500/20 p-4">
        <Shield className="h-12 w-12 text-green-500" />
      </PulseGlow>

      <h2 className="mb-2 text-2xl font-bold text-white">Wave {wave} Complete!</h2>
      <p className="mb-6 text-gray-400">Security threats neutralized</p>

      <div className="mb-8 grid w-full max-w-xs grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-800/50 p-4">
          <Trophy className="mx-auto mb-2 h-6 w-6 text-green-400" />
          <div className="text-sm text-gray-400">Wave Bonus</div>
          <div className="text-xl font-bold text-green-400">+{waveBonus}</div>
        </div>

        <div className="rounded-lg bg-gray-800/50 p-4">
          <Heart className="mx-auto mb-2 h-6 w-6 text-red-400" />
          <div className="text-sm text-gray-400">Health Restored</div>
          <div className="text-xl font-bold text-red-400">+{healthRestored}</div>
        </div>
      </div>

      <div className="mb-6 w-full max-w-xs rounded-lg bg-gray-800/50 p-4">
        <Zap className="mx-auto mb-2 h-6 w-6 text-yellow-400" />
        <div className="text-sm text-gray-400">Next Wave</div>
        <div className="text-xl font-bold text-yellow-400">More Threats Incoming</div>
      </div>

      <PulseGlow>
        <Button
          onClick={handleContinue}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </PulseGlow>
    </motion.div>
  )
}
