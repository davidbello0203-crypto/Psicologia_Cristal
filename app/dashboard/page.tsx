'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Video, MapPin, LogOut, Plus, User,
  CheckCircle2, XCircle, AlertCircle, ChevronRight,
  Sparkles, Heart, Phone, MessageCircle, Camera, Loader2,
} from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import type { Appointment } from '@/types/database'
import { BookingModal } from '@/components/dashboard/BookingModal'
import { AvatarCropModal } from '@/components/dashboard/AvatarCropModal'

const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',   color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  icon: AlertCircle },
  confirmed: { label: 'Confirmada',  color: '#10B981', bg: 'rgba(16,185,129,0.1)',  icon: CheckCircle2 },
  cancelled: { label: 'Cancelada',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   icon: XCircle },
  completed: { label: 'Completada',  color: '#0D6EFD', bg: 'rgba(13,110,253,0.1)', icon: CheckCircle2 },
  no_show:   { label: 'No asistió',  color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', icon: XCircle },
} as const

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h)
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

function AppointmentCard({ appt, onCancel }: { appt: Appointment; onCancel: (id: string) => void }) {
  const statusKey = (appt.status ?? 'pending') as keyof typeof STATUS_CONFIG
  const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending
  const StatusIcon = cfg.icon
  const isUpcoming = appt.status === 'pending' || appt.status === 'confirmed'
  const isPast = appt.status === 'completed' || appt.status === 'cancelled' || appt.status === 'no_show'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        border: '1px solid rgba(184,175,240,0.2)',
        boxShadow: isUpcoming ? '0 4px 20px rgba(13,110,253,0.08)' : 'none',
        opacity: isPast ? 0.7 : 1,
      }}
    >
      {/* Color accent top */}
      {isUpcoming && (
        <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${cfg.color}, #B8AFF0)` }} />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              <StatusIcon size={11} aria-hidden="true" />
              {cfg.label}
            </span>
            {appt.is_first_session && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(242,167,184,0.15)', color: '#C07A8A' }}>
                <Sparkles size={10} /> Primera sesión
              </span>
            )}
          </div>
          <span className="text-xs font-medium" style={{ color: '#7A788F' }}>
            {appt.modality === 'online'
              ? <span className="flex items-center gap-1"><Video size={11} /> En línea</span>
              : <span className="flex items-center gap-1"><MapPin size={11} /> Presencial</span>
            }
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <Calendar size={14} style={{ color: '#0D6EFD' }} />
          <span className="text-sm font-semibold capitalize" style={{ color: '#2D2B3D' }}>
            {formatDate(appt.appointment_date)}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={14} style={{ color: '#0D6EFD' }} />
          <span className="text-sm" style={{ color: '#7A788F' }}>
            {formatTime(appt.start_time)} — {formatTime(appt.end_time)}
          </span>
        </div>

        {appt.reason && (
          <p className="text-xs px-3 py-2 rounded-xl mb-3" style={{ background: '#F4F2FF', color: '#7A788F' }}>
            {appt.reason}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: '#2D2B3D' }}>
            ${appt.is_first_session
              ? ((appt.session_price ?? 200) * 0.7).toFixed(0)
              : (appt.session_price ?? 200).toFixed(0)
            } MXN
            {appt.is_first_session && (
              <span className="text-xs font-normal ml-1 line-through" style={{ color: '#9CA3AF' }}>$200</span>
            )}
          </span>

          {appt.status === 'pending' && (
            <button
              onClick={() => onCancel(appt.id)}
              className="text-xs font-medium cursor-pointer transition-colors duration-150"
              style={{ color: '#EF4444' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C04A4A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#EF4444')}
            >
              Cancelar cita
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const fetchAppointments = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', user.id)
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false })
    setAppointments(data ?? [])
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    if (profile?.role === 'admin') {
      window.location.href = '/admin'
    }
  }, [profile])

  useEffect(() => {
    fetchAppointments()
    // Real-time updates
    const channel = supabase
      .channel('client-appointments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `client_id=eq.${user?.id}`,
      }, () => fetchAppointments())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, fetchAppointments, supabase])

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleCropSave = async (blob: Blob) => {
    if (!user) return
    setUploadingAvatar(true)
    try {
      const path = `${user.id}/avatar.jpg`
      const { error: uploadError } = await Promise.race([
        supabase.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg' }),
        new Promise<{ error: Error }>(resolve => setTimeout(() => resolve({ error: new Error('timeout') }), 15000)),
      ]) as { error: Error | null }

      if (uploadError) {
        alert('Error al subir la foto: ' + uploadError.message)
        return
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const bustUrl = `${data.publicUrl}?t=${Date.now()}`
      await supabase.from('profiles').update({ avatar_url: bustUrl }).eq('id', user.id)
      refreshProfile() // fire and forget
      setCropSrc(null)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('¿Seguro que deseas cancelar esta cita?')) return
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
    fetchAppointments()
  }

  const handleSignOut = () => {
    signOut()
    window.location.href = '/'
  }

  const upcoming = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed')
  const past = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled' || a.status === 'no_show')
  const nextAppt = upcoming[upcoming.length - 1]
  const completedCount = appointments.filter((a) => a.status === 'completed').length
  const hasFirstSession = appointments.some((a) => a.is_first_session)

  return (
    <div className="min-h-screen" style={{ background: '#F4F2FF' }}>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40" style={{ borderColor: 'rgba(184,175,240,0.2)', boxShadow: '0 1px 8px rgba(13,110,253,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 relative" style={{ background: 'linear-gradient(135deg, #0D6EFD, #B8AFF0)' }}>
            {profile?.avatar_url
              ? <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
              : <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">{profile?.full_name?.charAt(0) ?? 'U'}</span>
            }
          </div>
          <div>
            <p className="text-sm font-bold leading-none" style={{ color: '#2D2B3D' }}>{profile?.full_name}</p>
            <p className="text-xs" style={{ color: '#7A788F' }}>Portal de cliente</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs font-medium" style={{ color: '#7A788F' }}>
            ← Inicio
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-3 py-2 rounded-xl transition-colors border"
            style={{ color: '#C04A4A', borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.05)')}
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D6EFD 0%, #7B6FD0 50%, #B8AFF0 100%)' }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 -translate-y-8 translate-x-8" style={{ background: '#F2A7B8' }} />
          <p className="text-white/70 text-sm mb-1">Hola,</p>
          <h1 className="font-heading text-2xl font-bold mb-4">
            {profile?.full_name?.split(' ')[0] ?? 'Bienvenida'} 👋
          </h1>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-white/70 text-xs">Sesiones completadas</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-2xl font-bold">{upcoming.length}</p>
              <p className="text-white/70 text-xs">Próximas citas</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-2xl font-bold">{hasFirstSession ? '30%' : '0%'}</p>
              <p className="text-white/70 text-xs">Descuento aplicado</p>
            </div>
          </div>
        </motion.div>

        {/* Next appointment quick card */}
        {nextAppt && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: 'white', border: '1.5px solid rgba(13,110,253,0.15)', boxShadow: '0 4px 20px rgba(13,110,253,0.08)' }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(13,110,253,0.1)' }}>
              <Calendar size={22} style={{ color: '#0D6EFD' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#0D6EFD' }}>Próxima sesión</p>
              <p className="text-sm font-bold truncate capitalize" style={{ color: '#2D2B3D' }}>{formatDate(nextAppt.appointment_date)}</p>
              <p className="text-xs" style={{ color: '#7A788F' }}>{formatTime(nextAppt.start_time)} • {nextAppt.modality === 'online' ? 'En línea' : 'Presencial'}</p>
            </div>
            <ChevronRight size={18} style={{ color: '#B8AFF0' }} />
          </motion.div>
        )}

        {/* Book new appointment CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setShowBooking(true)}
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #0D6EFD, #9E94DF)',
            boxShadow: '0 4px 20px rgba(13,110,253,0.25)',
          }}
        >
          <Plus size={18} />
          Reservar nueva cita
        </motion.button>

        {/* Appointment tabs */}
        <div>
          <div className="flex gap-1 p-1 rounded-2xl mb-4" style={{ background: 'rgba(184,175,240,0.15)' }}>
            {(['upcoming', 'past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: activeTab === tab ? 'white' : 'transparent',
                  color: activeTab === tab ? '#0D6EFD' : '#7A788F',
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(13,110,253,0.1)' : 'none',
                }}
              >
                {tab === 'upcoming' ? `Próximas (${upcoming.length})` : `Historial (${past.length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-10" style={{ color: '#B8AFF0' }}>Cargando citas…</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'upcoming' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {(activeTab === 'upcoming' ? upcoming : past).length === 0 ? (
                  <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px dashed rgba(184,175,240,0.4)' }}>
                    <Calendar size={32} className="mx-auto mb-3" style={{ color: '#B8AFF0' }} />
                    <p className="text-sm font-medium" style={{ color: '#7A788F' }}>
                      {activeTab === 'upcoming'
                        ? 'No tienes citas próximas'
                        : 'Aún no tienes sesiones anteriores'
                      }
                    </p>
                    {activeTab === 'upcoming' && (
                      <button
                        onClick={() => setShowBooking(true)}
                        className="mt-3 text-sm font-semibold cursor-pointer"
                        style={{ color: '#0D6EFD' }}
                      >
                        Reservar mi primera sesión →
                      </button>
                    )}
                  </div>
                ) : (
                  (activeTab === 'upcoming' ? [...upcoming].reverse() : past).map((appt) => (
                    <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Info section */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: 'white', border: '1px solid rgba(184,175,240,0.2)' }}>
          <h3 className="font-heading font-bold text-sm" style={{ color: '#2D2B3D' }}>¿Necesitas contactarme?</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={`https://wa.me/527471432188?text=Hola Cristal, soy ${profile?.full_name ?? ''} y tengo una consulta.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
              style={{ background: 'rgba(37,211,102,0.1)', color: '#1a9e50', border: '1.5px solid rgba(37,211,102,0.2)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(37,211,102,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(37,211,102,0.1)')}
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/psic.cris_hernandez"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
              style={{ background: 'rgba(184,175,240,0.15)', color: '#0D6EFD', border: '1.5px solid rgba(184,175,240,0.3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184,175,240,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(184,175,240,0.15)')}
            >
              <Heart size={15} />
              Instagram
            </a>
          </div>
        </div>

        {/* Profile */}
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(184,175,240,0.2)' }}>
          <h3 className="font-heading font-bold text-sm mb-4" style={{ color: '#2D2B3D' }}>Mi perfil</h3>
          <div className="flex items-center gap-4">
            {/* Avatar with upload */}
            <label className="relative cursor-pointer group flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0D6EFD, #B8AFF0)' }}>
                {profile?.avatar_url
                  ? <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                  : <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">{profile?.full_name?.charAt(0) ?? 'U'}</span>
                }
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(13,110,253,0.6)' }}>
                  {uploadingAvatar
                    ? <Loader2 size={18} className="text-white animate-spin" />
                    : <Camera size={18} className="text-white" />
                  }
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileSelect}
                disabled={uploadingAvatar}
              />
            </label>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2" style={{ color: '#2D2B3D' }}>
                <User size={13} style={{ color: '#B8AFF0' }} />
                <span className="font-medium">{profile?.full_name}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-2" style={{ color: '#7A788F' }}>
                  <Phone size={13} style={{ color: '#B8AFF0' }} />
                  {profile.phone}
                </div>
              )}
              <p className="text-xs" style={{ color: '#B8AFF0' }}>
                Toca la foto para cambiarla
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Booking modal */}
      <AnimatePresence>
        {showBooking && (
          <BookingModal
            onClose={() => setShowBooking(false)}
            onSuccess={() => { setShowBooking(false); fetchAppointments() }}
            isFirstSession={appointments.length === 0}
          />
        )}
      </AnimatePresence>

      {/* Avatar crop modal */}
      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          onCancel={() => setCropSrc(null)}
          onSave={handleCropSave}
          saving={uploadingAvatar}
        />
      )}
    </div>
  )
}
