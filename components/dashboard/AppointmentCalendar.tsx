'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface Appt {
  appointment_date: string
  start_time: string
  status: string
  full_name?: string
}

interface Props {
  appointments: Appt[]
  onDayClick?: (date: string) => void
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#10B981',
  cancelled: '#EF4444',
  completed: '#0D6EFD',
  no_show: '#9CA3AF',
}

export function AppointmentCalendar({ appointments, onDayClick }: Props) {
  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const todayStr = today.toISOString().slice(0, 10)

  const formatDate = (day: number) => {
    const m = String(calMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${calYear}-${m}-${d}`
  }

  const apptsByDate = appointments.reduce<Record<string, Appt[]>>((acc, a) => {
    if (!acc[a.appointment_date]) acc[a.appointment_date] = []
    acc[a.appointment_date].push(a)
    return acc
  }, {})

  const selectedAppts = selectedDate ? (apptsByDate[selectedDate] ?? []) : []

  const handleDay = (dateStr: string) => {
    setSelectedDate(prev => prev === dateStr ? null : dateStr)
    onDayClick?.(dateStr)
  }

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(184,175,240,0.2)', boxShadow: '0 2px 12px rgba(13,110,253,0.06)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(184,175,240,0.15)' }}>
        <button onClick={prevMonth} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors" style={{ background: '#F4F2FF' }}>
          <ChevronLeft size={15} style={{ color: '#7A788F' }} />
        </button>
        <span className="text-sm font-bold" style={{ color: '#2D2B3D' }}>{MONTHS[calMonth]} {calYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors" style={{ background: '#F4F2FF' }}>
          <ChevronRight size={15} style={{ color: '#7A788F' }} />
        </button>
      </div>

      <div className="p-4">
        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: '#B8AFF0' }}>{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = formatDate(day)
            const dow = new Date(calYear, calMonth, day).getDay()
            const isWeekend = dow === 0 || dow === 6
            const dayAppts = apptsByDate[dateStr] ?? []
            const isToday = dateStr === todayStr
            const isSelected = selectedDate === dateStr
            const hasAppts = dayAppts.length > 0
            const activeAppts = dayAppts.filter(a => a.status === 'confirmed' || a.status === 'pending')

            return (
              <button
                key={day}
                onClick={() => !isWeekend && handleDay(dateStr)}
                disabled={isWeekend}
                className="relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-150 disabled:cursor-default"
                style={{
                  cursor: isWeekend ? 'default' : 'pointer',
                  background: isSelected ? '#0D6EFD' : isToday ? 'rgba(13,110,253,0.08)' : 'transparent',
                  border: isToday && !isSelected ? '1.5px solid rgba(13,110,253,0.25)' : '1.5px solid transparent',
                  opacity: isWeekend ? 0.3 : 1,
                }}
              >
                <span className="text-xs font-semibold" style={{ color: isSelected ? 'white' : hasAppts ? '#2D2B3D' : '#6B7280' }}>
                  {day}
                </span>
                {hasAppts && !isWeekend && (
                  <div className="flex gap-0.5 mt-0.5">
                    {activeAppts.slice(0, 3).map((a, idx) => (
                      <span key={idx} className="w-1 h-1 rounded-full" style={{ background: isSelected ? 'rgba(255,255,255,0.8)' : (STATUS_COLOR[a.status] ?? '#B8AFF0') }} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day appointments */}
      {selectedDate && (
        <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: 'rgba(184,175,240,0.15)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#7A788F' }}>
            {selectedAppts.length === 0 ? 'Sin citas este día' : `${selectedAppts.length} cita${selectedAppts.length > 1 ? 's' : ''}`}
          </p>
          {selectedAppts.map((a, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLOR[a.status] ?? '#B8AFF0' }} />
              <span className="text-xs font-medium" style={{ color: '#2D2B3D' }}>
                {a.start_time.slice(0, 5)}
                {a.full_name && <span style={{ color: '#7A788F' }}> · {a.full_name}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
