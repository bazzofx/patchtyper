"use client"

export default function ScanLines({ opacity = 0.1 }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0) 0px,
          rgba(0, 0, 0, 0) 1px,
          rgba(0, 0, 0, ${opacity}) 1px,
          rgba(0, 0, 0, ${opacity}) 2px
        )`,
        backgroundSize: "100% 4px",
      }}
    />
  )
}
