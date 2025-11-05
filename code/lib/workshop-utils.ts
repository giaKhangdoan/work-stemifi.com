import workshopsData from "./workshops-data.json"

export interface ScheduleItem {
  time: string
  activity: string
}

export interface WhyJoinItem {
  title: string
  description: string
}

export interface Workshop {
  id: number
  title: string
  description: string
  week: number
  day: string
  time: string
  duration: string
  level: string
  instructor: string
  capacity: number
  enrolled: number
  color: string
  borderColor: string
  tags: string[]
  date: string
  schedule?: ScheduleItem[]
  location?: string
  banner?: string
  whyJoin?: WhyJoinItem[]
}

export const workshops: Workshop[] = workshopsData.workshops

export function getCurrentWeek(): number {
  const now = new Date()
  // Lấy ngày thứ 2 đầu tuần của tuần hiện tại
  const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1 // Số ngày cần trừ để về thứ 2
  const monday = new Date(now)
  monday.setDate(now.getDate() - daysToMonday)
  monday.setHours(0, 0, 0, 0)
  
  // Ngày thứ 2 đầu tiên của hệ thống (có thể thay đổi)
  const startDate = new Date(2025, 0, 6) // January 6, 2025 (Monday) - bạn có thể thay đổi
  startDate.setHours(0, 0, 0, 0)
  
  // Tính số tuần từ ngày bắt đầu
  const diffTime = monday.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const weekNumber = Math.floor(diffDays / 7) + 1
  
  return weekNumber > 0 ? weekNumber : 1
}

export function getCurrentWeekSaturday(): Date {
  const now = new Date()
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - daysToMonday)
  
  // Thứ Bảy là 5 ngày sau thứ 2
  const saturday = new Date(monday)
  saturday.setDate(monday.getDate() + 5)
  
  return saturday
}

export function getSaturdayByWeek(week: number): Date {
  // Ngày thứ 2 đầu tiên của hệ thống
  const startDate = new Date(2025, 0, 6) // January 6, 2025 (Monday)
  startDate.setHours(0, 0, 0, 0)
  
  // Tính ngày thứ 2 của tuần đó
  const weekMonday = new Date(startDate)
  weekMonday.setDate(startDate.getDate() + (week - 1) * 7)
  
  // Thứ Bảy là 5 ngày sau thứ 2
  const saturday = new Date(weekMonday)
  saturday.setDate(weekMonday.getDate() + 5)
  
  return saturday
}

export function getPastWorkshops(): Workshop[] {
  const now = new Date()
  const currentWeek = getCurrentWeek()
  const currentSaturday = getCurrentWeekSaturday()
  currentSaturday.setHours(23, 59, 59, 999) // End of Saturday
  
  // Lấy tất cả workshop có week < currentWeek
  // Hoặc week === currentWeek nhưng đã qua thứ Bảy
  return workshops
    .filter((w) => {
      if (w.week < currentWeek) {
        return true
      }
      if (w.week === currentWeek) {
        // Nếu là tuần hiện tại, kiểm tra xem đã qua thứ Bảy chưa
        const workshopSaturday = getSaturdayByWeek(w.week)
        workshopSaturday.setHours(23, 59, 59, 999)
        return now > workshopSaturday
      }
      return false
    })
    .sort((a, b) => {
      // Sắp xếp từ mới nhất đến cũ nhất
      const dateA = getSaturdayByWeek(a.week)
      const dateB = getSaturdayByWeek(b.week)
      return dateB.getTime() - dateA.getTime()
    })
}

export function getCurrentWorkshops(): Workshop[] {
  const currentWeek = getCurrentWeek()
  const currentSaturday = getCurrentWeekSaturday()
  const now = new Date()
  
  // Lấy workshop của tuần hiện tại
  const weekWorkshops = workshops.filter((w) => w.week === currentWeek)
  
  // Kiểm tra xem thứ Bảy đã qua chưa
  currentSaturday.setHours(23, 59, 59, 999)
  if (now <= currentSaturday) {
    // Chưa qua thứ Bảy, hiển thị workshop hiện tại
    return weekWorkshops.sort((a, b) => {
      const timeA = Number.parseInt(a.time.split(":")[0])
      const timeB = Number.parseInt(b.time.split(":")[0])
      return timeA - timeB
    })
  }
  
  // Đã qua thứ Bảy, không có workshop hiện tại
  return []
}

export function formatDate(date: Date): string {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]
  
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export function getUpcomingWorkshops(): Workshop[] {
  const currentWeek = getCurrentWeek()
  return workshops
    .filter((w) => w.week === currentWeek)
    .sort((a, b) => {
      const timeA = Number.parseInt(a.time.split(":")[0])
      const timeB = Number.parseInt(b.time.split(":")[0])
      return timeA - timeB
    })
}

export function getWorkshopsByWeek(week: number): Workshop[] {
  return workshops
    .filter((w) => w.week === week)
    .sort((a, b) => {
      const timeA = Number.parseInt(a.time.split(":")[0])
      const timeB = Number.parseInt(b.time.split(":")[0])
      return timeA - timeB
    })
}

export function getAllWeeks(): number[] {
  return Array.from(new Set(workshops.map((w) => w.week))).sort((a, b) => a - b)
}

export function getWorkshopStats() {
  const totalEnrolled = workshops.reduce((sum, w) => sum + w.enrolled, 0)
  const totalCapacity = workshops.reduce((sum, w) => sum + w.capacity, 0)
  const occupancyRate = Math.round((totalEnrolled / totalCapacity) * 100)

  return {
    totalWorkshops: workshops.length,
    totalEnrolled,
    totalCapacity,
    occupancyRate,
  }
}

export function isWorkshopHappeningNow(workshop: Workshop): boolean {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  // Parse workshop time (e.g., "10:00 AM - 12:30 PM" or "2:00 PM - 4:30 PM")
  const timeMatch = workshop.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
  if (!timeMatch) return false

  let workshopStartHour = Number.parseInt(timeMatch[1])
  const workshopMinute = Number.parseInt(timeMatch[2])
  const isPM = timeMatch[3] === "PM"

  // Convert to 24-hour format
  if (isPM && workshopStartHour !== 12) {
    workshopStartHour += 12
  } else if (!isPM && workshopStartHour === 12) {
    workshopStartHour = 0
  }

  const workshopStartInMinutes = workshopStartHour * 60 + workshopMinute

  // Parse duration (e.g., "2.5 hours" or "2 hours")
  const durationMatch = workshop.duration.match(/(\d+(?:\.\d+)?)\s*hours?/)
  if (!durationMatch) return false

  const durationInMinutes = Number.parseFloat(durationMatch[1]) * 60
  const workshopEndInMinutes = workshopStartInMinutes + durationInMinutes

  // Check if current time is within workshop time range
  return currentTimeInMinutes >= workshopStartInMinutes && currentTimeInMinutes < workshopEndInMinutes
}

export function getNextUpcomingWorkshop(): Workshop | null {
  const currentWeek = getCurrentWeek()
  const upcomingWorkshops = getUpcomingWorkshops()

  if (upcomingWorkshops.length === 0) return null

  const now = new Date()
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes()

  // Find the first workshop that hasn't started yet today
  const futureWorkshop = upcomingWorkshops.find((w) => {
    const timeMatch = w.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
    if (!timeMatch) return false

    let workshopHour = Number.parseInt(timeMatch[1])
    const workshopMinute = Number.parseInt(timeMatch[2])
    const isPM = timeMatch[3] === "PM"

    if (isPM && workshopHour !== 12) {
      workshopHour += 12
    } else if (!isPM && workshopHour === 12) {
      workshopHour = 0
    }

    const workshopTimeInMinutes = workshopHour * 60 + workshopMinute
    return workshopTimeInMinutes > currentTimeInMinutes
  })

  return futureWorkshop || upcomingWorkshops[0]
}

export function getLiveWorkshop(): Workshop | null {
  const currentWeek = getCurrentWeek()
  const weekWorkshops = getWorkshopsByWeek(currentWeek)

  return weekWorkshops.find((w) => isWorkshopHappeningNow(w)) || null
}

// Additional utility functions can be added here
