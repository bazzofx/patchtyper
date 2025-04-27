"use client"

import { useState, useEffect, useCallback, createContext, useContext } from "react"

// Define sound types
export type SoundEffect =
  | "buttonClick"
  | "gameStart"
  | "patchSuccess"
  | "patchFail"
  | "threatAppear"
  | "threatExpire"
  | "waveComplete"
  | "gameOver"
  | "typingKey"
  | "alert"

// Sound file paths
const SOUND_FILES: Record<SoundEffect, string> = {
  buttonClick: "/soundFX/button-click.mp3",
  gameStart: "/soundFX/game-start.mp3",
  patchSuccess: "/soundFX/patch-success.mp3",
  patchFail: "/soundFX/patch-fail.mp3",
  threatAppear: "/soundFX/threat-appear.mp3",
  threatExpire: "/soundFX/threat-expire.mp3",
  waveComplete: "/soundFX/wave-complete.mp3",
  gameOver: "/soundFX/game-over.mp3",
  typingKey: "/soundFX/typing-key.mp3",
  alert: "/soundFX/alert.mp3",
}

// Create context for sound manager
type SoundContextType = {
  playSound: (sound: SoundEffect) => void
  isMuted: boolean
  toggleMute: () => void
  volume: number
  setVolume: (volume: number) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

// Sound provider component
export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [audioElements, setAudioElements] = useState<Record<SoundEffect, HTMLAudioElement | null>>({} as any)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize audio elements
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Create audio elements for each sound
    const elements: Record<SoundEffect, HTMLAudioElement> = {} as any

    Object.entries(SOUND_FILES).forEach(([key, path]) => {
      const audio = new Audio(path)
      audio.preload = "auto"
      elements[key as SoundEffect] = audio
    })

    setAudioElements(elements)
    setIsInitialized(true)

    // Clean up
    return () => {
      Object.values(elements).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
    }
  }, [])

  // Update volume for all audio elements
  useEffect(() => {
    if (!isInitialized) return

    Object.values(audioElements).forEach((audio) => {
      if (audio) {
        audio.volume = isMuted ? 0 : volume
      }
    })
  }, [volume, isMuted, audioElements, isInitialized])

  // Play sound function
  const playSound = useCallback(
  (sound: SoundEffect) => {
    if (!isInitialized || isMuted) return;

    const audio = audioElements[sound];
    if (audio) {
      if (audio.paused) {
        // Only reset and play if it's not already playing
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.log("Audio playback failed:", error);
        });
      }
      // Otherwise, do nothing (let it keep playing)
    }
  },
  [audioElements, isMuted, isInitialized],
);

  // Toggle mute function
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  // Context value
  const contextValue: SoundContextType = {
    playSound,
    isMuted,
    toggleMute,
    volume,
    setVolume,
  }

  return <SoundContext.Provider value={contextValue}>{children}</SoundContext.Provider>
}

// Hook to use sound manager
export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}

// Standalone function to play sounds (for components that don't use hooks)
let globalSoundManager: SoundContextType | null = null

export function setGlobalSoundManager(manager: SoundContextType) {
  globalSoundManager = manager
}

export function playSound(sound: SoundEffect) {
  if (globalSoundManager) {
    globalSoundManager.playSound(sound)
  }
}
