"use client"

import { useEffect, useState } from "react"

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      aria-label="Back to top"
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-[60] rounded-full bg-[#56C4C3] p-3 text-white shadow-xl transition-all hover:bg-[#279595] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#56C4C3] ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5l-7 7h4v7h6v-7h4l-7-7z" fill="currentColor" />
      </svg>
    </button>
  )
}


