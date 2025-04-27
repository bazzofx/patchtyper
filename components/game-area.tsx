"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ThreatCard from "./threat-card"
import ServerFarm from "@/components/ui/server-farm"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import GlitchOverlay from "./effects/glitch-overlay"
import DataStream from "./effects/data-stream"
import { useSound } from "@/lib/sound-manager"

export default function GameArea({ threats, onPatch, onFailedPatch, health }) {
  const [inputValue, setInputValue] = useState("")
  const [lastPatchSuccess, setLastPatchSuccess] = useState(false)
  const [lastPatchFailure, setLastPatchFailure] = useState(false)
  const [showGlitch, setShowGlitch] = useState(false)
  const inputRef = useRef(null)
  const { playSound } = useSound()

  // Focus input on mount and when threats change
  useEffect(() => {
    inputRef.current?.focus()
  }, [threats])

  // Create ref at the top level of the component
  const prevThreatsRef = useRef([])

  // Play sound when new threats appear
  useEffect(() => {
    // Find threats that weren't in the previous render
    const newThreats = threats.filter(
      (threat) => !prevThreatsRef.current.some((t) => t.instanceId === threat.instanceId),
    )

    if (newThreats.length > 0) {
      playSound("threatAppear")
    }

    // Update ref for next render
    prevThreatsRef.current = threats
  }, [threats, playSound])

  // Memoize the patch success and failure handlers to prevent infinite loops
  const handlePatchSuccess = useCallback(() => {
    setLastPatchSuccess((prev) => !prev) // Toggle to trigger effect in ServerFarm
    playSound("patchSuccess")
  }, [playSound])

  const handlePatchFailure = useCallback(() => {
    setLastPatchFailure((prev) => !prev) // Toggle to trigger effect in ServerFarm
    playSound("patchFail")

    // Show glitch effect on failure
    setShowGlitch(true)
    setTimeout(() => setShowGlitch(false), 500)
  }, [playSound])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Check if input matches any threat's fix
    const matchedThreat = threats.find((threat) => inputValue.toLowerCase() === threat.fix.toLowerCase())

    if (matchedThreat) {
      onPatch(matchedThreat.instanceId)
      // Trigger patch success event
      handlePatchSuccess()
    } else {
      onFailedPatch(5) // Small penalty for wrong input
      // Trigger patch failure event
      handlePatchFailure()
    }

    // Clear input
    setInputValue("")
  }

  // Play typing sound on key press
  const handleKeyPress = () => {
    playSound("typingKey")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Glitch overlay for failed patches */}
      <GlitchOverlay active={showGlitch} intensity={0.5} />

      {/* Server visualization */}
      <div className="rounded-lg border border-green-500/30 bg-black/80 p-4 backdrop-blur-sm">
        <ServerFarm health={health} patchSuccess={lastPatchSuccess} patchFailure={lastPatchFailure} />
      </div>

      <div className="min-h-[400px] rounded-lg border border-green-500/30 bg-black/80 p-4 backdrop-blur-sm">
        {/* Data stream in the background */}
        <div className="absolute top-0 right-0 opacity-20 z-0">
          <DataStream width={200} height={400} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          <AnimatePresence>
            {threats.map((threat) => (
              <motion.div
                key={threat.instanceId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ThreatCard threat={threat} isActive={inputValue.toLowerCase() === threat.fix.toLowerCase()} />
              </motion.div>
            ))}

            {threats.length === 0 && (
              <div className="col-span-full flex h-[300px] items-center justify-center text-gray-500">
                <p>System secure. Waiting for threats...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type the fix command..."
          className="border-green-500/30 bg-black/80 text-white backdrop-blur-sm focus-visible:ring-green-500"
          autoComplete="off"
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          onClick={() => playSound("buttonClick")}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
