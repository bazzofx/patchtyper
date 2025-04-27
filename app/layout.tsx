import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import MatrixRain from "@/components/effects/matrix-rain"
import ScanLines from "@/components/effects/scan-lines"
import { SoundProvider } from "@/lib/sound-manager"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SoundProvider>
            <MatrixRain opacity={0.05} />
            <ScanLines opacity={0.1} />
            {children}
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
