'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Appointment } from '@/types/database'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const TOTAL_SLOTS = 10 // slots por día: 9,10,11,12,13,14,18,19,20,21

interface Props {
  userAppointments: Appointment[]
  onBookDay: (date: string) => void
}

function getAvailability(booked: number): { color: string; bg: string; label: string } {
  const free = TOTAL_SLOTS - booked
  if (free === 0) return { color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)', label: 'Lleno' }
  if (free <= 2) return { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: `${free} lugar${free > 1 ? 'es' : ''}` }
  if (free <= 5) return { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Disponible' }
  return { color: '#0D6EFD', bg: 'rgba(13,110,253,0.07)', label: 'Disponible' }
}

export function AvailabilityCalendar({ userAppointments, onBookDay }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  const todayStr = today.toISOString().slice(0, 10)

  const formatDate = useCallback((day: number) => {
    const m = String(calMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${calYear}-${m}-${d}`
  }, [calMonth, calYear])

  const fetchCounts = useCallback(async () => {
    setLoading(true)
    const firstDay = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-01`
    const lastDay = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${new Date(calYear, calMonth + 1, 0).getDate()}`
    const { data } = await supabase
      .from('appointments')
      .select('appointment_date')
      .in('status', ['pending', 'confirmed'])
      .gte('appointment_date', firstDay)
      .lte('appointment_date', lastDay)

    const counts: Record<string, number> = {}
    for (const row of data ?? []) {
      counts[row.appointment_date] = (counts[row.appointment_date] ?? 0) + 1
    }
    setSlotCounts(counts)
    setLoading(false)
  }, [supabase, calMonth, calYear])

  useEffect(() => { fetchCounts() }, [fetchCounts])

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay()

  // Index de citas del usuario por fecha
  const userApptDates = useMemo(() => {
    const s = new Set<string>()
    for (const a of userAppointments) {
      if (a.status === 'pending' || a.status === 'confirmed') s.add(a.appointment_date)
    }
    return s
  }, [userAppointments])

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
        <button onClick={prevMonth} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#F4F2FF' }}>
          <ChevronLeft size={15} style={{ color: '#7A788F' }} />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: '#2D2B3D' }}>{MONTHS[calMonth]} {calYear}</p>
          <p className="text-xs" style={{ color: '#B8AFF0' }}>Disponibilidad de agenda</p>
        </div>
        <button onClick={nextMonth} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#F4F2FF' }}>
          <ChevronRight size={15} style={{ color: '#7A788F' }} />
        </button>
      </div>

      <div className="p-4">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: '#B8AFF0' }}>{d}</div>
          ))}
        </div>

        {/* Días */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = formatDate(day)
            const dow = new Date(calYear, calMonth, day).getDay()
            const isWeekend = dow === 0 || dow === 6
            const isPast = dateStr < todayStr
            const isToday = dateStr === todayStr
            const disabled = isWeekend || isPast
            const booked = slotCounts[dateStr] ?? 0
            const avail = getAvailability(booked)
            const isFull = booked >= TOTAL_SLOTS
            const hasUserAppt = userApptDates.has(dateStr)

            return (
              <button
                key={day}
                onClick={() => !disabled && !isFull && onBookDay(dateStr)}
                disabled={disabled || isFull}
                title={disabled ? undefined : `${TOTAL_SLOTS - booked} lugar${TOTAL_SLOTS - booked !== 1 ? 'es' : ''} disponible${TOTAL_SLOTS - booked !== 1 ? 's' : ''}`}
                className="relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-150"
                style={{
                  cursor: disabled || isFull ? 'default' : 'pointer',
                  background: disabled ? 'transparent' : isToday ? 'rgba(13,110,253,0.08)' : avail.bg,
                  border: isToday ? '1.5px solid rgba(13,110,253,0.3)' : '1.5px solid transparent',
                  opacity: disabled ? 0.28 : 1,
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: disabled ? '#9CA3AF' : isFull ? '#9CA3AF' : '#2D2B3D' }}
                >
                  {day}
                </span>

                {/* Indicador de disponibilidad */}
                {!disabled && (
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{ background: avail.color, opacity: loading ? 0.3 : 1 }}
                  />
                )}

                {/* Cita del usuario */}
                {hasUserAppt && !disabled && (
                  <span
                    className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: '#0D6EFD' }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t" style={{ borderColor: 'rgba(184,175,240,0.12)' }}>
          {[
            { color: '#0D6EFD', label: 'Disponible' },
            { color: '#F59E0B', label: 'Pocos lugares' },
            { color: '#9CA3AF', label: 'Lleno' },
            { color: '#0D6EFD', label: 'Tu cita', dot: true },
          ].map(({ color, label, dot }) => (
            <div key={label} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: color,
                  outline: dot ? `2px solid rgba(13,110,253,0.3)` : 'none',
                  outlineOffset: 1,
                }}
              />
              <span className="text-xs" style={{ color: '#9CA3AF' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onBookDay('')}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
          style={{ background: 'rgba(13,110,253,0.07)', color: '#0D6EFD', border: '1.5px solid rgba(13,110,253,0.15)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,110,253,0.13)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,110,253,0.07)')}
        >
          <CalendarPlus size={14} />
          Elegir fecha y agendar
        </button>
      </div>
    </div>
  )
}
