import { gameConfig } from "@/lib/game-config"
export default function HealthBar({ value }) {
  // Determine color based on health percentage rather than absolute value
  const getHealthColor = () => {
  
    const percentage = (value / gameConfig.player.initialHealth) * 100 // Calculate percentage based on max health of 300
    if (percentage > 60) return "bg-gradient-to-r from-green-500 to-emerald-400"
    if (percentage > 30) return "bg-gradient-to-r from-yellow-500 to-amber-400"
    return "bg-gradient-to-r from-red-500 to-rose-400"
  }

  return (
    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-800">
      <div
        className={`h-full transition-all duration-300 ${getHealthColor()}`}
        style={{ width: `${(value / 300) * 100}%` }}
      />
    </div>
  )
}
