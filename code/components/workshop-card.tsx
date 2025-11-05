"use client"

import type { Workshop } from "@/lib/workshop-utils"
import { Users, Clock, Zap } from "lucide-react"

export function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const occupancy = Math.round((workshop.enrolled / workshop.capacity) * 100)

  return (
    <div
      data-3d-card
      className={`group relative overflow-hidden rounded-2xl border-2 ${workshop.borderColor} bg-gradient-to-br ${workshop.color} p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Soft 3D Effect Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Animated background accent */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/5 blur-3xl transition-all duration-300 group-hover:scale-150" />

      {/* Level Badge with animation */}
      <div className="mb-4 inline-block animate-slide-in-rotate rounded-full bg-foreground/10 px-3 py-1">
        <span className="font-mono text-xs font-semibold text-foreground/80">{workshop.level}</span>
      </div>

      {/* Title with hover effect */}
      <h3 className="mb-2 font-sans text-2xl font-medium leading-tight tracking-tight text-foreground transition-transform duration-300 group-hover:scale-105 origin-left md:text-3xl">
        {workshop.title}
      </h3>

      {/* Description */}
      <p className="mb-6 font-sans text-sm leading-relaxed tracking-tight text-foreground/70 line-clamp-2">{workshop.description}</p>

      {/* Tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        {workshop.tags.map((tag, index) => (
          <span
            key={tag}
            className="animate-slide-in-rotate rounded-full bg-foreground/15 px-3 py-1 font-mono text-xs text-foreground/80 backdrop-blur-sm"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Info Grid */}
      <div className="space-y-3 border-t border-foreground/10 pt-4">
        {/* Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground/60" />
            <span className="font-mono text-sm text-foreground/70">{workshop.time}</span>
          </div>
          <span className="font-mono text-xs text-foreground/50">{workshop.duration}</span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-foreground/60" />
          <span className="font-mono text-sm text-foreground/70">with {workshop.instructor}</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-foreground/60" />
            <span className="font-mono text-sm text-foreground/70">
              {workshop.enrolled}/{workshop.capacity} enrolled
            </span>
          </div>
          <div className="flex h-6 items-center gap-1 rounded-full bg-foreground/10 px-2 animate-bounce-subtle">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span className="font-mono text-xs text-foreground/60">{occupancy}%</span>
          </div>
        </div>
      </div>

      {/* CTA Button with glow effect */}
      <button className="mt-6 w-full rounded-xl bg-foreground/20 py-2.5 font-mono text-sm font-semibold text-foreground/90 transition-all duration-300 hover:bg-foreground/30 hover:shadow-md active:scale-95 hover:animate-glow-pulse">
        View Details
      </button>
    </div>
  )
}
