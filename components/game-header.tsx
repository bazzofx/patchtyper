"use client"

import { Trophy, Heart, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import HealthBar from "./health-bar"
import ParticleBackground from "@/components/ui/particle-background"
import { Progress } from "@/components/ui/progress"
import GlitchText from "./effects/glitch-text"
import PulseGlow from "./effects/pulse-glow"
import SoundToggle from "./ui/sound-toggle"
import { useSound } from "@/lib/sound-manager"

export default function GameHeader({
  health,
  score,
  level,
  wave,
  threatCount = 0,
  threatsPerWave = 5,
  gameStarted,
  onStart,
}) {
  // Calculate wave progress
  const waveProgress = (threatCount / threatsPerWave) * 100
  const { playSound } = useSound()

  const handleStart = () => {
    playSound("gameStart")
    onStart()
  }

  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      <div className="relative z-10 rounded-lg border border-green-500/30 bg-black/80 p-4 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-white">
              <GlitchText
                text="Defend Your Network by Typing Patches"
                className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                glitchFactor={0.05}
                interval={5000}
              />
            </div>
          </div>

          {!gameStarted ? (
            <div className="flex items-center gap-4">
              <SoundToggle />
              <PulseGlow>
                <Button
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.7)] md:w-auto"
                >
                  START GAME
                </Button>
              </PulseGlow>
            </div>
          ) : (
            <div className="flex w-full flex-wrap items-center justify-between gap-4 md:w-auto md:justify-end">
              <SoundToggle />

              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                <HealthBar value={health} />
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">{score} pts</span>
              </div>

              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-purple-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-purple-400">Wave {wave}</span>
                  <Progress value={waveProgress} className="h-1 w-20 bg-gray-800" indicatorClassName="bg-purple-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
