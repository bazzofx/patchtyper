"use client"

import { motion } from "framer-motion"
import { AlertOctagon, Trophy, RotateCcw, Flag, Share2, Linkedin, Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import ParticleExplosion from "@/components/ui/particle-explosion"
import { useState, useEffect } from "react"
import { useSound } from "@/lib/sound-manager"
import PulseGlow from "./effects/pulse-glow"

export default function GameOver({ score, level, wave, onRestart }) {
  const [showGlitch, setShowGlitch] = useState(true)
  const { playSound } = useSound()

  // Play game over sound when component mounts
  useEffect(() => {
    playSound("gameOver")
  }, [playSound])

  // Only show glitch effect briefly when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGlitch(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Handle social media sharing
  const handleShare = (platform) => {
    playSound("buttonClick")

    const shareText = `I scored ${score} points, reached level ${level} and wave ${wave} in Patch Typer, the cybersecurity typing game! Can you beat my score?`
    const shareUrl = window.location.href

    let shareLink = ""

    switch (platform) {
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      default:
        // Use Web Share API if available
        if (navigator.share) {
          navigator
            .share({
              title: "Patch Typer Score",
              text: shareText,
              url: shareUrl,
            })
            .catch((err) => console.error("Error sharing:", err))
          return
        }
    }

    // Open share link in new window
    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="relative">
      <ParticleExplosion />

      {/* Brief glitch effect that fades out */}
      {showGlitch && (
        <motion.div
          className="absolute inset-0 z-20 bg-red-500/10"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center rounded-lg border border-red-500/30 bg-black/90 p-8 text-center backdrop-blur-md"
      >
        <div className="mb-4 rounded-full bg-red-500/20 p-4">
          <AlertOctagon className="h-12 w-12 text-red-500" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-white">System Compromised</h2>
        <p className="mb-6 text-gray-400">Your security defenses have been breached</p>

        <div className="mb-8 grid w-full max-w-xs grid-cols-3 gap-4">
          <div className="rounded-lg bg-gray-800/50 p-4">
            <Trophy className="mx-auto mb-2 h-6 w-6 text-green-400" />
            <div className="text-sm text-gray-400">Final Score</div>
            <div className="text-xl font-bold text-green-400">{score}</div>
          </div>

          <div className="rounded-lg bg-gray-800/50 p-4">
            <Trophy className="mx-auto mb-2 h-6 w-6 text-yellow-400" />
            <div className="text-sm text-gray-400">Level</div>
            <div className="text-xl font-bold text-yellow-400">{level}</div>
          </div>

          <div className="rounded-lg bg-gray-800/50 p-4">
            <Flag className="mx-auto mb-2 h-6 w-6 text-purple-400" />
            <div className="text-sm text-gray-400">Wave</div>
            <div className="text-xl font-bold text-purple-400">{wave}</div>
          </div>
        </div>

        {/* Social Media Sharing */}
        <div className="mb-6 w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Share2 className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Share your score</span>
          </div>

          <div className="flex justify-center gap-3">
            <PulseGlow color="rgba(34, 197, 94, 0.3)" intensity={0.7}>
              <Button
                onClick={() => handleShare("linkedin")}
                variant="outline"
                size="icon"
                className="border-green-500/30 bg-black hover:bg-green-950 hover:border-green-400 transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              >
                <Linkedin className="h-5 w-5 text-green-400" />
              </Button>
            </PulseGlow>

            <PulseGlow color="rgba(34, 197, 94, 0.3)" intensity={0.7}>
              <Button
                onClick={() => handleShare("facebook")}
                variant="outline"
                size="icon"
                className="border-green-500/30 bg-black hover:bg-green-950 hover:border-green-400 transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              >
                <Facebook className="h-5 w-5 text-green-400" />
              </Button>
            </PulseGlow>

            <PulseGlow color="rgba(34, 197, 94, 0.3)" intensity={0.7}>
              <Button
                onClick={() => handleShare("twitter")}
                variant="outline"
                size="icon"
                className="border-green-500/30 bg-black hover:bg-green-950 hover:border-green-400 transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              >
                <Twitter className="h-5 w-5 text-green-400" />
              </Button>
            </PulseGlow>
          </div>
        </div>

        <Button
          onClick={onRestart}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart System
        </Button>
      </motion.div>
    </div>
  )
}
