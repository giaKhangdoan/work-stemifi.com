"use client"

import { useEffect, useState } from "react"
import { getLiveWorkshop, getNextUpcomingWorkshop, type Workshop } from "@/lib/workshop-utils"

export function useLiveWorkshop() {
  const [liveWorkshop, setLiveWorkshop] = useState<Workshop | null>(null)
  const [nextWorkshop, setNextWorkshop] = useState<Workshop | null>(null)
  const [timeUntilNext, setTimeUntilNext] = useState<string>("")

  useEffect(() => {
    // Update immediately
    const updateWorkshopStatus = () => {
      const live = getLiveWorkshop()
      const next = getNextUpcomingWorkshop()

      setLiveWorkshop(live)
      setNextWorkshop(next)

      // Calculate time until next workshop
      if (next && !live) {
        const now = new Date()
        const timeMatch = next.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)

        if (timeMatch) {
          let hour = Number.parseInt(timeMatch[1])
          const minute = Number.parseInt(timeMatch[2])
          const isPM = timeMatch[3] === "PM"

          if (isPM && hour !== 12) hour += 12
          else if (!isPM && hour === 12) hour = 0

          const nextTime = new Date()
          nextTime.setHours(hour, minute, 0, 0)

          if (nextTime <= now) {
            nextTime.setDate(nextTime.getDate() + 1)
          }

          const diff = nextTime.getTime() - now.getTime()
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

          setTimeUntilNext(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`)
        }
      } else {
        setTimeUntilNext("")
      }
    }

    updateWorkshopStatus()

    // Update every minute
    const interval = setInterval(updateWorkshopStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  return { liveWorkshop, nextWorkshop, timeUntilNext }
}
