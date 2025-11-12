"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import { Clock, MapPin, Phone, Mail, Globe } from "lucide-react"
import {
  getCurrentWeek,
  getCurrentWeekSaturday,
  formatDate,
  getUpcomingWorkshops,
  workshops,
  type Workshop,
} from "@/lib/workshop-utils"
import {
  getContactInfo,
  getRegistrationInfo,
  getMapInfo,
} from "@/lib/contact-utils"
import { getGeneralInfo } from "@/lib/site-utils"

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop | null>(null)
  const [saturdayDate, setSaturdayDate] = useState<string>("")
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  
  // Lấy thông tin liên hệ từ JSON
  const contactInfo = getContactInfo()
  const registrationInfo = getRegistrationInfo()
  const mapInfo = getMapInfo()
  const generalInfo = getGeneralInfo()

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
    const currentWeek = getCurrentWeek()
    const currentWeekWorkshops = getUpcomingWorkshops()
    
    console.log("Current week:", currentWeek)
    console.log("Available workshops:", workshops.map(w => ({ week: w.week, title: w.title, hasWhyJoin: !!w.whyJoin })))
    console.log("Current week workshops:", currentWeekWorkshops)
    
    if (currentWeekWorkshops.length > 0) {
      const workshop = currentWeekWorkshops[0]
      console.log("Selected workshop:", workshop.title, "whyJoin:", workshop.whyJoin)
      // Đảm bảo workshop có đầy đủ thông tin từ JSON
      setCurrentWorkshop(workshop)
    } else {
      // Nếu không có workshop cho tuần hiện tại, lấy workshop đầu tiên từ JSON làm fallback
      console.log("No workshop for current week, using fallback")
      // Tìm workshop có week gần nhất với tuần hiện tại (hoặc tuần 1 nếu không có)
      const fallbackWorkshop = workshops.find((w) => w.week <= currentWeek) || workshops[0]
      console.log("Fallback workshop:", fallbackWorkshop?.title, "whyJoin:", fallbackWorkshop?.whyJoin)
      if (fallbackWorkshop) {
        setCurrentWorkshop(fallbackWorkshop)
      }
    }

    // Tính toán và format ngày thứ Bảy
    const saturday = getCurrentWeekSaturday()
    setSaturdayDate(formatDate(saturday))
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      const sectionMap: { [key: string]: number } = {
        hero: 0,
        about: 1,
        content: 2,
        register: 3,
        contact: 4,
      }
      setCurrentSection(sectionMap[sectionId] || 0)
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

      {/* Header Navigation */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 flex flex-col items-center gap-3 px-6 py-4 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Logo centered */}
        <button
          onClick={() => scrollToSection("hero")}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <img
            src="/stemifi-logo.png"
            alt="STEMIFI MAKERS"
            className="h-[64.8px] w-auto object-contain md:h-[86.4px]"
          />
        </button>

        {/* Menu under logo */}
        <div className="flex items-center gap-6 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md md:gap-8">
          {[
            { label: "Giới thiệu", id: "about", type: "section" },
            { label: "Nội dung", id: "content", type: "section" },
            { label: "Tất cả Workshop", id: "/workshops", type: "link" },
          ].map((item) => {
            if (item.type === "link") {
              return (
                <a
                  key={item.id}
                  href={item.id}
                  className="group relative cursor-pointer font-sans text-sm font-normal text-white transition-colors hover:text-[#00FFE8] md:text-base"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#00FFE8] transition-all duration-300 group-hover:w-full" />
                </a>
              )
            }
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group relative cursor-pointer font-sans text-sm font-normal text-white transition-colors hover:text-[#00FFE8] md:text-base"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#00FFE8] transition-all duration-300 group-hover:w-full" />
              </button>
            )
          })}

          {/* CTA Đăng ký nổi bật */}
          <button
            onClick={() => scrollToSection("register")}
            className="relative cursor-pointer rounded-full bg-gradient-to-r from-[#00FFE8] to-[#1800AD] px-4 py-2 font-sans text-sm font-medium text-white shadow-[0_8px_24px_rgba(24,0,173,0.35)] outline-none transition-all hover:brightness-110 focus-visible:ring-4 focus-visible:ring-[#00FFE8]/40 md:px-6 md:text-base"
          >
            Đăng ký
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/10" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {/* General info under taskbar, above hero */}
        <section className="relative z-20 w-full px-3 md:px-6 pt-4 md:pt-6">
          <div className="flex w-full items-center justify-center">
            <div className="w-full max-w-6xl rounded-2xl border border-foreground/10 bg-foreground/30 px-4 py-3 text-center backdrop-blur md:px-6 md:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <p className="font-sans text-base font-normal uppercase tracking-widest text-white md:text-lg">{generalInfo.title}</p>
              <p className="mt-2 font-sans text-2xl font-medium leading-tight text-white md:text-3xl md:mt-3 whitespace-nowrap">{generalInfo.subtitle}</p>
              <p className="mt-1.5 font-sans text-base text-white md:text-lg md:mt-2">{generalInfo.note}</p>
            </div>
          </div>
        </section>
        {/* Hero Section - Workshop Details */}
        <section
          id="hero"
          className="flex min-h-screen w-full items-center px-3 pt-4 pb-4 md:px-8 md:pt-6 md:pb-6"
        >
          <div className="mx-auto w-full max-w-6xl">
            {/* Glass Card Container */}
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] px-4 py-3 md:px-6 md:py-4">
              {/* Gradient Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFE8]/20 via-transparent to-[#1800AD]/20 opacity-50 blur-3xl" />
              
              <div className="relative z-10 grid gap-2 md:grid-cols-12 md:gap-4">
                {/* Left Column - Content */}
                <div className="md:col-span-6 flex flex-col justify-center">
                  {/* Logo/Brand */}
           

                  {/* Title with Gradient Glow */}
                  <div className="mb-2 relative">
                    <h1 className="mb-1 font-sans text-2xl font-medium text-black md:text-4xl lg:text-5xl md:mb-1.5">
                      <span className="text-black">STEMIFI</span>
                      <span className="text-black ml-2 md:ml-3">MAKERS</span>
                      <br />
                      <span className="text-black">WORKSHOP</span>
                    </h1>
                    <p className="mt-1.5 font-sans text-sm leading-relaxed tracking-tight text-black font-medium md:text-lg md:mt-2">
                      {currentWorkshop?.description || "Chương trình học tập trải nghiệm – thực hành trực tiếp"}
                    </p>
                  </div>

                  {/* Info Cards */}
                  <div className="mb-2 grid gap-1.5 sm:grid-cols-2 md:mb-3 md:gap-2">
                    <div className="rounded-xl border border-white/20 bg-white/35 backdrop-blur-sm p-2 md:p-2.5">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-black" />
                        <p className="font-mono text-sm font-medium uppercase tracking-widest text-black">Lịch</p>
                      </div>
                      <p className="font-sans text-base font-normal tracking-tight text-black ">
                        {saturdayDate || "Thứ Bảy hàng tuần"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/20 bg-white/35 backdrop-blur-sm p-2 md:p-2.5">
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-black" />
                        <p className="font-mono text-sm font-medium uppercase tracking-widest text-black">Thời gian</p>
                      </div>
                      <p className="font-sans text-base font-medium tracking-tight text-black ">
                        {currentWorkshop?.time || "8:00 - 11:15 AM"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/20 bg-white/35 backdrop-blur-sm p-2 md:p-2.5 sm:col-span-2">
                      <div className="mb-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-black" />
                        <p className="font-mono text-sm font-medium uppercase tracking-widest text-black">Địa điểm</p>
                      </div>
                      <p className="font-sans text-base font-normal tracking-tight text-black ">
                        {currentWorkshop?.location || "STEMIFI Lab"}
                      </p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-2">
                    <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection("register")}>
                      Đăng ký ngay
                    </MagneticButton>
                    <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection("content")}>
                      Xem nội dung
                    </MagneticButton>
                  </div>
                </div>

                {/* Right Column - Image & QR */}
                <div className="md:col-span-6 flex flex-col items-center justify-center gap-2 md:gap-3">
                  {/* Micro:bit Image */}
                  {currentWorkshop?.banner && (
                    <div className="relative w-full overflow-hidden rounded-3xl border border-white/20 bg-white/35 p-2 md:p-3 shadow-lg">
                      <img
                        src={currentWorkshop.banner}
                        alt={currentWorkshop.title}
                        className="mx-auto h-auto w-full object-contain rounded-2xl"
                        style={{ maxHeight: "500px" }}
                      />
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </section>

        

        {/* Why Participate Section */}
        <section id="about" className="flex min-h-0 w-full items-center px-4 py-4 md:min-h-screen md:px-12 md:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <h2 className="mb-3 text-center font-sans text-3xl font-medium text-white md:text-5xl lg:text-6xl md:mb-4 leading-tight" style={{ paddingTop: '0.15em', paddingBottom: '0.15em' }}>
              Vì sao nên tham gia?
            </h2>

            <div className="grid gap-2 md:grid-cols-2 md:gap-3">
              {(() => {
                // Kiểm tra dữ liệu
                if (!currentWorkshop) {
                  return (
                    <div className="col-span-2 flex flex-col items-center justify-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/25 py-12">
                      <p className="font-sans text-lg text-white">Đang tải thông tin...</p>
                    </div>
                  )
                }
                
                const whyJoinData = currentWorkshop.whyJoin
                if (!whyJoinData || whyJoinData.length === 0) {
                  return (
                    <div className="col-span-2 flex flex-col items-center justify-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/25 py-12">
                      <p className="font-sans text-lg text-white">Chưa có thông tin về lý do tham gia.</p>
                    </div>
                  )
                }
                
                return whyJoinData.map((item, index) => {
                  // Những câu description cần font-size 16px
                  const descriptionsToResize = [
                    "Từ ý tưởng → Lập trình → Tạo hình → Sản phẩm, rèn kỹ năng làm việc nhóm và thuyết trình.",
                    "Thiết kế chi tiết trên Tinkercad và quan sát in mẫu trên máy in 3D.",
                    "Nắm các khối lệnh cơ bản và cách tư duy thuật toán bằng kéo–thả.",
                    "Kết nối phần cứng (LED, Servo, Sensor) để tạo tương tác thực tế."
                  ];
                  
                  const shouldResize = descriptionsToResize.includes(item.description);
                  
                  return (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/25 backdrop-blur-xl px-4 py-3 md:px-6 md:py-4 transition-all duration-300 hover:border-[#00FFE8]/30 hover:bg-foreground/25 hover:shadow-lg hover:shadow-[#00FFE8]/10"
                    >
                      {/* Decorative gradient accent */}
                      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#00FFE8]/20 to-[#00C8FF]/20 blur-3xl transition-all duration-500 group-hover:scale-150" />
                      
                      <div className="relative z-10">
                        <h3 className="mb-2 font-sans text-xl font-medium text-white md:text-2xl">
                          {item.title}
                        </h3>
                        <p 
                          className="text-base leading-relaxed text-white md:text-lg"
                          style={shouldResize ? { fontSize: '16px' } : {}}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              })()}
            </div>
          </div>
        </section>

        {/* Workshop Content Section */}
        <section id="content" className="flex min-h-0 w-full items-center px-4 py-4 md:min-h-screen md:px-12 md:py-8">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="mb-3 text-center font-sans text-3xl font-medium text-white md:text-5xl lg:text-6xl md:mb-4 leading-tight" style={{ paddingTop: '0.15em', paddingBottom: '0.15em' }}>
              {currentWorkshop?.title ? (
                currentWorkshop.title.includes("LẬP TRÌNH BLOCKLY & MICRO:BIT") ? (
                  <>
                    <span className="whitespace-nowrap">LẬP TRÌNH BLOCKLY & MICRO:BIT</span>
                    <br />
                    ỨNG DỤNG VỚI MÁY IN 3D
                  </>
                ) : (
                  currentWorkshop.title
                )
              ) : (
                "Workshop"
              )}
            </h2>

            <div className="rounded-3xl border border-foreground/10 bg-foreground/25 backdrop-blur-xl px-4 py-3 md:px-6 md:py-4">
              <div className="space-y-3 md:space-y-4">
                {currentWorkshop?.schedule && currentWorkshop.schedule.length > 0 ? (
                  currentWorkshop.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-3 md:gap-4 transition-all duration-300 hover:translate-x-2"
                    >
                      {/* Bullet Point with Glow Effect */}
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center md:h-10 md:w-10">
                        <div className="absolute h-8 w-8 rounded-full bg-[#00FFE8]/30 blur-md group-hover:bg-[#00FFE8]/50 transition-all duration-300 md:h-10 md:w-10" />
                        <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#00FFE8] to-[#00C8FF] shadow-lg shadow-[#00FFE8]/30 md:h-8 md:w-8">
                          <div className="h-3 w-3 rounded-full bg-white/90 md:h-4 md:w-4" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-0.5">
                        <div className="mb-1.5 flex items-baseline gap-2">
                          <p className="font-mono text-base font-medium text-white md:text-lg">{item.time}</p>
                          <div className="h-px flex-1 bg-gradient-to-r from-foreground/20 to-transparent" />
                        </div>
                        <p className="text-base leading-relaxed text-white md:text-lg">{item.activity}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {[
                      { time: "08:00", activity: "Check-in & khởi động" },
                      { time: "08:15", activity: "Giới thiệu chủ đề & mục tiêu" },
                      { time: "08:40", activity: "Thực hành có hướng dẫn" },
                      { time: "10:10", activity: "Nâng cao & mở rộng" },
                      { time: "11:00", activity: "Tổng kết & định hướng" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="group flex items-start gap-3 md:gap-4 transition-all duration-300 hover:translate-x-2"
                      >
                        {/* Bullet Point with Glow Effect */}
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center md:h-10 md:w-10">
                          <div className="absolute h-8 w-8 rounded-full bg-[#00FFE8]/30 blur-md group-hover:bg-[#00FFE8]/50 transition-all duration-300 md:h-10 md:w-10" />
                          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#00FFE8] to-[#00C8FF] shadow-lg shadow-[#00FFE8]/30 md:h-8 md:w-8">
                            <div className="h-3 w-3 rounded-full bg-white/90 md:h-4 md:w-4" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                          <div className="mb-1.5 flex items-baseline gap-2">
                            <p className="font-mono text-base font-medium text-white md:text-lg">{item.time}</p>
                            <div className="h-px flex-1 bg-gradient-to-r from-foreground/20 to-transparent" />
                          </div>
                          <p className="text-base leading-relaxed text-white md:text-lg">{item.activity}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <section id="register" className="flex min-h-0 w-full items-center px-4 py-2 md:min-h-screen md:px-12 md:py-4">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="mb-1 text-center font-sans text-3xl font-medium text-white md:text-5xl lg:text-6xl md:mb-1.5 leading-tight" style={{ paddingTop: '0.15em', paddingBottom: '0.15em' }}>
              Đăng ký tham gia
            </h2>

            <div className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/25 backdrop-blur-xl px-4 py-3 md:px-6 md:py-4 transition-all duration-300 hover:border-[#00FFE8]/30 hover:bg-foreground/25 hover:shadow-lg hover:shadow-[#00FFE8]/10">
              {/* Decorative gradient accent */}
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#00FFE8]/20 to-[#00C8FF]/20 blur-3xl transition-all duration-500 group-hover:scale-150" />
              
              <div className="relative z-10">
                <p className="text-center leading-relaxed text-white text-sm font-medium md:text-lg" style={{ marginBottom: 0 }}>
                  {registrationInfo.description}
                </p>

                <div className="flex flex-col items-center">
                  <div style={{ marginTop: '18px', marginBottom: '18px' }}>
                    <MagneticButton
                      size="lg"
                      variant="primary"
                      onClick={() => window.open(registrationInfo.formUrl, "_blank")}
                    >
                      Mở form đăng ký
                    </MagneticButton>
                  </div>

                  <p className="text-center text-sm font-medium text-white md:text-base" style={{ marginTop: 0 }}>
                    {registrationInfo.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="flex min-h-0 w-full items-center px-4 py-4 md:min-h-screen md:px-12 md:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <h2 className="mb-3 text-center font-sans text-3xl font-medium text-white md:text-5xl lg:text-6xl md:mb-4 leading-tight" style={{ paddingTop: '0.15em', paddingBottom: '0.15em' }}>
              Liên hệ
            </h2>

            {/* Single Container for Contact and Map */}
            <div className="group relative rounded-2xl border border-foreground/20 bg-foreground/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,255,232,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transform transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.4),0_6px_24px_rgba(0,255,232,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFE8]/20 via-transparent to-[#1800AD]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-foreground/20">
                {/* Contact Info - Left Side */}
                <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5 md:pb-5">
                  <h3 className="mb-3 font-sans font-medium text-white" style={{ fontSize: '24px' }}>{contactInfo.centerName}</h3>

                  <div className="space-y-2 md:space-y-2.5">
                    <div>
                      <p className="font-mono text-white mb-1 font-medium" style={{ fontSize: 'calc(0.875rem + 2px)' }}>Địa chỉ</p>
                      <p className="text-white font-normal" style={{ fontSize: 'calc(1rem + 2px)', whiteSpace: 'nowrap' }}>{contactInfo.address}</p>
                    </div>

                    <div>
                      <p className="font-mono text-white mb-1 font-medium" style={{ fontSize: 'calc(0.875rem + 2px)' }}>Hotline</p>
                      <a href={`tel:${contactInfo.hotline}`} className="text-white font-medium hover:text-[#00FFE8] transition-colors" style={{ fontSize: 'calc(1rem + 2px)' }}>
                        {contactInfo.hotlineDisplay}
                      </a>
                    </div>

                    <div>
                      <p className="font-mono text-white mb-1 font-medium" style={{ fontSize: 'calc(0.875rem + 2px)' }}>Email</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-white font-medium hover:text-[#00FFE8] transition-colors"
                        style={{ fontSize: 'calc(1rem + 2px)' }}
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map - Right Side */}
                <div className="px-4 pt-3 pb-4 md:px-6 md:pt-5 md:pb-5">
                  <h3 className="mb-3 font-sans font-medium text-white" style={{ fontSize: '24px' }}>{mapInfo.title}</h3>
                  <div className="relative w-full h-48 md:h-64 lg:h-72 rounded-xl overflow-hidden border border-foreground/10 shadow-lg">
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
        <footer className="border-t border-foreground/10 px-6 py-4 md:px-12 md:py-6">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
            <p className="font-mono text-sm text-white">© 2025 STEMIFI MAKERS</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
