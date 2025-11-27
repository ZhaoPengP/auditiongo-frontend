'use client'
import React, { useState } from 'react'

interface CalendarEvent {
  id: string
  title: string
  subtitle?: string
  date: Date
  isActive?: boolean
}

interface CalendarProps {
  events?: CalendarEvent[]
  selectedMonth?: number
  selectedYear?: number
  onDateSelect?: (date: Date) => void
  className?: string
}

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  selectedMonth: initialMonth,
  selectedYear: initialYear,
  onDateSelect,
  className = '',
}) => {
  const today = new Date()
  // 强制显示当前月份和年份，不使用外部传入的初始值
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())

    const days = []
    const currentDate = new Date(startDate)

    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const isCurrentMonth = currentDate.getMonth() === currentMonth
        // 严格比较日期、月份和年份，确保今天日期被正确高亮
        const isToday =
          currentDate.getDate() === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear()
        const isSelected =
          selectedDate &&
          currentDate.getDate() === selectedDate.getDate() &&
          currentDate.getMonth() === selectedDate.getMonth() &&
          currentDate.getFullYear() === selectedDate.getFullYear()

        const dayEvents = events.filter((event) => {
          return (
            event.date.getDate() === currentDate.getDate() &&
            event.date.getMonth() === currentDate.getMonth() &&
            event.date.getFullYear() === currentDate.getFullYear()
          )
        })

        days.push({
          date: new Date(currentDate),
          isCurrentMonth,
          isToday,
          isSelected,
          events: dayEvents,
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }
    return days
  }

  const goToPreviousMonth = () => {
    // 先计算新的月份和年份
    const newMonth = currentMonth - 1
    const newYear = newMonth < 0 ? currentYear - 1 : currentYear
    const adjustedMonth = newMonth < 0 ? 11 : newMonth

    // 一起更新月份和年份，避免状态不同步
    setCurrentYear(newYear)
    setCurrentMonth(adjustedMonth)
  }

  const goToNextMonth = () => {
    // 先计算新的月份和年份
    const newMonth = currentMonth + 1
    const newYear = newMonth > 11 ? currentYear + 1 : currentYear
    const adjustedMonth = newMonth > 11 ? 0 : newMonth

    // 一起更新月份和年份，避免状态不同步
    setCurrentYear(newYear)
    setCurrentMonth(adjustedMonth)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className={`backdrop-blur-sm rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            &lt;
          </button>
          <h3 className="text-lg font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => (
          <div key={index} className="p-3 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-2">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`p-2 min-h-[80px] flex flex-col relative ${day.isCurrentMonth ? 'opacity-100' : 'opacity-40'} ${day.isSelected ? 'bg-white/10' : ''} ${day.isToday ? 'border-2 border-blue-500 bg-blue-500/20' : ''} hover:bg-white/5 cursor-pointer transition-colors`}
            onClick={() => handleDateClick(day.date)}
          >
            <span
              className={`text-sm font-semibold ${day.isToday ? 'font-bold text-blue-600' : ''}`}
            >
              {day.date.getDate()}
            </span>

            {day.events.length > 0 && (
              <div className="mt-1 space-y-1">
                {day.events.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={event.id || eventIndex}
                    className={`text-xs rounded px-2 py-1 text-nowrap overflow-hidden ${event.isActive ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{day.events.length - 2}
                  </div>
                )}
                {day.events[0]?.subtitle && (
                  <div className="text-xs text-gray-400">
                    {day.events[0].subtitle}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
