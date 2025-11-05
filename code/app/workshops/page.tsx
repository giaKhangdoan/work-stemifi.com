"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { useRef, useEffect, useState } from "react"
import { Clock, Calendar, MapPin, ArrowLeft, CheckCircle, X, Phone, Mail, Globe } from "lucide-react"
import {
  getPastWorkshops,
  getCurrentWorkshops,
  getSaturdayByWeek,
  formatDate,
  type Workshop,
} from "@/lib/workshop-utils"
import Link from "next/link"
import { MagneticButton } from "@/components/magnetic-button"

export default function WorkshopsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [pastWorkshops, setPastWorkshops] = useState<Workshop[]>([])
  const [currentWorkshops, setCurrentWorkshops] = useState<Workshop[]>([])
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const shaderContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    setPastWorkshops(getPastWorkshops())
    setCurrentWorkshops(getCurrentWorkshops())
  }, [])

  const openModal = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedWorkshop(null)
    document.body.style.overflow = "unset"
  }

  useEffect(() => {
    if (isModalOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeModal()
        }
      }
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isModalOpen])

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#375AA9"
            colorB="#279595"
            speed={0.8}
            detail={0.8}
            blend={50}
            coarseX={40}
            coarseY={40}
            mediumX={40}
            mediumY={40}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#375AA9"
            upColor="#56C4C3"
            downColor="#333333"
            leftColor="#279595"
            rightColor="#56C4C3"
            intensity={0.9}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-foreground/10 px-6 py-6 md:px-12">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 text-foreground/80" />
            <span className="font-sans text-lg font-semibold text-foreground">Quay lại</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="transition-transform hover:scale-105" prefetch>
              <img
                src="/stemifi-logo.png"
                alt="STEMIFI MAKERS"
                className="h-16 w-auto object-contain md:h-20"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-12">
            <h1 className="mb-4 font-sans text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Tất cả Workshop
            </h1>
            <p className="text-lg text-foreground/80">
              Xem lại các workshop đã diễn ra và workshop hiện tại
            </p>
          </div>

          {/* Current Workshops */}
          {currentWorkshops.length > 0 && (
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-3 w-3 rounded-full bg-green-400"></div>
                <h2 className="font-sans text-2xl font-bold text-foreground md:text-3xl">
                  Workshop Hiện Tại
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentWorkshops.map((workshop) => {
                  const saturday = getSaturdayByWeek(workshop.week)
                  return (
                    <div
                      key={workshop.id}
                      onClick={() => openModal(workshop)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#56C4C3]/30 hover:bg-foreground/10 hover:shadow-lg hover:shadow-[#56C4C3]/10 hover:-translate-y-1"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-2 rounded-full bg-green-400/20 px-3 py-1">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span className="font-mono text-xs font-semibold text-green-400">Đang diễn ra</span>
                        </div>
                      </div>

                      <h3 className="mb-2 font-sans text-2xl font-semibold text-foreground">{workshop.title}</h3>
                      <p className="mb-4 text-sm leading-relaxed text-foreground/80">{workshop.description}</p>

                      <div className="space-y-3 border-t border-foreground/10 pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-foreground/60" />
                          <span className="font-sans text-sm text-foreground/80">
                            {formatDate(saturday)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-foreground/60" />
                          <span className="font-sans text-sm text-foreground/80">{workshop.time}</span>
                        </div>

                        {workshop.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-foreground/60" />
                            <span className="font-sans text-sm text-foreground/80">{workshop.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {workshop.tags && workshop.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {workshop.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-foreground/10 px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-widest text-foreground/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Past Workshops */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-3 w-3 rounded-full bg-foreground/40"></div>
              <h2 className="font-sans text-2xl font-bold text-foreground md:text-3xl">
                Workshop Đã Diễn Ra
              </h2>
            </div>

            {pastWorkshops.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastWorkshops.map((workshop) => {
                  const saturday = getSaturdayByWeek(workshop.week)
                  return (
                    <div
                      key={workshop.id}
                      onClick={() => openModal(workshop)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#56C4C3]/30 hover:bg-foreground/10 hover:shadow-lg hover:shadow-[#56C4C3]/10 hover:-translate-y-1"
                    >
                      <h3 className="mb-2 font-sans text-2xl font-bold text-foreground">{workshop.title}</h3>
                      <p className="mb-4 text-sm leading-relaxed text-foreground/70">{workshop.description}</p>

                      <div className="space-y-3 border-t border-foreground/10 pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-foreground/60" />
                          <span className="font-mono text-sm text-foreground/80">
                            {formatDate(saturday)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-foreground/60" />
                          <span className="font-mono text-sm text-foreground/80">{workshop.time}</span>
                        </div>

                        {workshop.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-foreground/60" />
                            <span className="font-mono text-sm text-foreground/80">{workshop.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {workshop.tags && workshop.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {workshop.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-foreground/10 px-3 py-1 font-mono text-xs text-foreground/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 py-12">
                <p className="font-sans text-lg text-foreground/60">Chưa có workshop nào đã diễn ra</p>
                <p className="font-mono text-sm text-foreground/40">Các workshop sẽ xuất hiện ở đây sau khi diễn ra</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workshop Detail Modal */}
      {isModalOpen && selectedWorkshop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-foreground/20 bg-foreground/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-20 rounded-full bg-foreground/10 p-2 transition-all hover:bg-foreground/20 hover:scale-110"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>

            {/* Banner */}
            {selectedWorkshop.banner && (
              <div className="relative h-64 w-full overflow-hidden rounded-t-3xl">
                <img
                  src={selectedWorkshop.banner}
                  alt={selectedWorkshop.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8 lg:p-10">
              {/* Header */}
              <div className="mb-6">
                <h2 className="mb-3 font-sans text-4xl font-bold text-foreground md:text-5xl">
                  {selectedWorkshop.title}
                </h2>
                <p className="text-lg leading-relaxed text-foreground/90">
                  {selectedWorkshop.description}
                </p>
              </div>

              {/* Info Grid */}
              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4">
                  <Calendar className="h-5 w-5 shrink-0 text-[#56C4C3] mt-0.5" />
                  <div>
                    <p className="mb-1 font-mono text-xs text-foreground/60">Ngày</p>
                    <p className="font-semibold text-foreground">
                      {formatDate(getSaturdayByWeek(selectedWorkshop.week))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4">
                  <Clock className="h-5 w-5 shrink-0 text-[#56C4C3] mt-0.5" />
                  <div>
                    <p className="mb-1 font-mono text-xs text-foreground/60">Thời gian</p>
                    <p className="font-semibold text-foreground">{selectedWorkshop.time}</p>
                  </div>
                </div>

                {selectedWorkshop.location && (
                  <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4">
                    <MapPin className="h-5 w-5 shrink-0 text-[#56C4C3] mt-0.5" />
                    <div>
                      <p className="mb-1 font-mono text-xs text-foreground/60">Địa điểm</p>
                      <p className="font-semibold text-foreground">{selectedWorkshop.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4">
                  <div className="h-5 w-5 shrink-0 text-[#56C4C3] mt-0.5 flex items-center justify-center">
                    <span className="text-xs font-bold">Lv</span>
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-xs text-foreground/60">Cấp độ</p>
                    <p className="font-semibold text-foreground">{selectedWorkshop.level}</p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              {selectedWorkshop.schedule && selectedWorkshop.schedule.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 font-sans text-2xl font-bold text-foreground">
                    Nội dung Workshop
                  </h3>
                  <div className="space-y-4 rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
                    {selectedWorkshop.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-xl border border-foreground/10 bg-foreground/5 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#56C4C3] to-[#279595] shadow-lg shadow-[#56C4C3]/30">
                          <span className="font-mono text-sm font-bold text-white">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-baseline gap-3">
                            <p className="font-mono font-bold text-[#56C4C3]">{item.time}</p>
                            <div className="h-px flex-1 bg-gradient-to-r from-foreground/20 to-transparent" />
                          </div>
                          <p className="text-foreground/90">{item.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why Join */}
              {selectedWorkshop.whyJoin && selectedWorkshop.whyJoin.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 font-sans text-2xl font-bold text-foreground">
                    Vì sao nên tham gia?
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedWorkshop.whyJoin.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-foreground/10 bg-foreground/5 p-5 backdrop-blur-xl"
                      >
                        <h4 className="mb-2 font-sans text-lg font-bold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-foreground/80">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedWorkshop.tags && selectedWorkshop.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-3 font-sans text-xl font-bold text-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkshop.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#56C4C3]/20 px-4 py-2 font-mono text-sm font-semibold text-[#56C4C3]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="rounded-2xl border border-foreground/20 bg-foreground/10 p-6 backdrop-blur-xl">
                <h3 className="mb-4 font-sans text-xl font-bold text-foreground">Liên hệ</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <a
                    href="tel:0906856025"
                    className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4 transition-all hover:border-[#56C4C3]/30 hover:bg-foreground/10"
                  >
                    <Phone className="h-5 w-5 text-[#56C4C3]" />
                    <div>
                      <p className="text-xs text-foreground/60">Hotline</p>
                      <p className="font-semibold text-foreground">0906 856 025</p>
                    </div>
                  </a>
                  <a
                    href="mailto:workshop@stemifi.com"
                    className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4 transition-all hover:border-[#56C4C3]/30 hover:bg-foreground/10"
                  >
                    <Mail className="h-5 w-5 text-[#56C4C3]" />
                    <div>
                      <p className="text-xs text-foreground/60">Email</p>
                      <p className="font-semibold text-foreground">workshop@stemifi.com</p>
                    </div>
                  </a>
                  <a
                    href="https://stemifi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4 transition-all hover:border-[#56C4C3]/30 hover:bg-foreground/10"
                  >
                    <Globe className="h-5 w-5 text-[#56C4C3]" />
                    <div>
                      <p className="text-xs text-foreground/60">Website</p>
                      <p className="font-semibold text-foreground">stemifi.com</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

