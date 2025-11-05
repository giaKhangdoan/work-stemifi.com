"use client"

import { useEffect, useRef, useState } from "react"
import { getWorkshopStats } from "@/lib/workshop-utils"

export function AnimatedStats() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stats, setStats] = useState(getWorkshopStats())
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(true)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    updateCanvasDimensions()

    let animationFrameId: number

    const render = (progress: number) => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.fillStyle = "rgba(18, 18, 18, 0.1)"
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 3

      // Draw animated circles for occupancy rate
      const occupancyProgress = Math.min(progress * 2, 1)
      ctx.strokeStyle = `rgba(107, 114, 128, ${0.3 * occupancyProgress})`
      ctx.lineWidth = 2

      for (let i = 0; i < 3; i++) {
        const r = radius + i * 20
        const alpha = Math.max(0, 0.3 - i * 0.1) * occupancyProgress
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Draw rotating elements
      const rotation = (progress * Math.PI * 2) % (Math.PI * 2)
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      ctx.strokeStyle = "rgba(107, 114, 128, 0.2)"
      ctx.beginPath()
      ctx.arc(0, 0, radius / 2, 0, Math.PI / 2)
      ctx.stroke()

      ctx.restore()

      // Draw pulsing points
      const pulsePhase = (progress * Math.PI * 2) % (Math.PI * 2)
      ctx.fillStyle = `rgba(107, 114, 128, ${Math.sin(pulsePhase) * 0.3 + 0.3})`

      const points = 4
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2 + rotation
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const startTime = performance.now()
    const duration = 3000 // 3 seconds

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      render(progress)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        // Loop animation
        animationFrameId = requestAnimationFrame((time) => animate(time - duration))
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    const handleResize = () => {
      updateCanvasDimensions()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="h-80 w-full rounded-2xl border border-foreground/10 bg-foreground/5" />

      <div
        className={`grid grid-cols-3 gap-4 transition-all duration-700 ${animated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
          <p className="font-mono text-xs text-foreground/60 uppercase tracking-wide">Total</p>
          <p className="mt-2 font-sans text-2xl font-light text-foreground">{stats.totalWorkshops}</p>
          <p className="font-mono text-xs text-foreground/40 mt-1">workshops</p>
        </div>

        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
          <p className="font-mono text-xs text-foreground/60 uppercase tracking-wide">Enrolled</p>
          <p className="mt-2 font-sans text-2xl font-light text-foreground">{stats.totalEnrolled}</p>
          <p className="font-mono text-xs text-foreground/40 mt-1">students</p>
        </div>

        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
          <p className="font-mono text-xs text-foreground/60 uppercase tracking-wide">Occupancy</p>
          <p className="mt-2 font-sans text-2xl font-light text-foreground">{stats.occupancyRate}%</p>
          <p className="font-mono text-xs text-foreground/40 mt-1">capacity</p>
        </div>
      </div>
    </div>
  )
}
