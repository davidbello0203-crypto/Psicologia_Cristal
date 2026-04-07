'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Calendar, Clock, Video, MapPin, CheckCircle2, Loader2, WifiOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'

// ─── Constantes ──────────────────────────────────────────────────────────────
const DAYS    = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MORNING = ['09:00','10:00','11:00','12:00','13:00','14:00']
const EVENING = ['18:00','19:00','20:00','21:00']

function fmtSlot(t: string) {
  const h = parseInt(t)
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`
}

function isWeekday(y: number, m: number, d: number) {
  const dow = new Date(y, m, d).getDay()
  return dow >= 1 && dow <= 5
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  onClose: () => void
  onSuccess: () => void
  isFirstSession: boolean
  initialDate?: string
}

// ─── Componente ───────────────────────────────────────────────────────────────
export function BookingModal({ onClose, onSuccess, isFirstSession, initialDate }: Props) {
  const { user } = useAuth()
  const supabase  = useMemo(() => createClient(), [])
  const todayDate = useMemo(() => {
    const d = new Date(); d.setHours(0,0,0,0); return d
  }, [])
  const todayStr  = toDateStr(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())

  // Parsear initialDate para el mes del calendario
  const initYear  = initialDate ? parseInt(initialDate.split('-')[0]) : todayDate.getFullYear()
  const initMonth = initialDate ? parseInt(initialDate.split('-')[1]) - 1 : todayDate.getMonth()

  // ── Estado ─────────────────────────────────────────────────────────────────
  const [calYear,  setCalYear]  = useState(initYear)
  const [calMonth, setCalMonth] = useState(initMonth)
  const [selDate,  setSelDate]  = useState<string | null>(initialDate ?? null)
  const [selSlot,  setSelSlot]  = useState<string | null>(null)
  const [modality, setModality] = useState<'online' | 'presencial'>('online')
  const [reason,   setReason]   = useState('')

  const [bookedSlots,       setBookedSlots]       = useState<string[]>([])
  const [loadingSlots,      setLoadingSlots]      = useState(false)
  const [presencialEnabled, setPresencialEnabled] = useState<boolean>(true)
  const [submitting,        setSubmitting]        = useState(false)
  const [submitError,       setSubmitError]       = useState<string | null>(null)
  const [done,              setDone]              = useState(false)

  // ── Cargar estado presencial UNA vez ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'presencial_enabled')
      .single()
      .then(({ data }) => {
        if (cancelled) return
        const enabled = !data || data.value !== false
        setPresencialEnabled(enabled)
        if (!enabled) setModality('online')
      })
    return () => { cancelled = true }
  }, [supabase])

  // ── Cargar slots ocupados cuando cambia la fecha seleccionada ─────────────
  useEffect(() => {
    if (!selDate) return
    let cancelled = false
    setLoadingSlots(true)
    setSelSlot(null)
    setSubmitError(null)

    const timeout = setTimeout(() => {
      if (!cancelled) {
        cancelled = true
        console.warn('fetchBooked timeout — mostrando todos los slots disponibles')
        setBookedSlots([])
        setLoadingSlots(false)
      }
    }, 6000)

    supabase
      .from('appointments')
      .select('start_time')
      .eq('appointment_date', selDate)
      .in('status', ['pending', 'confirmed'])
      .then(({ data, error }) => {
        clearTimeout(timeout)
        if (cancelled) return
        if (error) {
          console.error('fetchBooked error:', error)
          setBookedSlots([])
        } else {
          setBookedSlots((data ?? []).map(r => r.start_time.slice(0, 5)))
        }
        setLoadingSlots(false)
      })

    return () => { cancelled = true; clearTimeout(timeout) }
  }, [selDate, supabase])

  // ── Navegar mes ───────────────────────────────────────────────────────────
  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  // ── Confirmar cita ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selDate || !selSlot || !user) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const h       = parseInt(selSlot.split(':')[0])
      const endTime = `${String(h + 1).padStart(2,'0')}:00:00`
      const { error } = await supabase.from('appointments').insert({
        client_id:        user.id,
        appointment_date: selDate,
        start_time:       selSlot + ':00',
        end_time:         endTime,
        modality,
        status:           'pending',
        reason:           reason.trim() || null,
        session_price:    isFirstSession ? 140 : 200,
        is_first_session: isFirstSession,
      })
      if (error) {
        console.error('insert error:', error)
        setSubmitError('No se pudo reservar: ' + error.message)
      } else {
        setDone(true)
        setTimeout(onSuccess, 1800)
      }
    } catch (e: unknown) {
      setSubmitError('Error inesperado. Intenta de nuevo.')
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Helpers calendario ────────────────────────────────────────────────────
  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayOfWk = new Date(calYear, calMonth, 1).getDay()

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(45,43,61,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
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
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-5 pb-4 border-b bg-white"
          style={{ borderColor: 'rgba(184,175,240,0.2)' }}>
          <h2 className="font-heading text-lg font-bold" style={{ color: '#2D2B3D' }}>Reservar cita</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#F4F2FF' }}>
            <X size={16} style={{ color: '#7A788F' }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* ── Éxito ─────────────────────────────────────────────────────── */}
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <CheckCircle2 size={32} style={{ color: '#10B981' }} />
              </div>
              <h3 className="font-heading text-xl font-bold" style={{ color: '#2D2B3D' }}>¡Cita reservada!</h3>
              <p className="text-sm" style={{ color: '#7A788F' }}>Cristal confirmará tu cita pronto.</p>
            </motion.div>
          ) : (
            <>
              {/* ── Banner precio ─────────────────────────────────────────── */}
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(13,110,253,0.06)', border: '1.5px solid rgba(13,110,253,0.12)' }}>
                <span className="text-sm font-medium" style={{ color: '#2D2B3D' }}>
                  {isFirstSession ? '🎉 Primera sesión — 30% descuento' : 'Sesión individual'}
                </span>
                <span className="font-bold" style={{ color: '#0D6EFD' }}>
                  ${isFirstSession ? 140 : 200} MXN
                  {isFirstSession && <span className="text-xs font-normal ml-1 line-through" style={{ color: '#9CA3AF' }}>$200</span>}
                </span>
              </div>

              {/* ── Info horario ──────────────────────────────────────────── */}
              <div className="flex items-center gap-2 text-xs" style={{ color: '#7A788F' }}>
                <Clock size={12} style={{ color: '#B8AFF0' }} />
                Lun–Vie · Mañana 9–14 h · Tarde 18–21 h · Sesiones de 1 hora
              </div>

              {/* ── Calendario ────────────────────────────────────────────── */}
              <div>
                {/* Nav mes */}
                <div className="flex items-center justify-between mb-3">
                  <button onClick={prevMonth} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#F4F2FF' }}>
                    <ChevronLeft size={16} style={{ color: '#7A788F' }} />
                  </button>
                  <span className="text-sm font-bold" style={{ color: '#2D2B3D' }}>
                    {MONTHS[calMonth]} {calYear}
                  </span>
                  <button onClick={nextMonth} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#F4F2FF' }}>
                    <ChevronRight size={16} style={{ color: '#7A788F' }} />
                  </button>
                </div>

                {/* Cabecera días */}
                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: '#B8AFF0' }}>{d}</div>
                  ))}
                </div>

                {/* Días */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfWk }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day     = i + 1
                    const dateStr = toDateStr(calYear, calMonth, day)
                    const isWkday = isWeekday(calYear, calMonth, day)
                    const isPast  = dateStr < todayStr
                    const avail   = isWkday && !isPast
                    const sel     = selDate === dateStr
                    const isToday = dateStr === todayStr
                    return (
                      <button
                        key={day}
                        onClick={() => avail && setSelDate(dateStr)}
                        disabled={!avail}
                        className="aspect-square rounded-xl text-xs font-semibold transition-all duration-150"
                        style={{
                          cursor:     avail ? 'pointer' : 'default',
                          background: sel ? '#0D6EFD' : isToday ? 'rgba(13,110,253,0.08)' : 'transparent',
                          color:      sel ? 'white' : avail ? '#2D2B3D' : '#D1D5DB',
                          border:     isToday && !sel ? '1.5px solid rgba(13,110,253,0.3)' : '1.5px solid transparent',
                          opacity:    avail ? 1 : 0.35,
                        }}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Slots de tiempo ───────────────────────────────────────── */}
              {selDate && (
                <div>
                  <p className="text-sm font-semibold mb-3 flex items-center gap-1.5" style={{ color: '#2D2B3D' }}>
                    <Clock size={14} style={{ color: '#0D6EFD' }} />
                    Horarios disponibles
                  </p>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center gap-2 py-6" style={{ color: '#B8AFF0' }}>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-xs">Cargando horarios…</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Mañana */}
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>🌅 Mañana</p>
                        <div className="grid grid-cols-3 gap-2">
                          {MORNING.map(slot => {
                            const taken = bookedSlots.includes(slot)
                            const sel   = selSlot === slot
                            return (
                              <button
                                key={slot}
                                onClick={() => !taken && setSelSlot(slot)}
                                disabled={taken}
                                className="py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
                                style={{
                                  cursor:     taken ? 'default' : 'pointer',
                                  background: sel ? '#0D6EFD' : taken ? '#F3F4F6' : 'rgba(13,110,253,0.06)',
                                  color:      sel ? 'white' : taken ? '#D1D5DB' : '#0D6EFD',
                                  border:     `1.5px solid ${sel ? '#0D6EFD' : taken ? 'transparent' : 'rgba(13,110,253,0.15)'}`,
                                  textDecoration: taken ? 'line-through' : 'none',
                                }}
                              >
                                {fmtSlot(slot)}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Tarde */}
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#9CA3AF' }}>🌆 Tarde</p>
                        <div className="grid grid-cols-4 gap-2">
                          {EVENING.map(slot => {
                            const taken = bookedSlots.includes(slot)
                            const sel   = selSlot === slot
                            return (
                              <button
                                key={slot}
                                onClick={() => !taken && setSelSlot(slot)}
                                disabled={taken}
                                className="py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
                                style={{
                                  cursor:     taken ? 'default' : 'pointer',
                                  background: sel ? '#0D6EFD' : taken ? '#F3F4F6' : 'rgba(13,110,253,0.06)',
                                  color:      sel ? 'white' : taken ? '#D1D5DB' : '#0D6EFD',
                                  border:     `1.5px solid ${sel ? '#0D6EFD' : taken ? 'transparent' : 'rgba(13,110,253,0.15)'}`,
                                  textDecoration: taken ? 'line-through' : 'none',
                                }}
                              >
                                {fmtSlot(slot)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Modalidad ─────────────────────────────────────────────── */}
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: '#2D2B3D' }}>Modalidad</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModality('online')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
                    style={{
                      background: modality === 'online' ? 'rgba(13,110,253,0.08)' : '#F9F9FF',
                      border:     `1.5px solid ${modality === 'online' ? '#0D6EFD' : 'rgba(184,175,240,0.3)'}`,
                      color:      modality === 'online' ? '#0D6EFD' : '#7A788F',
                    }}
                  >
                    <Video size={15} /> En línea
                  </button>

                  {presencialEnabled ? (
                    <button
                      onClick={() => setModality('presencial')}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
                      style={{
                        background: modality === 'presencial' ? 'rgba(13,110,253,0.08)' : '#F9F9FF',
                        border:     `1.5px solid ${modality === 'presencial' ? '#0D6EFD' : 'rgba(184,175,240,0.3)'}`,
                        color:      modality === 'presencial' ? '#0D6EFD' : '#7A788F',
                      }}
                    >
                      <MapPin size={15} /> Presencial
                    </button>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs text-center px-2"
                      style={{ background: 'rgba(242,167,184,0.1)', border: '1.5px solid rgba(242,167,184,0.35)', color: '#C07A8A' }}>
                      <WifiOff size={13} style={{ color: '#F2A7B8' }} />
                      <span className="font-semibold">No disponible</span>
                      <span style={{ opacity: 0.8 }}>Solo en línea</span>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {!presencialEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="mt-3 px-4 py-3 rounded-2xl flex items-start gap-3"
                        style={{ background: 'rgba(242,167,184,0.12)', border: '1.5px solid rgba(242,167,184,0.3)' }}>
                        <motion.span animate={{ rotate: [0,-10,10,-10,0] }} transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
                          className="text-lg flex-shrink-0">✈️</motion.span>
                        <div>
                          <p className="text-xs font-bold" style={{ color: '#2D2B3D' }}>Cristal está fuera por el momento</p>
                          <p className="text-xs mt-0.5" style={{ color: '#7A788F' }}>
                            Las sesiones presenciales no están disponibles, pero puedes agendar en línea con la misma calidad.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Motivo ────────────────────────────────────────────────── */}
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#2D2B3D' }}>
                  Motivo de consulta <span style={{ color: '#9CA3AF' }}>(opcional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                  placeholder="Cuéntame brevemente qué te trae aquí…"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#F4F2FF', border: '1.5px solid rgba(184,175,240,0.3)', color: '#2D2B3D' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')}
                />
              </div>

              {/* ── Error ─────────────────────────────────────────────────── */}
              {submitError && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-xs"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.2)', color: '#C04A4A' }}>
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  {submitError}
                </div>
              )}

              {/* ── Botón confirmar ───────────────────────────────────────── */}
              <motion.button
                onClick={handleSubmit}
                disabled={!selDate || !selSlot || submitting}
                whileHover={{ scale: (!selDate || !selSlot || submitting) ? 1 : 1.01, y: (!selDate || !selSlot || submitting) ? 0 : -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #0D6EFD, #9E94DF)', boxShadow: '0 4px 20px rgba(13,110,253,0.25)', cursor: (!selDate || !selSlot || submitting) ? 'not-allowed' : 'pointer' }}
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
