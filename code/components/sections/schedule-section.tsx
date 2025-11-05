"use client"

import { useReveal } from "@/hooks/use-reveal"
import { useState, useEffect } from "react"
import { getUpcomingWorkshops, getCurrentWeek, getWorkshopsByWeek } from "@/lib/workshop-utils"
import { Clock, Users, Calendar } from "lucide-react"

export function ScheduleSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<any[]>([])
  const [nextWorkshop, setNextWorkshop] = useState<any>(null)

  useEffect(() => {
    const week = getCurrentWeek()
    setCurrentWeek(week)
    setUpcomingWorkshops(getUpcomingWorkshops())

    // Get next workshop after current
    const allWeekWorkshops = getWorkshopsByWeek(week)
    if (allWeekWorkshops.length > 0) {
      setNextWorkshop(allWeekWorkshops[0])
    }
  }, [])

  // Get stats for the week
  const weekWorkshops = getWorkshopsByWeek(currentWeek)
  const totalEnrolled = weekWorkshops.reduce((sum, w) => sum + w.enrolled, 0)
  const totalCapacity = weekWorkshops.reduce((sum, w) => sum + w.capacity, 0)
  const occupancyRate = Math.round((totalEnrolled / totalCapacity) * 100)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start flex-col justify-center px-6 py-24 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Schedule
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">
            / Week {currentWeek} • {weekWorkshops.length} workshops available
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {/* Left Column - Stats */}
          <div
            className={`flex flex-col gap-6 transition-all duration-700 md:col-span-1 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            {/* Week Stats */}
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-sm">
              <div className="mb-4 inline-block rounded-full bg-foreground/15 px-3 py-1">
                <span className="font-mono text-xs font-semibold text-foreground/70">Statistics</span>
              </div>
              <h3 className="mb-6 font-sans text-2xl font-light text-foreground">Week Overview</h3>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-mono text-xs text-foreground/60 uppercase tracking-wide">Total Workshops</p>
                    <p className="mt-1 font-sans text-3xl font-light text-foreground">{weekWorkshops.length}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-foreground/40" />
                </div>

                <div className="h-px bg-foreground/10" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-mono text-xs text-foreground/60 uppercase tracking-wide">Enrollment</p>
                    <p className="mt-1 font-sans text-3xl font-light text-foreground">{totalEnrolled}</p>
                    <p className="mt-1 font-mono text-xs text-foreground/50">/ {totalCapacity} capacity</p>
                  </div>
                  <Users className="h-6 w-6 text-foreground/40" />
                </div>

                <div className="h-px bg-foreground/10" />

                <div className="flex items-center justify-between rounded-lg bg-foreground/10 px-3 py-2">
                  <span className="font-mono text-sm font-semibold text-foreground">Occupancy</span>
                  <span className="font-sans text-lg font-light text-foreground">{occupancyRate}%</span>
                </div>
              </div>
            </div>

            {/* Next Workshop Highlight */}
            {nextWorkshop && (
              <div className="rounded-2xl border-2 border-foreground/20 bg-gradient-to-br from-foreground/10 to-foreground/5 p-6 backdrop-blur-sm">
                <div className="mb-3 inline-block rounded-full bg-foreground/15 px-3 py-1">
                  <span className="font-mono text-xs font-semibold text-foreground/70">Next Up</span>
                </div>
                <h4 className="mb-4 line-clamp-2 font-sans text-lg font-light text-foreground">{nextWorkshop.title}</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-foreground/60" />
                  <span className="font-mono text-foreground/70">{nextWorkshop.time}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Workshop Timeline */}
          <div
            className={`space-y-3 transition-all duration-700 md:col-span-2 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {weekWorkshops.length > 0 ? (
              <div className="space-y-3">
                {weekWorkshops.map((workshop, index) => {
                  const occupancy = Math.round((workshop.enrolled / workshop.capacity) * 100)
                  const isAlmostFull = occupancy >= 80

                  return (
                    <div
                      key={workshop.id}
                      className="animate-in fade-in-50 slide-in-from-right-4 group relative rounded-xl border border-foreground/10 bg-foreground/5 p-4 transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/10 md:p-5"
                      style={{
                        animationDelay: `${300 + index * 50}ms`,
                      }}
                    >
                      {/* Timeline Connector */}
                      {index < weekWorkshops.length - 1 && (
                        <div className="absolute -bottom-3 left-6 h-3 w-px bg-gradient-to-b from-foreground/30 to-foreground/5" />
                      )}

                      <div className="flex items-start gap-4">
                        {/* Time Badge */}
                        <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-foreground/15 bg-foreground/15">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {workshop.time.split(":")[0]}
                            <span className="block text-[10px] text-foreground/60">00</span>
                          </span>
                        </div>

                        {/* Workshop Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 font-sans text-base font-light text-foreground md:text-lg">
                            {workshop.title}
                          </h4>
                          <p className="mb-3 line-clamp-1 font-mono text-xs text-foreground/60">
                            with {workshop.instructor}
                          </p>

                          {/* Tags and Enrollment */}
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex gap-1.5">
                              {workshop.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-foreground/15 px-2 py-0.5 font-mono text-xs text-foreground/70"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="ml-auto flex items-center gap-2">
                              <div
                                className={`flex h-5 items-center gap-1 rounded-full px-2 ${
                                  isAlmostFull ? "bg-orange-500/20" : "bg-green-500/20"
                                }`}
                              >
                                <div
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    isAlmostFull ? "bg-orange-400" : "bg-green-400"
                                  }`}
                                />
                                <span className="font-mono text-xs text-foreground/70">{occupancy}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-foreground/10 bg-foreground/5 py-12">
                <p className="font-sans text-lg text-foreground/60">No workshops scheduled this week</p>
                <p className="font-mono text-sm text-foreground/40">Check back next Monday for the upcoming schedule</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
