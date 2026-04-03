'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Calendar, Clock, Video, MapPin, CheckCircle2, Loader2, WifiOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

// Lunes a Viernes: Matutino 9-14, Vespertino 18-21
const ALL_SLOTS = ['09:00','10:00','11:00','12:00','13:00','14:00','18:00','19:00','20:00','21:00']

function formatSlot(time: string) {
  const [h] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:00 ${ampm}`
}

// Solo Lunes–Viernes (1–5)
function isDayAvailable(date: Date, today: Date): boolean {
  const d = new Date(date); d.setHours(0, 0, 0, 0)
  const t = new Date(today); t.setHours(0, 0, 0, 0)
  if (d < t) return false
  const dow = date.getDay()
  return dow >= 1 && dow <= 5
}

interface Props {
  onClose: () => void
  onSuccess: () => void
  isFirstSession: boolean
}

export function BookingModal({ onClose, onSuccess, isFirstSession }: Props) {
  const { user } = useAuth()
  const supabase = createClient()

  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [modality, setModality] = useState<'online' | 'presencial'>('online')
  const [reason, setReason] = useState('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [presencialEnabled, setPresencialEnabled] = useState<boolean | null>(null)

  // Cargar estado presencial
  useEffect(() => {
    ;(supabase as any).from('app_settings').select('value').eq('key', 'presencial_enabled').single()
      .then(({ data }: { data: { value: unknown } | null }) => {
        const enabled = data?.value === true || data?.value === 'true'
        setPresencialEnabled(enabled)
        if (!enabled) setModality('online')
      })
  }, [supabase])

  const fetchBooked = useCallback(async (date: string) => {
    setLoadingSlots(true)
    setSelectedSlot(null)
    const { data } = await supabase
      .from('appointments')
      .select('start_time')
      .eq('appointment_date', date)
      .in('status', ['pending', 'confirmed'])
    setBookedSlots((data ?? []).map((b) => b.start_time.slice(0, 5)))
    setLoadingSlots(false)
  }, [supabase])

  useEffect(() => {
    if (selectedDate) fetchBooked(selectedDate)
  }, [selectedDate, fetchBooked])

  // Real-time: refresh slots cuando alguien agenda
  useEffect(() => {
    if (!selectedDate) return
    const channel = supabase
      .channel('booking-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchBooked(selectedDate)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selectedDate, fetchBooked, supabase])

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot || !user) return
    setSubmitting(true)
    const slotHour = parseInt(selectedSlot.split(':')[0])
    const endTime = `${String(slotHour + 1).padStart(2, '0')}:00:00`

    const { error } = await supabase.from('appointments').insert({
      client_id: user.id,
      appointment_date: selectedDate,
      start_time: selectedSlot + ':00',
      end_time: endTime,
      modality,
      reason: reason || null,
      session_price: isFirstSession ? 140 : 200,
      is_first_session: isFirstSession,
    })
    setSubmitting(false)
    if (!error) { setDone(true); setTimeout(onSuccess, 1800) }
  }

  // Calendar helpers
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const todayStr = today.toISOString().slice(0, 10)

  const formatCalDate = (day: number) => {
    const m = String(calMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${calYear}-${m}-${d}`
  }

  const price = isFirstSession ? 140 : 200

  // Separar slots en matutino y vespertino
  const morningSlots = ALL_SLOTS.filter(s => parseInt(s) < 15)
  const eveningSlots = ALL_SLOTS.filter(s => parseInt(s) >= 15)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(45,43,61,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ ease: [0.22, 1, 0.36, 1] as [number,number,number,number], duration: 0.4 }}
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        style={{ background: 'white', boxShadow: '0 24px 64px rgba(13,110,253,0.2)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-5 pb-4 border-b flex items-center justify-between z-10" style={{ borderColor: 'rgba(184,175,240,0.2)' }}>
          <h2 className="font-heading text-lg font-bold" style={{ color: '#2D2B3D' }}>Reservar cita</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#F4F2FF' }}>
            <X size={16} style={{ color: '#7A788F' }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-8 gap-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(13,110,253,0.1)' }}>
                <CheckCircle2 size={32} style={{ color: '#0D6EFD' }} />
              </div>
              <h3 className="font-heading text-xl font-bold" style={{ color: '#2D2B3D' }}>¡Cita reservada!</h3>
              <p className="text-sm" style={{ color: '#7A788F' }}>Cristal confirmará tu cita pronto.</p>
            </motion.div>
          ) : (
            <>
              {/* Price banner */}
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ background: 'rgba(13,110,253,0.06)', border: '1.5px solid rgba(13,110,253,0.12)' }}>
                <span className="text-sm font-medium" style={{ color: '#2D2B3D' }}>
                  {isFirstSession ? '🎉 Primera sesión — 30% descuento' : 'Sesión individual'}
                </span>
                <span className="font-bold" style={{ color: '#0D6EFD' }}>
                  ${price} MXN
                  {isFirstSession && <span className="text-xs font-normal ml-1 line-through" style={{ color: '#9CA3AF' }}>$200</span>}
                </span>
              </div>

              {/* Info */}
              <div className="flex items-center gap-2 text-xs" style={{ color: '#7A788F' }}>
                <Clock size={12} style={{ color: '#B8AFF0' }} />
                Lunes a Viernes · Mat. 9–14 h · Vesp. 18–21 h · Sesiones de 1 hora
              </div>

              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: '#F4F2FF' }}
                  >
                    <ChevronLeft size={16} style={{ color: '#7A788F' }} />
                  </button>
                  <span className="text-sm font-bold" style={{ color: '#2D2B3D' }}>{MONTHS[calMonth]} {calYear}</span>
                  <button
                    onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: '#F4F2FF' }}
                  >
                    <ChevronRight size={16} style={{ color: '#7A788F' }} />
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: '#B8AFF0' }}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = formatCalDate(day)
                    const available = isDayAvailable(new Date(calYear, calMonth, day), today)
                    const selected = selectedDate === dateStr
                    const isToday = dateStr === todayStr
                    return (
                      <button
                        key={day}
                        onClick={() => available && setSelectedDate(dateStr)}
                        disabled={!available}
                        className="aspect-square rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer disabled:cursor-default"
                        style={{
                          background: selected ? '#0D6EFD' : available ? (isToday ? 'rgba(13,110,253,0.08)' : 'transparent') : 'transparent',
                          color: selected ? 'white' : available ? '#2D2B3D' : '#D1D5DB',
                          border: isToday && !selected ? '1.5px solid rgba(13,110,253,0.3)' : '1.5px solid transparent',
                        }}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#2D2B3D' }}>
                    <Clock size={14} className="inline mr-1" style={{ color: '#0D6EFD' }} />
                    Horarios disponibles
                  </p>
                  {loadingSlots ? (
                    <div className="flex justify-center py-4">
                      <Loader2 size={20} className="animate-spin" style={{ color: '#B8AFF0' }} />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Matutino */}
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>Matutino</p>
                        <div className="grid grid-cols-3 gap-2">
                          {morningSlots.map((slot) => {
                            const taken = bookedSlots.includes(slot)
                            const sel = selectedSlot === slot
                            return (
                              <button
                                key={slot}
                                onClick={() => !taken && setSelectedSlot(slot)}
                                disabled={taken}
                                className="py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer disabled:cursor-default"
                                style={{
                                  background: sel ? '#0D6EFD' : taken ? '#F3F4F6' : 'rgba(13,110,253,0.06)',
                                  color: sel ? 'white' : taken ? '#D1D5DB' : '#0D6EFD',
                                  border: sel ? '1.5px solid #0D6EFD' : '1.5px solid rgba(13,110,253,0.15)',
                                  textDecoration: taken ? 'line-through' : 'none',
                                }}
                              >
                                {formatSlot(slot)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      {/* Vespertino */}
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>Vespertino</p>
                        <div className="grid grid-cols-4 gap-2">
                          {eveningSlots.map((slot) => {
                            const taken = bookedSlots.includes(slot)
                            const sel = selectedSlot === slot
                            return (
                              <button
                                key={slot}
                                onClick={() => !taken && setSelectedSlot(slot)}
                                disabled={taken}
                                className="py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer disabled:cursor-default"
                                style={{
                                  background: sel ? '#0D6EFD' : taken ? '#F3F4F6' : 'rgba(13,110,253,0.06)',
                                  color: sel ? 'white' : taken ? '#D1D5DB' : '#0D6EFD',
                                  border: sel ? '1.5px solid #0D6EFD' : '1.5px solid rgba(13,110,253,0.15)',
                                  textDecoration: taken ? 'line-through' : 'none',
                                }}
                              >
                                {formatSlot(slot)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modality */}
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: '#2D2B3D' }}>Modalidad</p>
                <div className="grid grid-cols-2 gap-2">
                  {/* Online — siempre disponible */}
                  <button
                    onClick={() => setModality('online')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
                    style={{
                      background: modality === 'online' ? 'rgba(13,110,253,0.08)' : '#F9F9FF',
                      border: `1.5px solid ${modality === 'online' ? '#0D6EFD' : 'rgba(184,175,240,0.3)'}`,
                      color: modality === 'online' ? '#0D6EFD' : '#7A788F',
                    }}
                  >
                    <Video size={15} />
                    En línea
                  </button>

                  {/* Presencial — animación si está desactivado */}
                  {presencialEnabled === false ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs text-center px-2"
                      style={{
                        background: 'rgba(242,167,184,0.1)',
                        border: '1.5px solid rgba(242,167,184,0.35)',
                        color: '#C07A8A',
                      }}
                    >
                      <WifiOff size={14} style={{ color: '#F2A7B8' }} />
                      <span className="font-semibold leading-tight">No disponible</span>
                      <span style={{ color: '#C07A8A', opacity: 0.8 }}>Solo en línea por ahora</span>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => setModality('presencial')}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
                      style={{
                        background: modality === 'presencial' ? 'rgba(13,110,253,0.08)' : '#F9F9FF',
                        border: `1.5px solid ${modality === 'presencial' ? '#0D6EFD' : 'rgba(184,175,240,0.3)'}`,
                        color: modality === 'presencial' ? '#0D6EFD' : '#7A788F',
                      }}
                    >
                      <MapPin size={15} />
                      Presencial
                    </button>
                  )}
                </div>

                {/* Banner informativo cuando presencial está desactivado */}
                <AnimatePresence>
                  {presencialEnabled === false && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 px-4 py-3 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(242,167,184,0.12)', border: '1.5px solid rgba(242,167,184,0.3)' }}>
                        <motion.span
                          animate={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
                          className="text-lg flex-shrink-0"
                        >
                          ✈️
                        </motion.span>
                        <div>
                          <p className="text-xs font-bold" style={{ color: '#2D2B3D' }}>Cristal está fuera por el momento</p>
                          <p className="text-xs mt-0.5" style={{ color: '#7A788F' }}>
                            Las sesiones presenciales no están disponibles, pero puedes agendar en línea con la misma calidad de atención.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#2D2B3D' }}>
                  Motivo de consulta <span style={{ color: '#9CA3AF' }}>(opcional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Cuéntame brevemente qué te trae aquí…"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(13,110,253,0.12)]"
                  style={{ background: '#F4F2FF', border: '1.5px solid rgba(184,175,240,0.3)', color: '#2D2B3D' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')}
                />
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                disabled={!selectedDate || !selectedSlot || submitting}
                whileHover={{ scale: (!selectedDate || !selectedSlot || submitting) ? 1 : 1.01, y: (!selectedDate || !selectedSlot || submitting) ? 0 : -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl text-sm font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #0D6EFD, #9E94DF)',
                  boxShadow: '0 4px 20px rgba(13,110,253,0.25)',
                }}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
                {submitting ? 'Reservando…' : 'Confirmar cita'}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
