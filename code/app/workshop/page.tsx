"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import { Clock, MapPin, Phone, Mail, Globe, QrCode } from "lucide-react"
import {
  getCurrentWeek,
  getUpcomingWorkshops,
  type Workshop,
} from "@/lib/workshop-utils"
import {
  getContactInfo,
  getMapInfo,
} from "@/lib/contact-utils"

export default function WorkshopPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop | null>(null)
  
  // Lấy thông tin liên hệ từ JSON
  const contactInfo = getContactInfo()
  const mapInfo = getMapInfo()

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
    // Lấy workshop của tuần hiện tại
    const workshops = getUpcomingWorkshops()
    if (workshops.length > 0) {
      setCurrentWorkshop(workshops[0])
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

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

      {/* Header Navigation */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex flex-col items-center gap-3 px-6 py-4 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Logo centered */}
        <button onClick={() => scrollToSection("hero")} className="transition-transform hover:scale-105">
          <img src="/stemifi-logo.png" alt="STEMIFI MAKERS" className="h-18 w-auto object-contain md:h-24" />
        </button>

        {/* Menu under logo */}
        <div className="flex items-center gap-6 rounded-full bg-black/10 px-4 py-2 backdrop-blur md:gap-8">
          {[
            { label: "Giới thiệu", id: "about" },
            { label: "Nội dung", id: "content" },
            { label: "Tất cả Workshop", id: "/workshops", type: "link" },
          ].map((item) => {
            if ((item as any).type === "link") {
              return (
                <a key={(item as any).id} href={(item as any).id} className="group relative font-sans text-sm font-semibold text-[#56C4C3] transition-colors hover:text-[#375AA9] md:text-base">
                  {(item as any).label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#56C4C3] transition-all duration-300 group-hover:w-full" />
                </a>
              )
            }
            return (
              <button
                key={(item as any).id}
                onClick={() => scrollToSection((item as any).id)}
                className="group relative font-sans text-sm font-semibold text-[#56C4C3] transition-colors hover:text-[#375AA9] md:text-base"
              >
                {(item as any).label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#56C4C3] transition-all duration-300 group-hover:w-full" />
              </button>
            )
          })}

          <button
            onClick={() => scrollToSection("register")}
            className="relative rounded-full bg-gradient-to-r from-[#56C4C3] to-[#375AA9] px-4 py-2 font-sans text-sm font-bold text-white shadow-[0_8px_24px_rgba(55,90,169,0.35)] outline-none transition-all hover:brightness-110 focus-visible:ring-4 focus-visible:ring-[#56C4C3]/40 md:px-6 md:text-base"
          >
            Đăng ký
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/10" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section - Workshop Details */}
        <section
          id="hero"
          className="flex min-h-screen w-full items-center px-6 pt-20 pb-12 md:px-12 md:pt-24 md:pb-16"
        >
          <div className="mx-auto w-full max-w-7xl">
            {/* Banner - Hiển thị ở trên cùng nếu có */}
            {currentWorkshop?.banner && (
              <div className="mb-8 md:mb-12 flex justify-center">
                <div 
                  className="relative overflow-hidden rounded-3xl border border-foreground/20 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_30px_rgba(86,196,195,0.2)] animate-wander"
                  style={{
                    maxWidth: "90%",
                    borderRadius: "1.5rem"
                  }}
                >
                  <img
                    src={currentWorkshop.banner}
                    alt={currentWorkshop.title}
                    className="w-full object-cover"
                    style={{ 
                      maxHeight: "400px", 
                      objectFit: "contain",
                      borderRadius: "1.5rem"
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="grid gap-6 md:grid-cols-2 md:gap-12 lg:gap-16">
              {/* Left Column - Workshop Details */}
              <div className="flex flex-col justify-center">
                <div className="mb-3">
                  <h1 className="mb-3 font-sans text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl lg:text-7xl leading-tight" style={{ paddingTop: '0.2em', paddingBottom: '0.2em' }}>
                    WORKSHOP 1
                  </h1>
                  <p className="mb-6 text-lg leading-relaxed text-foreground/90">
                    Chương trình học tập trải nghiệm – thực hành trực tiếp
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-foreground/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-mono text-sm text-foreground/60 mb-1">Lịch:</p>
                      <p className="text-foreground">Thứ Bảy hoặc Chủ Nhật hàng tuần</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-foreground/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-mono text-sm text-foreground/60 mb-1">Thời gian:</p>
                      <p className="text-foreground font-bold text-yellow-400">8:00 – 11:15 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-foreground/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-mono text-sm text-foreground/60 mb-1">Địa điểm:</p>
                      <p className="text-foreground">STEMIFI Lab (hoặc cập nhật theo tuần)</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection("register")}>
                    Đăng ký ngay
                  </MagneticButton>
                  <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection("content")}>
                    Xem nội dung
                  </MagneticButton>
                </div>
              </div>

              {/* Right Column - Quick Info Card */}
              <div className="flex flex-col justify-center">
                <div className="rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-6 md:p-8">
                  <h3 className="mb-5 font-sans text-xl font-bold text-foreground md:text-2xl">Thông tin nhanh</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4">
                      <Phone className="h-6 w-6 text-[#56C4C3] flex-shrink-0" />
                      <div>
                        <p className="font-sans text-sm font-semibold text-foreground/90 mb-1">Hotline</p>
                        <a href={`tel:${contactInfo.hotline}`} className="text-base font-medium text-[#56C4C3] hover:text-[#375AA9] transition-colors">
                          {contactInfo.hotlineDisplay}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Mail className="h-6 w-6 text-[#56C4C3] flex-shrink-0" />
                      <div>
                        <p className="font-sans text-sm font-semibold text-foreground/90 mb-1">Email</p>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-base font-medium text-[#56C4C3] hover:text-[#375AA9] transition-colors"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Globe className="h-6 w-6 text-[#56C4C3] flex-shrink-0" />
                      <div>
                        <p className="font-sans text-sm font-semibold text-foreground/90 mb-1">Website</p>
                        <a
                          href="https://stemifi.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-medium text-[#56C4C3] hover:text-[#375AA9] transition-colors"
                        >
                          stemifi.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="mb-4 flex flex-col items-center">
                    <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-foreground/30 bg-foreground/5">
                      <QrCode className="h-16 w-16 text-foreground/40" />
                    </div>
                    <p className="text-center font-sans text-sm font-semibold text-foreground/90">QR đăng ký</p>
                    <p className="mt-2 text-center text-base text-foreground/90">Quét QR để mở form đăng ký.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Participate Section */}
        <section id="about" className="flex min-h-screen w-full items-center px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto w-full max-w-7xl">
            <h2 className="mb-10 text-center font-sans text-4xl font-bold text-foreground md:text-5xl lg:text-6xl leading-tight" style={{ paddingTop: '0.15em', paddingBottom: '0.15em' }}>
              Vì sao nên tham gia?
            </h2>

            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              {(() => {
                // Kiểm tra dữ liệu
                if (!currentWorkshop) {
                  return (
                    <div className="col-span-2 flex flex-col items-center justify-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 py-12">
                      <p className="font-sans text-lg text-foreground/60">Đang tải thông tin...</p>
                    </div>
                  )
                }
                
                const whyJoinData = currentWorkshop.whyJoin
                if (!whyJoinData || whyJoinData.length === 0) {
                  return (
                    <div className="col-span-2 flex flex-col items-center justify-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 py-12">
                      <p className="font-sans text-lg text-foreground/60">Chưa có thông tin về lý do tham gia.</p>
                    </div>
                  )
                }
                
                return whyJoinData.map((item, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-8 md:p-10 transition-all duration-300 hover:border-[#56C4C3]/30 hover:bg-foreground/10 hover:shadow-lg hover:shadow-[#56C4C3]/10"
                  >
                    {/* Decorative gradient accent */}
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#56C4C3]/20 to-[#279595]/20 blur-3xl transition-all duration-500 group-hover:scale-150" />
                    
                    <div className="relative z-10">
                      <h3 className="mb-4 font-sans text-xl font-bold text-foreground md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="text-base leading-relaxed text-foreground/90 md:text-lg">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              })()}
            </div>
          </div>
        </section>

        {/* Workshop Content Section */}
        <section id="content" className="flex min-h-screen w-full items-center px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="mb-10 text-center font-sans text-3xl font-bold text-foreground md:text-4xl lg:text-5xl leading-tight" style={{ paddingTop: '0.15em', paddingBottom: '0.15em' }}>
              Nội dung Workshop 1
            </h2>

            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-8 md:p-12 lg:p-16">
              <div className="space-y-6 md:space-y-8">
                {[
                  { time: "08:00", activity: "Check-in & khởi động" },
                  { time: "08:15", activity: "Giới thiệu chủ đề & mục tiêu" },
                  { time: "08:40", activity: "Thực hành có hướng dẫn" },
                  { time: "10:10", activity: "Nâng cao & mở rộng" },
                  { time: "11:00", activity: "Tổng kết & định hướng" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-6 transition-all duration-300 hover:translate-x-2"
                  >
                    {/* Bullet Point with Glow Effect */}
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                      <div className="absolute h-10 w-10 rounded-full bg-[#56C4C3]/30 blur-md group-hover:bg-[#56C4C3]/50 transition-all duration-300" />
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#56C4C3] to-[#279595] shadow-lg shadow-[#56C4C3]/30">
                        <div className="h-4 w-4 rounded-full bg-white/90" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="mb-2 flex items-baseline gap-3">
                        <p className="font-mono text-base font-bold text-[#56C4C3] md:text-lg">{item.time}</p>
                        <div className="h-px flex-1 bg-gradient-to-r from-foreground/20 to-transparent" />
                      </div>
                      <p className="text-base leading-relaxed text-foreground md:text-lg">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <section id="register" className="flex min-h-screen w-full items-center px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto w-full max-w-2xl">
            <h2 className="mb-6 text-center font-sans text-3xl font-bold text-foreground md:text-4xl lg:text-5xl leading-tight" style={{ paddingTop: '0.15em', paddingBottom: '0.15em' }}>
              Đăng ký tham gia
            </h2>

            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-6 md:p-10">
              <p className="mb-6 text-center leading-relaxed text-foreground/90">
                Điền form đăng ký theo link bên dưới. Bạn có thể thay link này thành form công khai (Google Form,
                Typeform...).
              </p>

              <div className="flex flex-col items-center">
                <MagneticButton
                  size="lg"
                  variant="primary"
                  onClick={() => window.open("https://forms.google.com", "_blank")}
                  className="mb-4"
                >
                  Mở form đăng ký
                </MagneticButton>

                <p className="text-center text-sm text-foreground/60">
                  * Nếu nút không hoạt động, hãy liên hệ hotline để được hỗ trợ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="flex min-h-screen w-full items-center px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto w-full max-w-7xl">
            <h2 className="mb-8 text-center font-sans text-3xl font-bold text-foreground md:text-4xl lg:text-5xl drop-shadow-[0_4px_12px_rgba(86,196,195,0.3)] transform transition-all duration-500 hover:scale-105 leading-tight" style={{ paddingTop: '0.15em', paddingBottom: '0.15em' }}>
              Liên hệ
            </h2>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {/* Contact Info Card */}
              <div className="group relative rounded-2xl border border-foreground/20 bg-foreground/10 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_4px_16px_rgba(86,196,195,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transform transition-all duration-500 hover:scale-105 hover:shadow-[0_12px_48px_rgba(0,0,0,0.4),0_6px_24px_rgba(86,196,195,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-2">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#56C4C3]/20 via-transparent to-[#375AA9]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10">
                  <h3 className="mb-4 font-sans text-xl font-bold text-foreground drop-shadow-[0_2px_8px_rgba(86,196,195,0.2)]">{contactInfo.centerName}</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="font-mono text-xs text-foreground/60 mb-1">Địa chỉ</p>
                      <p className="text-foreground/90">{contactInfo.address}</p>
                    </div>

                    <div>
                      <p className="font-mono text-xs text-foreground/60 mb-1">Hotline</p>
                      <a href={`tel:${contactInfo.hotline}`} className="text-[#56C4C3] hover:text-[#375AA9] transition-colors font-medium">
                        {contactInfo.hotlineDisplay}
                      </a>
                    </div>

                    <div>
                      <p className="font-mono text-xs text-foreground/60 mb-1">Email</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-[#56C4C3] hover:text-[#375AA9] transition-colors font-medium"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder Card */}
              <div className="group relative rounded-2xl border border-foreground/20 bg-foreground/10 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_4px_16px_rgba(86,196,195,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transform transition-all duration-500 hover:scale-105 hover:shadow-[0_12px_48px_rgba(0,0,0,0.4),0_6px_24px_rgba(86,196,195,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-2">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#56C4C3]/20 via-transparent to-[#375AA9]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10">
                  <h3 className="mb-6 font-sans text-2xl font-semibold text-foreground drop-shadow-[0_2px_8px_rgba(86,196,195,0.2)]">{mapInfo.title}</h3>
                  <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden border border-foreground/10 shadow-lg">
                    <iframe
                      src={mapInfo.embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-foreground/10 px-6 py-8 md:px-12">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <p className="font-mono text-sm text-foreground/60">© 2025 STEMIFI MAKERS</p>
            <a
              href="https://stemifi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Website: stemifi.com
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}

