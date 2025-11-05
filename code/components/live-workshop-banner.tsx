"use client"

import { useLiveWorkshop } from "@/hooks/use-live-workshop"
import { Dot, Clock, ArrowRight } from "lucide-react"

export function LiveWorkshopBanner() {
  const { liveWorkshop, nextWorkshop, timeUntilNext } = useLiveWorkshop()

  if (!liveWorkshop && !nextWorkshop) return null

  if (liveWorkshop) {
    return (
      <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-xl border border-emerald-400/50 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-4 backdrop-blur-md md:bottom-8 md:right-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex shrink-0 items-center gap-1">
            <Dot className="h-3 w-3 animate-pulse fill-emerald-400 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Workshop Live Now
            </p>
            <h3 className="mb-2 line-clamp-2 font-sans font-medium tracking-tight text-foreground">{liveWorkshop.title}</h3>
            <p className="font-mono text-xs text-foreground/60">with {liveWorkshop.instructor}</p>
          </div>
          <button className="shrink-0 rounded-lg bg-emerald-500/30 p-2 transition-all hover:bg-emerald-500/40">
            <ArrowRight className="h-4 w-4 text-emerald-400" />
          </button>
        </div>
      </div>
    )
  }

  if (nextWorkshop && timeUntilNext) {
    return (
      <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 backdrop-blur-md md:bottom-8 md:right-8">
        <div className="flex items-start gap-3">
          <Clock className="mt-1 h-4 w-4 shrink-0 text-blue-400" />
          <div className="flex-1 min-w-0">
            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wide text-blue-400">Coming Up</p>
            <h3 className="mb-1 line-clamp-2 font-sans font-medium tracking-tight text-foreground">{nextWorkshop.title}</h3>
            <p className="font-mono text-xs text-foreground/60">Starts in {timeUntilNext}</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
