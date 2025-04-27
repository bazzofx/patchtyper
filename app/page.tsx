import GameContainer from "@/components/game-container"
import MatrixRain from "@/components/effects/matrix-rain"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <MatrixRain opacity={0.45} />
      <GameContainer />
    </main>
  )
}
