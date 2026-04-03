'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Video, AlertTriangle, Copy, Check, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AffectedAppt {
  id: string
  appointment_date: string
  start_time: string
  client_id: string
  profiles: { full_name: string; email?: string } | null
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
}
function formatTime(t: string) {
  const h = parseInt(t.split(':')[0])
  return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`
}

export function PresencialToggle() {
  const supabase = createClient()
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [affected, setAffected] = useState<AffectedAppt[]>([])
  const [loadingAffected, setLoadingAffected] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const fetchStatus = useCallback(async () => {
    const { data } = await (supabase as any).from('app_settings').select('value').eq('key', 'presencial_enabled').single()
    setEnabled(data?.value === true || data?.value === 'true')
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchStatus() }, [fetchStatus])

  const fetchAffected = useCallback(async () => {
    setLoadingAffected(true)
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await (supabase as any)
      .from('appointments')
      .select('id, appointment_date, start_time, client_id, profiles(full_name, email)')
      .eq('modality', 'presencial')
      .gte('appointment_date', today)
      .in('status', ['pending', 'confirmed'])
      .order('appointment_date', { ascending: true })
    setAffected((data as AffectedAppt[]) ?? [])
    setLoadingAffected(false)
  }, [supabase])

  const handleToggleClick = async () => {
    if (enabled) {
      // Va a desactivar — mostrar confirmación con citas afectadas
      setShowConfirm(true)
      fetchAffected()
    } else {
      // Va a activar — sin confirmación necesaria
      setSaving(true)
      await (supabase as any).from('app_settings').update({ value: true, updated_at: new Date().toISOString() }).eq('key', 'presencial_enabled')
      setEnabled(true)
      setSaving(false)
    }
  }

  const handleConfirmDisable = async () => {
    setSaving(true)
    const today = new Date().toISOString().slice(0, 10)

    // 1. Desactivar presencial
    await (supabase as any).from('app_settings').update({ value: false, updated_at: new Date().toISOString() }).eq('key', 'presencial_enabled')

    // 2. Cancelar citas presenciales futuras y notificar
    if (affected.length > 0) {
      const ids = affected.map(a => a.id)
      await supabase.from('appointments').update({ status: 'cancelled', updated_at: new Date().toISOString() }).in('id', ids)

      // 3. Insertar notificaciones in-app
      const notifications = affected.map(a => ({
        user_id: a.client_id,
        type: 'presencial_cancelled',
        title: 'Tu cita presencial fue cancelada',
        message: `Tu sesión del ${formatDate(a.appointment_date)} a las ${formatTime(a.start_time)} fue cancelada porque Cristal no está disponible de forma presencial. Puedes reagendarla en línea cuando quieras.`,
        appointment_id: a.id,
      }))
      await (supabase as any).from('notifications').insert(notifications)
    }

    setEnabled(false)
    setSaving(false)
    setShowConfirm(false)
    setShowMessage(true)
  }

  // Generar mensaje para copiar
  const emails = [...new Set(affected.map(a => a.profiles?.email).filter(Boolean))].join(', ')
  const copyMessage = `Hola 👋 Te escribo para informarte que por el momento estaré fuera, por lo que las citas presenciales no estarán disponibles temporalmente. Si tenías una cita presencial agendada, fue cancelada automáticamente. Puedes reagendarla en línea desde tu portal: https://tuespacioconcristal.space/dashboard — ¡Lamento los inconvenientes y espero verte pronto! 💙`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return null

  return (
    <>
      {/* Card */}
      <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(184,175,240,0.2)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: enabled ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)' }}
            >
              {enabled ? <MapPin size={18} style={{ color: '#10B981' }} /> : <Video size={18} style={{ color: '#0D6EFD' }} />}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#2D2B3D' }}>Modo de atención</p>
              <p className="text-xs" style={{ color: enabled ? '#10B981' : '#7A788F' }}>
                {enabled ? 'Presencial + En línea activos' : 'Solo en línea'}
              </p>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={handleToggleClick}
            disabled={saving}
            className="relative flex-shrink-0 cursor-pointer disabled:opacity-60"
            style={{ width: 52, height: 28 }}
          >
            <div
              className="absolute inset-0 rounded-full transition-colors duration-300"
              style={{ background: enabled ? '#10B981' : '#D1D5DB' }}
            />
            <motion.div
              animate={{ x: enabled ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
            />
            {saving && <Loader2 size={12} className="absolute inset-0 m-auto animate-spin text-white" />}
          </button>
        </div>

        <AnimatePresence>
          {!enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 px-3 py-2.5 rounded-xl flex items-center gap-2" style={{ background: 'rgba(13,110,253,0.06)', border: '1px solid rgba(13,110,253,0.12)' }}>
                <Video size={13} style={{ color: '#0D6EFD' }} />
                <p className="text-xs" style={{ color: '#7A788F' }}>
                  Los clientes solo pueden agendar sesiones en línea. Activa el toggle para habilitar presencial.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de confirmación para desactivar */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45,43,61,0.55)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ ease: [0.22, 1, 0.36, 1] as [number,number,number,number], duration: 0.35 }}
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{ background: 'white', boxShadow: '0 24px 64px rgba(13,110,253,0.2)' }}
            >
              <div className="px-6 pt-6 pb-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                      <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#2D2B3D' }}>Desactivar modo presencial</p>
                      <p className="text-xs" style={{ color: '#7A788F' }}>Esta acción afecta citas ya agendadas</p>
                    </div>
                  </div>
                  <button onClick={() => setShowConfirm(false)} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#F4F2FF' }}>
                    <X size={14} style={{ color: '#7A788F' }} />
                  </button>
                </div>

                {loadingAffected ? (
                  <div className="py-6 flex justify-center">
                    <Loader2 size={20} className="animate-spin" style={{ color: '#B8AFF0' }} />
                  </div>
                ) : affected.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-sm" style={{ color: '#7A788F' }}>No hay citas presenciales futuras activas.</p>
                    <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Puedes desactivar el modo sin afectar a nadie.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <p className="text-xs font-semibold" style={{ color: '#92400E' }}>
                        {affected.length} cita{affected.length > 1 ? 's' : ''} presencial{affected.length > 1 ? 'es' : ''} {affected.length > 1 ? 'serán canceladas' : 'será cancelada'} automáticamente
                      </p>
                    </div>

                    <div className="space-y-2 max-h-36 overflow-y-auto mb-4">
                      {affected.map(a => (
                        <div key={a.id} className="flex items-center gap-2 text-xs py-1.5 px-3 rounded-xl" style={{ background: '#F9F9FF' }}>
                          <MapPin size={11} style={{ color: '#B8AFF0' }} />
                          <span className="font-medium" style={{ color: '#2D2B3D' }}>{a.profiles?.full_name ?? 'Cliente'}</span>
                          <span style={{ color: '#7A788F' }}>—</span>
                          <span style={{ color: '#7A788F' }}>{formatDate(a.appointment_date)} · {formatTime(a.start_time)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <p className="text-xs mb-5" style={{ color: '#7A788F' }}>
                  Se enviarán notificaciones dentro de la plataforma a los clientes afectados para que puedan reagendar en línea.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold cursor-pointer"
                    style={{ background: '#F4F2FF', color: '#7A788F' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDisable}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold text-white cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #EF4444, #F59E0B)' }}
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    {saving ? 'Procesando…' : 'Confirmar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal con mensaje para difundir */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45,43,61,0.55)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ ease: [0.22, 1, 0.36, 1] as [number,number,number,number], duration: 0.35 }}
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{ background: 'white', boxShadow: '0 24px 64px rgba(13,110,253,0.2)' }}
            >
              <div className="px-6 pt-6 pb-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold" style={{ color: '#2D2B3D' }}>Modo presencial desactivado ✅</p>
                  <button onClick={() => setShowMessage(false)} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#F4F2FF' }}>
                    <X size={14} style={{ color: '#7A788F' }} />
                  </button>
                </div>

                <p className="text-xs" style={{ color: '#7A788F' }}>
                  Las notificaciones in-app ya fueron enviadas. Si quieres difundir esto por WhatsApp o correo, copia el mensaje y los correos de abajo.
                </p>

                {/* Mensaje */}
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: '#7A788F' }}>Mensaje listo para copiar</p>
                  <div className="relative">
                    <div className="px-3 py-3 rounded-xl text-xs leading-relaxed" style={{ background: '#F4F2FF', color: '#2D2B3D' }}>
                      {copyMessage}
                    </div>
                    <button
                      onClick={() => handleCopy(copyMessage)}
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      style={{ background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(13,110,253,0.1)', color: copied ? '#10B981' : '#0D6EFD' }}
                    >
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Correos */}
                {emails && (
                  <div>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: '#7A788F' }}>Correos (para BCC en Gmail)</p>
                    <div className="relative">
                      <div className="px-3 py-3 rounded-xl text-xs break-all" style={{ background: '#F4F2FF', color: '#2D2B3D' }}>
                        {emails}
                      </div>
                      <button
                        onClick={() => handleCopy(emails)}
                        className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                        style={{ background: 'rgba(13,110,253,0.1)', color: '#0D6EFD' }}
                      >
                        <Copy size={11} /> Copiar
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowMessage(false)}
                  className="w-full py-3 rounded-2xl text-sm font-semibold cursor-pointer"
                  style={{ background: '#F4F2FF', color: '#7A788F' }}
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
