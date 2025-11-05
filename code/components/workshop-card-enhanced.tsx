"use client"

import type { Workshop } from "@/lib/workshop-utils"
import { Users, Clock, Zap, Dot } from "lucide-react"
import { isWorkshopHappeningNow } from "@/lib/workshop-utils"

export function WorkshopCardEnhanced({ workshop }: { workshop: Workshop }) {
  const occupancy = Math.round((workshop.enrolled / workshop.capacity) * 100)
  const isLive = isWorkshopHappeningNow(workshop)

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
        isLive
          ? "border-emerald-400/50 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:shadow-lg hover:shadow-emerald-500/20"
          : `${workshop.borderColor} bg-gradient-to-br ${workshop.color} hover:scale-105 hover:shadow-lg`
      }`}
    >
      {/* Soft 3D Effect Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Live Indicator */}
      {isLive && (
        <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl bg-emerald-500/90 px-3 py-2 backdrop-blur-sm">
          <Dot className="h-2 w-2 animate-pulse fill-white text-white" />
          <span className="font-mono text-xs font-semibold text-white">LIVE</span>
        </div>
      )}

      {/* Level Badge */}
      <div className="m-6 mb-4 inline-block rounded-full bg-foreground/10 px-3 py-1">
        <span className="font-mono text-xs font-semibold text-foreground/80">{workshop.level}</span>
      </div>

      {/* Title */}
      <h3 className="mb-2 px-6 font-sans text-2xl font-medium leading-tight tracking-tight text-foreground md:text-3xl">
        {workshop.title}
      </h3>

      {/* Description */}
      <p className="mb-6 px-6 font-sans text-sm leading-relaxed tracking-tight text-foreground/70 line-clamp-2">{workshop.description}</p>

      {/* Tags */}
      <div className="mb-6 flex flex-wrap gap-2 px-6">
        {workshop.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-foreground/15 px-3 py-1 font-mono text-xs text-foreground/80 backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Info Grid */}
      <div className="space-y-3 border-t border-foreground/10 px-6 py-4 pt-4">
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
          <div
            className={`flex h-6 items-center gap-1 rounded-full px-2 ${
              occupancy >= 80 ? "bg-orange-400/20" : "bg-blue-400/20"
            }`}
          >
            <div className={`h-1.5 w-1.5 rounded-full ${occupancy >= 80 ? "bg-orange-400" : "bg-blue-400"}`} />
            <span className="font-mono text-xs text-foreground/60">{occupancy}%</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        className={`mt-6 w-full rounded-xl py-2.5 font-mono text-sm font-semibold transition-all duration-300 ${
          isLive
            ? "bg-emerald-500/30 text-white hover:bg-emerald-500/40 hover:shadow-md"
            : "bg-foreground/20 text-foreground/90 hover:bg-foreground/30 hover:shadow-md"
        } active:scale-95 m-6 mt-auto`}
      >
        {isLive ? "Join Now" : "View Details"}
      </button>
    </div>
  )
}
