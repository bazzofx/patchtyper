"use client"

import { useState, useEffect } from "react"
import GameHeader from "./game-header"
import GameArea from "./game-area"
import GameOver from "./game-over"
import WaveComplete from "./wave-complete"
import { threatData } from "@/lib/game-data"
import { useToast } from "@/hooks/use-toast"
import { gameConfig } from "@/lib/game-config"
import { useSound } from "@/lib/sound-manager"

export default function GameContainer() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [waveComplete, setWaveComplete] = useState(false)
  const [health, setHealth] = useState(gameConfig.player.initialHealth)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [wave, setWave] = useState(1)
  const [currentThreats, setCurrentThreats] = useState([])
  const [spawnRate, setSpawnRate] = useState(gameConfig.difficulty.initialSpawnRate)
  const [threatCount, setThreatCount] = useState(0) // Threats defeated in current wave
  const [healthRestored, setHealthRestored] = useState(0) // For wave completion display
  const { toast } = useToast()
  const { playSound } = useSound()

  // Start game
  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setWaveComplete(false)
    setHealth(gameConfig.player.initialHealth)
    setScore(0)
    setLevel(1)
    setWave(1)
    setCurrentThreats([])
    setThreatCount(0)
    setSpawnRate(gameConfig.difficulty.initialSpawnRate)
  }

  // Restart game
  const restartGame = () => {
    playSound("buttonClick")
    startGame()
  }

  // Continue to next wave
  const continueToNextWave = () => {
    playSound("buttonClick")
    setWaveComplete(false)
    setWave((prev) => prev + 1)
    setThreatCount(0)
    // Clear all threats from the previous wave
    setCurrentThreats([])

    // Increase difficulty for the next wave
    setSpawnRate((prev) => Math.max(gameConfig.difficulty.minSpawnRate, prev - gameConfig.difficulty.spawnRateDecrease))
  }

  // Generate a new threat
  const generateThreat = () => {
    if (currentThreats.length >= gameConfig.player.maxThreats) return // Max threats at once

    // Filter threats based on current wave and level
    const availableThreats = threatData.filter(
      (threat) => level >= threat.minLevel && !currentThreats.some((t) => t.id === threat.id),
    )

    if (availableThreats.length === 0) return

    // Select a random threat, with higher chance for more difficult threats in later waves
    let randomThreat
    if (wave > 3) {
      // Sort by severity for later waves to increase difficulty
      const sortedThreats = [...availableThreats].sort((a, b) => {
        const severityScore = {
          critical: 3,
          high: 2,
          medium: 1,
          low: 0,
        }
        return severityScore[b.severity] - severityScore[a.severity]
      })

      // Higher chance to pick more severe threats in later waves
      const index = Math.min(
        Math.floor(Math.random() * sortedThreats.length * (1 - wave / (gameConfig.waves.maxWaves * 2))),
        sortedThreats.length - 1,
      )
      randomThreat = sortedThreats[index]
    } else {
      // Random selection for early waves
      randomThreat = availableThreats[Math.floor(Math.random() * availableThreats.length)]
    }

    // Calculate time limit based on gameConfig.time.timePerCard and severity
    let baseTime = gameConfig.time.timePerCard

    // Adjust time based on threat severity
    const severityTimeModifier = {
      critical: 0.8, // Critical threats get less time
      high: 0.9,
      medium: 1.0,
      low: 1.1, // Low severity threats get more time
    }

    baseTime *= severityTimeModifier[randomThreat.severity] || 1

    // Apply wave difficulty modifier to time limit
    const waveTimeModifier = Math.max(
      gameConfig.time.minTimePercentage,
      1 - (wave - 1) * gameConfig.time.timeReductionPerWave,
    ) // Reduce time by configured percentage per wave, with a minimum

    const newThreat = {
      ...randomThreat,
      instanceId: Date.now() + Math.random(),
      createdAt: Date.now(),
      timeLimit: baseTime * waveTimeModifier * gameConfig.time.timeMultiplier, // Use the calculated time
      damage: Math.ceil(randomThreat.damage * (1 + (wave - 1) * 0.1)), // Increase damage by 10% per wave
    }

    setCurrentThreats((prev) => [...prev, newThreat])
  }

  // Handle successful patch
  const handlePatch = (threatInstanceId) => {
    const threat = currentThreats.find((t) => t.instanceId === threatInstanceId)
    if (!threat) return

    // Calculate time bonus (faster = more points)
    const timeElapsed = (Date.now() - threat.createdAt) / 1000 // seconds
    const timeBonus = Math.max(0, Math.floor(gameConfig.scoring.timeBonus.threshold - timeElapsed))
    const pointsEarned = threat.points + timeBonus

    // Update score
    setScore((prev) => prev + pointsEarned)

    // Remove threat
    setCurrentThreats((prev) => prev.filter((t) => t.instanceId !== threatInstanceId))

    // Increment threat count for wave progression
    setThreatCount((prev) => prev + 1)

    // Show success toast
    toast({
      title: "Threat Patched!",
      description: `+${pointsEarned} points`,
      variant: "success",
    })

    // Level up check
    if (score > level * gameConfig.scoring.levelUpThreshold) {
      setLevel((prev) => prev + 1)
      playSound("alert")
      toast({
        title: "Level Up!",
        description: `You've reached level ${level + 1}`,
        variant: "success",
      })
    }

    // Check if wave is complete
    if (threatCount + 1 >= gameConfig.waves.threatsPerWave * wave) {
      completeWave()
    }
  }

  // Handle wave completion
  const completeWave = () => {
    // Play wave complete sound
    playSound("waveComplete")

    // Calculate wave bonus
    const waveBonus = gameConfig.scoring.waveCompletionBonus * wave
    setScore((prev) => prev + waveBonus)

    // Restore some health
    const healthToRestore = Math.min(gameConfig.player.healthRestorePerWave, gameConfig.player.initialHealth - health)
    setHealthRestored(healthToRestore)
    setHealth((prev) => Math.min(gameConfig.player.initialHealth, prev + healthToRestore))

    // Clear all threats from the completed wave
    setCurrentThreats([])

    // Show wave complete screen
    setWaveComplete(true)

    // Show toast
    toast({
      title: `Wave ${wave} Complete!`,
      description: `+${waveBonus} points bonus! Health restored: +${healthToRestore}`,
      variant: "success",
    })
  }

  // Handle failed patch
  const handleFailedPatch = (damage = 30) => {
    // Increased default damage from 10 to 30
    setHealth((prev) => Math.max(0, prev - damage))

    // Check game over
    if (health - damage <= 0) {
      setGameOver(true)
      playSound("gameOver")
    }
  }

  // Handle threat timeout
  const handleThreatTimeout = (threatInstanceId) => {
    const threat = currentThreats.find((t) => t.instanceId === threatInstanceId)
    if (!threat) return

    // Play threat expire sound
    playSound("threatExpire")

    // Apply damage
    handleFailedPatch(threat.damage)

    // Remove threat
    setCurrentThreats((prev) => prev.filter((t) => t.instanceId !== threatInstanceId))

    // Show failure toast
    toast({
      title: "Security Breach!",
      description: `${threat.name} exploited your system`,
      variant: "destructive",
    })
  }

  // Spawn threats at regular intervals
  useEffect(() => {
    if (!gameStarted || gameOver || waveComplete) return

    const interval = setInterval(() => {
      generateThreat()
    }, spawnRate)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver, waveComplete, spawnRate, currentThreats.length, wave])

  // Check for expired threats
  useEffect(() => {
    if (!gameStarted || gameOver || waveComplete) return

    const interval = setInterval(() => {
      const now = Date.now()
      currentThreats.forEach((threat) => {
        const timeElapsed = (now - threat.createdAt) / 1000 // seconds
        if (timeElapsed > threat.timeLimit) {
          handleThreatTimeout(threat.instanceId)
        }
      })
    }, gameConfig.difficulty.threatCheckInterval)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver, waveComplete, currentThreats])

  return (
    <div className="w-full max-w-4xl">
      <GameHeader
        health={health}
        score={score}
        level={level}
        wave={wave}
        threatCount={threatCount}
        threatsPerWave={gameConfig.waves.threatsPerWave * wave}
        gameStarted={gameStarted}
        onStart={startGame}
      />

      {gameStarted && !gameOver && !waveComplete && (
        <GameArea threats={currentThreats} onPatch={handlePatch} onFailedPatch={handleFailedPatch} health={health} />
      )}

      {waveComplete && (
        <WaveComplete wave={wave} score={score} healthRestored={healthRestored} onContinue={continueToNextWave} />
      )}

      {gameOver && <GameOver score={score} level={level} wave={wave} onRestart={restartGame} />}
    </div>
  )
}
