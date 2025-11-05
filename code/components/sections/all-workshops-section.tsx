"use client"

import { useReveal } from "@/hooks/use-reveal"
import { WorkshopCardEnhanced } from "@/components/workshop-card-enhanced"
import { workshops, getAllWeeks } from "@/lib/workshop-utils"
import { useState, useMemo } from "react"
import { ChevronDown, Search, Filter } from "lucide-react"

export function AllWorkshopsSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const allWeeks = getAllWeeks()

  const toggleWeek = (week: number) => {
    setExpandedWeeks((prev) => (prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week]))
  }

  // Get all unique levels and tags for filters
  const allLevels = useMemo(() => [...new Set(workshops.map((w) => w.level))].sort(), [])
  const allTags = useMemo(() => [...new Set(workshops.flatMap((w) => w.tags))].sort(), [])

  // Filter workshops based on search and filters
  const filteredWorkshops = useMemo(() => {
    return workshops.filter((w) => {
      const matchesSearch =
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLevel = !selectedLevel || w.level === selectedLevel
      const matchesTag = !selectedTag || w.tags.includes(selectedTag)

      return matchesSearch && matchesLevel && matchesTag
    })
  }, [searchQuery, selectedLevel, selectedTag])

  return (
    <section
      ref={ref}
      className="flex h-auto w-screen shrink-0 snap-start flex-col justify-start px-6 py-24 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl">
            All Workshops
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">
            / Complete schedule and archives • {filteredWorkshops.length} workshop
            {filteredWorkshops.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search and Filters */}
        <div
          className={`mb-12 space-y-4 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search workshops by title, instructor, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-foreground/10 bg-foreground/5 py-3 pl-10 pr-4 font-mono text-sm text-foreground placeholder-foreground/40 transition-all duration-200 focus:border-foreground/30 focus:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-3">
            {/* Level Filter */}
            <div className="relative inline-block">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-2 pr-10 font-mono text-sm text-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-foreground/10 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10"
              >
                <option value="">All Levels</option>
                {allLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            </div>

            {/* Tag Filter */}
            <div className="relative inline-block">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="appearance-none rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-2 pr-10 font-mono text-sm text-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-foreground/10 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10"
              >
                <option value="">All Topics</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedLevel || selectedTag) && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedLevel("")
                  setSelectedTag("")
                }}
                className="rounded-lg border border-foreground/20 bg-foreground/10 px-4 py-2 font-mono text-sm text-foreground/80 transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/15"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Weeks Accordion */}
        <div className="space-y-4">
          {allWeeks.map((week, weekIndex) => {
            const weekWorkshops = filteredWorkshops.filter((w) => w.week === week)

            return (
              <div
                key={week}
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{
                  transitionDelay: `${200 + weekIndex * 100}ms`,
                }}
              >
                {/* Week Header */}
                <button onClick={() => toggleWeek(week)} className="group w-full">
                  <div className="flex items-center justify-between rounded-xl border-2 border-foreground/10 bg-foreground/5 px-6 py-4 transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/10">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15">
                        <span className="font-mono font-semibold text-foreground/80">W{week}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-sans font-medium tracking-tight text-foreground">Week {week}</p>
                        <p className="font-mono text-xs text-foreground/50">
                          {weekWorkshops.length} workshop{weekWorkshops.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-foreground/60 transition-transform duration-300 ${
                        expandedWeeks.includes(week) ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Week Workshops */}
                {expandedWeeks.includes(week) && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {weekWorkshops.length > 0 ? (
                      weekWorkshops.map((workshop, index) => (
                        <div
                          key={workshop.id}
                          className="animate-in fade-in-50 slide-in-from-top-4 duration-300"
                          style={{
                            animationDelay: `${index * 50}ms`,
                          }}
                        >
                          <WorkshopCardEnhanced workshop={workshop} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-lg border border-foreground/10 bg-foreground/5 py-8">
                        <p className="font-sans tracking-tight text-foreground/60">No workshops match your filters</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredWorkshops.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-foreground/10 bg-foreground/5 py-12">
            <p className="font-sans text-lg tracking-tight text-foreground/60">No workshops found</p>
            <p className="font-mono text-sm tracking-tight text-foreground/40">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </section>
  )
}
