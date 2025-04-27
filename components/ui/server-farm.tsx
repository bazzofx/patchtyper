"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Server, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react"

// Server states
const SERVER_STATES = {
  HEALTHY: "healthy",
  WARNING: "warning",
  CRITICAL: "critical",
  FAILED: "failed",
}

export default function ServerFarm({ health, patchSuccess, patchFailure }) {
  const [servers, setServers] = useState([
    { id: 1, state: SERVER_STATES.HEALTHY, label: "AUTH-SRV" },
    { id: 2, state: SERVER_STATES.HEALTHY, label: "DB-MAIN" },
    { id: 3, state: SERVER_STATES.HEALTHY, label: "API-GW" },
    { id: 4, state: SERVER_STATES.HEALTHY, label: "CDN-EDGE" },
    { id: 5, state: SERVER_STATES.HEALTHY, label: "STORAGE" },
  ])

  const [lastEvent, setLastEvent] = useState(null)
  const [eventAnimation, setEventAnimation] = useState(false)

  // Refs to track previous values to avoid unnecessary updates
  const prevHealthRef = useRef(health)
  const prevPatchSuccessRef = useRef(patchSuccess)
  const prevPatchFailureRef = useRef(patchFailure)

  // Update servers based on health
  useEffect(() => {
    // Skip if health hasn't changed
    if (prevHealthRef.current === health) return
    prevHealthRef.current = health

    const healthPercentage = health
    let newServers = [...servers]

    if (healthPercentage > 80) {
      // All servers healthy
      newServers = newServers.map((server) => ({ ...server, state: SERVER_STATES.HEALTHY }))
    } else if (healthPercentage > 60) {
      // One server in warning state
      newServers[4].state = SERVER_STATES.WARNING
    } else if (healthPercentage > 40) {
      // Two servers in warning, one critical
      newServers[4].state = SERVER_STATES.CRITICAL
      newServers[3].state = SERVER_STATES.WARNING
    } else if (healthPercentage > 20) {
      // One failed, two critical
      newServers[4].state = SERVER_STATES.FAILED
      newServers[3].state = SERVER_STATES.CRITICAL
      newServers[2].state = SERVER_STATES.WARNING
    } else if (healthPercentage > 0) {
      // Two failed, two critical
      newServers[4].state = SERVER_STATES.FAILED
      newServers[3].state = SERVER_STATES.FAILED
      newServers[2].state = SERVER_STATES.CRITICAL
      newServers[1].state = SERVER_STATES.CRITICAL
      newServers[0].state = SERVER_STATES.WARNING
    } else {
      // All failed - game over
      newServers = newServers.map((server) => ({ ...server, state: SERVER_STATES.FAILED }))
    }

    setServers(newServers)
  }, [health, servers])

  // Handle patch success
  useEffect(() => {
    // Skip if patchSuccess hasn't changed
    if (prevPatchSuccessRef.current === patchSuccess) return
    prevPatchSuccessRef.current = patchSuccess

    // Show success animation
    setLastEvent({
      type: "success",
      message: "Patch applied successfully",
    })
    setEventAnimation(true)

    // Potentially recover a server if one is in warning or critical state
    const serverToRecover = servers.findIndex(
      (s) => s.state === SERVER_STATES.WARNING || s.state === SERVER_STATES.CRITICAL,
    )

    if (serverToRecover !== -1) {
      const newServers = [...servers]
      // Improve server state by one level
      if (newServers[serverToRecover].state === SERVER_STATES.WARNING) {
        newServers[serverToRecover].state = SERVER_STATES.HEALTHY
      } else if (newServers[serverToRecover].state === SERVER_STATES.CRITICAL) {
        newServers[serverToRecover].state = SERVER_STATES.WARNING
      }
      setServers(newServers)
    }

    // Reset animation after delay
    const timer = setTimeout(() => {
      setEventAnimation(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [patchSuccess, servers])

  // Handle patch failure
  useEffect(() => {
    // Skip if patchFailure hasn't changed
    if (prevPatchFailureRef.current === patchFailure) return
    prevPatchFailureRef.current = patchFailure

    // Show failure animation
    setLastEvent({
      type: "failure",
      message: "System vulnerability exploited",
    })
    setEventAnimation(true)

    // Find a healthy or warning server to degrade
    const serverToDegrade = servers.findIndex(
      (s) => s.state === SERVER_STATES.HEALTHY || s.state === SERVER_STATES.WARNING,
    )

    if (serverToDegrade !== -1) {
      const newServers = [...servers]
      // Degrade server state by one level
      if (newServers[serverToDegrade].state === SERVER_STATES.HEALTHY) {
        newServers[serverToDegrade].state = SERVER_STATES.WARNING
      } else if (newServers[serverToDegrade].state === SERVER_STATES.WARNING) {
        newServers[serverToDegrade].state = SERVER_STATES.CRITICAL
      }
      setServers(newServers)
    }

    // Reset animation after delay
    const timer = setTimeout(() => {
      setEventAnimation(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [patchFailure, servers])

  // Get server status color and effects
  const getServerStyles = (state) => {
    switch (state) {
      case SERVER_STATES.HEALTHY:
        return {
          mainColor: "text-green-400",
          glowColor: "shadow-[0_0_15px_rgba(34,197,94,0.5)]",
          bgColor: "bg-green-900/20",
          borderColor: "border-green-500/30",
          statusIcon: <CheckCircle2 className="h-3 w-3 text-green-400" />,
          animation: "animate-pulse",
        }
      case SERVER_STATES.WARNING:
        return {
          mainColor: "text-yellow-400",
          glowColor: "shadow-[0_0_15px_rgba(234,179,8,0.5)]",
          bgColor: "bg-yellow-900/20",
          borderColor: "border-yellow-500/30",
          statusIcon: <AlertTriangle className="h-3 w-3 text-yellow-400" />,
          animation: "animate-pulse",
        }
      case SERVER_STATES.CRITICAL:
        return {
          mainColor: "text-orange-500",
          glowColor: "shadow-[0_0_15px_rgba(249,115,22,0.5)]",
          bgColor: "bg-orange-900/20",
          borderColor: "border-orange-500/30",
          statusIcon: <AlertCircle className="h-3 w-3 text-orange-500" />,
          animation: "animate-[pulse_0.5s_ease-in-out_infinite]",
        }
      case SERVER_STATES.FAILED:
        return {
          mainColor: "text-gray-600",
          glowColor: "",
          bgColor: "bg-gray-900/20",
          borderColor: "border-gray-800/30",
          statusIcon: <AlertCircle className="h-3 w-3 text-red-500" />,
          animation: "",
        }
      default:
        return {
          mainColor: "text-green-400",
          glowColor: "shadow-[0_0_15px_rgba(34,197,94,0.5)]",
          bgColor: "bg-green-900/20",
          borderColor: "border-green-500/30",
          statusIcon: <CheckCircle2 className="h-3 w-3 text-green-400" />,
          animation: "animate-pulse",
        }
    }
  }

  return (
    <div className="relative h-full w-full">
      {/* Event notification */}
      <AnimatePresence>
        {eventAnimation && lastEvent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-medium ${
              lastEvent.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {lastEvent.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Server farm */}
      <div className="grid grid-cols-5 gap-2">
        {servers.map((server) => {
          const styles = getServerStyles(server.state)

          return (
            <motion.div
              key={server.id}
              className={`flex flex-col items-center rounded-md border p-2 ${styles.borderColor} ${styles.bgColor} ${styles.glowColor} transition-all`}
              animate={{
                opacity: server.state === SERVER_STATES.FAILED ? 0.5 : 1,
              }}
            >
              <div className="flex items-center justify-center">
                <Server className={`h-8 w-8 ${styles.mainColor} ${styles.animation}`} />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {styles.statusIcon}
                <span className={styles.mainColor}>{server.label}</span>
              </div>

              {/* Glitch effect for critical servers */}
              {server.state === SERVER_STATES.CRITICAL && (
                <motion.div
                  className="absolute inset-0 bg-orange-500/10"
                  animate={{ opacity: [0, 0.2, 0, 0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                />
              )}

              {/* Smoke effect for failed servers */}
              {server.state === SERVER_STATES.FAILED && (
                <motion.div
                  className="absolute top-0 h-2 w-full bg-gradient-to-t from-transparent to-gray-500/20"
                  animate={{
                    opacity: [0, 0.3, 0.1, 0.4, 0],
                    y: [0, -10, -20],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
