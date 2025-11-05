"use client"

import { useReveal } from "@/hooks/use-reveal"
import { WorkshopCard } from "@/components/workshop-card"
import { getUpcomingWorkshops, getCurrentWeek } from "@/lib/workshop-utils"
import { useState, useEffect } from "react"

export function WorkshopSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [workshops, setWorkshops] = useState<any[]>([])
  const [currentWeek, setCurrentWeek] = useState(1)

  useEffect(() => {
    setCurrentWeek(getCurrentWeek())
    setWorkshops(getUpcomingWorkshops())
  }, [])

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
          <h2 className="mb-2 font-sans text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl">
            This Week's Workshops
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">
            / Week {currentWeek} • {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Workshop Grid */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {workshops.map((workshop, index) => (
            <div
              key={workshop.id}
              className={`transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{
                transitionDelay: `${(index + 1) * 100}ms`,
              }}
            >
              <WorkshopCard workshop={workshop} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {workshops.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-foreground/10 bg-foreground/5 py-12">
            <p className="font-sans text-lg tracking-tight text-foreground/60">No workshops this week</p>
            <p className="font-mono text-sm tracking-tight text-foreground/40">Check back next Monday for the upcoming schedule</p>
          </div>
        )}
      </div>
    </section>
  )
}
