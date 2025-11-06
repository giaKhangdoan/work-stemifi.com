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
            colorA="#1800AD"
            colorB="#00C8FF"
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
            baseColor="#1800AD"
            upColor="#00FFE8"
            downColor="#333333"
            leftColor="#00C8FF"
            rightColor="#00FFE8"
            intensity={0.9}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Background Images Layer - Floating Micro:bit and Robot Images */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Image 1 - Top Left */}
        <div className="absolute -top-20 -left-20 w-80 h-80 md:w-[400px] md:h-[400px] opacity-[0.28] animate-bg-float" style={{ animationDelay: '0s', animationDuration: '25s', zIndex: 2 }}>
          <img 
            src="/microbit-1.png" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'blur(1.5px)' }}
          />
        </div>

        {/* Image 2 - Top Right */}
        <div className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 opacity-[0.25] animate-bg-float" style={{ animationDelay: '4s', animationDuration: '30s', zIndex: 2 }}>
          <img 
            src="/microbit-2.png" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'blur(2px)' }}
          />
        </div>

        {/* Image 3 - Middle Left */}
        <div className="absolute top-1/3 -left-16 w-72 h-72 md:w-[360px] md:h-[360px] opacity-[0.26] animate-bg-float" style={{ animationDelay: '8s', animationDuration: '28s', zIndex: 2 }}>
          <img 
            src="/microbit-3.png" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'blur(1.8px)' }}
          />
        </div>

        {/* Image 4 - Bottom Right */}
        <div className="absolute bottom-20 -right-20 w-68 h-68 md:w-88 md:h-88 opacity-[0.24] animate-bg-float" style={{ animationDelay: '12s', animationDuration: '32s', zIndex: 2 }}>
          <img 
            src="/microbit-4.png" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'blur(2px)' }}
          />
        </div>

        {/* Image 5 - Bottom Left */}
        <div className="absolute bottom-10 left-10 w-76 h-76 md:w-[380px] md:h-[380px] opacity-[0.27] animate-bg-float" style={{ animationDelay: '16s', animationDuration: '26s', zIndex: 2 }}>
          <img 
            src="/microbit-5.png" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'blur(1.5px)' }}
          />
        </div>

        {/* Image 6 - Center Right (Banner style) */}
        <div className="absolute top-1/2 right-1/4 w-88 h-88 md:w-[420px] md:h-[420px] opacity-[0.22] animate-bg-float" style={{ animationDelay: '20s', animationDuration: '35s', zIndex: 2 }}>
          <img 
            src="/microbit-banner.png" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'blur(2.5px)' }}
          />
        </div>

        {/* Image 7 - Scratch Rectangle Drawing - Full Screen, Diagonal, Behind */}
        <div className="absolute -top-40 -right-40 w-screen h-screen md:w-[150vw] md:h-[150vh] opacity-[0.25] animate-bg-float" style={{ animationDelay: '18s', animationDuration: '27s', transform: 'rotate(-15deg)', zIndex: 0 }}>
          <img 
            src="/scratch-rectangle.png" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'blur(2px)' }}
          />
        </div>

        {/* Image 8 - Scratch N Letter - Full Screen, Diagonal, Behind */}
        <div className="absolute -bottom-40 -left-40 w-screen h-screen md:w-[140vw] md:h-[140vh] opacity-[0.22] animate-bg-float" style={{ animationDelay: '22s', animationDuration: '29s', transform: 'rotate(20deg)', zIndex: 0 }}>
          <img 
            src="/scratch-n.png" 
            alt="" 
            className="w-full h-full object-contain"
            style={{ filter: 'blur(2.2px)' }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-foreground/10 px-4 py-4 md:px-12 md:py-6">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
            <span className="font-sans text-lg font-medium text-white">Quay lại</span>
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
      <div className="relative z-10 px-4 py-8 md:px-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 md:mb-12">
            <h1 className="mb-3 font-sans text-3xl font-semibold text-white md:text-5xl lg:text-6xl md:mb-4">
              Tất cả Workshop
            </h1>
            <p className="text-lg text-white">
              Xem lại các workshop đã diễn ra và workshop hiện tại
            </p>
          </div>

          {/* Current Workshops */}
          {currentWorkshops.length > 0 && (
            <div className="mb-10 md:mb-16">
              <div className="mb-4 flex items-center gap-2 md:mb-6 md:gap-3">
                <div className="flex h-3 w-3 rounded-full bg-green-400"></div>
                <h2 className="font-sans text-2xl font-semibold text-white md:text-3xl">
                  Workshop Hiện Tại
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {currentWorkshops.map((workshop) => {
                  const saturday = getSaturdayByWeek(workshop.week)
                  return (
                    <div
                      key={workshop.id}
                      onClick={() => openModal(workshop)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-4 md:p-6 transition-all duration-300 hover:border-[#56C4C3]/30 hover:bg-foreground/8 hover:shadow-lg hover:shadow-[#56C4C3]/10 hover:-translate-y-1"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-2 rounded-full bg-green-400/20 px-3 py-1">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span className="font-mono text-xs font-medium text-green-400">Đang diễn ra</span>
                        </div>
                      </div>

                      <h3 className="mb-2 font-sans text-2xl font-medium text-white">{workshop.title}</h3>
                      <p className="mb-4 text-sm leading-relaxed text-white">{workshop.description}</p>

                      <div className="space-y-3 border-t border-foreground/10 pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-white" />
                          <span className="font-sans text-sm text-white">
                            {formatDate(saturday)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-white" />
                          <span className="font-sans text-sm text-white">{workshop.time}</span>
                        </div>

                        {workshop.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-white" />
                            <span className="font-sans text-sm text-white">{workshop.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {workshop.tags && workshop.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {workshop.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-foreground/8 px-2.5 py-1 font-sans text-[11px] font-medium uppercase tracking-widest text-white"
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
            <div className="mb-4 flex items-center gap-2 md:mb-6 md:gap-3">
              <div className="flex h-3 w-3 rounded-full bg-foreground/40"></div>
              <h2 className="font-sans text-xl font-semibold text-white md:text-3xl">
                Workshop Đã Diễn Ra
              </h2>
            </div>

            {pastWorkshops.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {pastWorkshops.map((workshop) => {
                  const saturday = getSaturdayByWeek(workshop.week)
                  return (
                    <div
                      key={workshop.id}
                      onClick={() => openModal(workshop)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-4 md:p-6 transition-all duration-300 hover:border-[#56C4C3]/30 hover:bg-foreground/8 hover:shadow-lg hover:shadow-[#56C4C3]/10 hover:-translate-y-1"
                    >
                      <h3 className="mb-2 font-sans text-2xl font-semibold text-white">{workshop.title}</h3>
                      <p className="mb-4 text-sm leading-relaxed text-white">{workshop.description}</p>

                      <div className="space-y-3 border-t border-foreground/10 pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-white" />
                          <span className="font-mono text-sm text-white">
                            {formatDate(saturday)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-white" />
                          <span className="font-mono text-sm text-white">{workshop.time}</span>
                        </div>

                        {workshop.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-white" />
                            <span className="font-mono text-sm text-white">{workshop.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {workshop.tags && workshop.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {workshop.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-foreground/8 px-3 py-1 font-mono text-xs text-white"
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
                <p className="font-sans text-lg text-white">Chưa có workshop nào đã diễn ra</p>
                <p className="font-mono text-sm text-white">Các workshop sẽ xuất hiện ở đây sau khi diễn ra</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workshop Detail Modal */}
      {isModalOpen && selectedWorkshop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] scrollbar-thin scrollbar-thumb-foreground/20 scrollbar-track-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 md:right-4 md:top-4 z-20 rounded-full bg-black/30 backdrop-blur-md p-2 transition-all hover:bg-black/50 hover:scale-110"
            >
              <X className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </button>

            {/* Banner */}
            {selectedWorkshop.banner && (
              <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-t-2xl md:rounded-t-3xl">
                <img
                  src={selectedWorkshop.banner}
                  alt={selectedWorkshop.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              </div>
            )}

            {/* Content */}
            <div className="p-4 md:p-6 lg:p-8">
              {/* Header */}
              <div className="mb-5 md:mb-6">
                <h2 className="mb-3 font-sans text-2xl md:text-4xl lg:text-5xl font-semibold text-black leading-tight">
                  {selectedWorkshop.title}
                </h2>
                <p className="text-sm md:text-base lg:text-lg leading-relaxed text-black/80">
                  {selectedWorkshop.description}
                </p>
              </div>

              {/* Info Grid */}
              <div className="mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/8 p-3 md:p-4 hover:bg-foreground/12 transition-colors">
                  <Calendar className="h-5 w-5 shrink-0 text-[#00C8FF] mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 font-mono text-xs text-black/60">Ngày</p>
                    <p className="font-medium text-black text-sm md:text-base">
                      {formatDate(getSaturdayByWeek(selectedWorkshop.week))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/8 p-3 md:p-4 hover:bg-foreground/12 transition-colors">
                  <Clock className="h-5 w-5 shrink-0 text-[#00C8FF] mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 font-mono text-xs text-black/60">Thời gian</p>
                    <p className="font-medium text-black text-sm md:text-base">{selectedWorkshop.time}</p>
                  </div>
                </div>

                {selectedWorkshop.location && (
                  <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/8 p-3 md:p-4 hover:bg-foreground/12 transition-colors">
                    <MapPin className="h-5 w-5 shrink-0 text-[#00C8FF] mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 font-mono text-xs text-black/60">Địa điểm</p>
                      <p className="font-medium text-black text-sm md:text-base">{selectedWorkshop.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/8 p-3 md:p-4 hover:bg-foreground/12 transition-colors">
                  <div className="h-5 w-5 shrink-0 text-[#00C8FF] mt-0.5 flex items-center justify-center rounded-full bg-[#00C8FF]/20">
                    <span className="text-xs font-semibold text-[#00C8FF]">Lv</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 font-mono text-xs text-black/60">Cấp độ</p>
                    <p className="font-medium text-black text-sm md:text-base">{selectedWorkshop.level}</p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              {selectedWorkshop.schedule && selectedWorkshop.schedule.length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h3 className="mb-4 font-sans text-xl md:text-2xl font-semibold text-black">
                    Nội dung Workshop
                  </h3>
                  <div className="space-y-4 md:space-y-6 rounded-2xl md:rounded-3xl border border-foreground/10 bg-foreground/25 backdrop-blur-xl p-5 md:p-8 lg:p-12">
                    {selectedWorkshop.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="group flex items-start gap-4 md:gap-6 transition-all duration-300 hover:translate-x-1 md:hover:translate-x-2"
                      >
                        {/* Bullet Point with Glow Effect */}
                        <div className="relative flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center">
                          <div className="absolute h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#00FFE8]/30 blur-md group-hover:bg-[#00FFE8]/50 transition-all duration-300" />
                          <div className="relative flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#00FFE8] to-[#00C8FF] shadow-lg shadow-[#00FFE8]/30">
                            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-white/90" />
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 pt-0.5 md:pt-1">
                          <div className="mb-2 flex items-baseline gap-2 md:gap-3">
                            <p className="font-mono text-sm md:text-base lg:text-lg font-medium text-black">{item.time}</p>
                            <div className="h-px flex-1 bg-gradient-to-r from-foreground/20 to-transparent" />
                          </div>
                          <p className="text-sm md:text-base lg:text-lg leading-relaxed text-black/90">{item.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why Join */}
              {selectedWorkshop.whyJoin && selectedWorkshop.whyJoin.length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h3 className="mb-4 font-sans text-xl md:text-2xl font-semibold text-black">
                    Vì sao nên tham gia?
                  </h3>
                  <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                    {selectedWorkshop.whyJoin.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-foreground/10 bg-foreground/8 p-4 md:p-5 backdrop-blur-xl hover:bg-foreground/12 transition-colors"
                      >
                        <h4 className="mb-2 font-sans text-base md:text-lg font-semibold text-black">
                          {item.title}
                        </h4>
                        <p className="text-sm md:text-base text-black/80 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedWorkshop.tags && selectedWorkshop.tags.length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h3 className="mb-3 font-sans text-lg md:text-xl font-semibold text-black">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkshop.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-foreground/20 bg-foreground/10 px-3 py-1.5 md:px-4 md:py-2 font-mono text-xs md:text-sm font-semibold text-black/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="rounded-xl md:rounded-2xl border border-foreground/20 bg-foreground/10 p-4 md:p-6 backdrop-blur-xl">
                <h3 className="mb-4 font-sans text-lg md:text-xl font-semibold text-black">Liên hệ</h3>
                <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <a
                    href="tel:0906856025"
                    className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/8 p-3 md:p-4 transition-all hover:border-[#00C8FF]/30 hover:bg-foreground/12"
                  >
                    <Phone className="h-5 w-5 shrink-0 text-[#00C8FF]" />
                    <div className="min-w-0">
                      <p className="text-xs text-black/60">Hotline</p>
                      <p className="font-medium text-black text-sm md:text-base">0906 856 025</p>
                    </div>
                  </a>
                  <a
                    href="mailto:workshop@stemifi.com"
                    className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/8 p-3 md:p-4 transition-all hover:border-[#00C8FF]/30 hover:bg-foreground/12"
                  >
                    <Mail className="h-5 w-5 shrink-0 text-[#00C8FF]" />
                    <div className="min-w-0">
                      <p className="text-xs text-black/60">Email</p>
                      <p className="font-medium text-black text-sm md:text-base break-all">workshop@stemifi.com</p>
                    </div>
                  </a>
                  <a
                    href="https://stemifi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/8 p-3 md:p-4 transition-all hover:border-[#00C8FF]/30 hover:bg-foreground/12 sm:col-span-2 lg:col-span-1"
                  >
                    <Globe className="h-5 w-5 shrink-0 text-[#00C8FF]" />
                    <div className="min-w-0">
                      <p className="text-xs text-black/60">Website</p>
                      <p className="font-medium text-black text-sm md:text-base">stemifi.com</p>
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

