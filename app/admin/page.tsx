'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Users, TrendingUp, DollarSign, CheckCircle2,
  Clock, XCircle, AlertCircle, LogOut, ChevronDown,
  ChevronUp, FileText, MessageCircle, Video, MapPin,
  ShieldCheck, Plus, Save, Loader2, RefreshCw,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import type { Appointment, Profile, ClinicalNote } from '@/types/database'

type AppointmentWithProfile = Appointment & { profiles: Profile }

const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',  color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',   icon: AlertCircle },
  confirmed: { label: 'Confirmada', color: '#10B981', bg: 'rgba(16,185,129,0.1)',   icon: CheckCircle2 },
  cancelled: { label: 'Cancelada',  color: '#EF4444', bg: 'rgba(239,68,68,0.1)',    icon: XCircle },
  completed: { label: 'Completada', color: '#0D6EFD', bg: 'rgba(13,110,253,0.1)',  icon: CheckCircle2 },
  no_show:   { label: 'No asistió', color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', icon: XCircle },
} as const

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' })
}
function formatTime(t: string) {
  const [h, m] = t.split(':')
  const hour = parseInt(h)
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(184,175,240,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold font-heading" style={{ color: '#2D2B3D' }}>{value}</p>
      <p className="text-xs font-medium mt-0.5" style={{ color: '#7A788F' }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color }}>{sub}</p>}
    </div>
  )
}

// ── Client Notes Panel ─────────────────────────────────────────
function ClientNotesPanel({ clientId, clientName }: { clientId: string; clientName: string }) {
  const supabase = createClient()
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    const { data } = await supabase.from('clinical_notes').select('*').eq('client_id', clientId).order('created_at', { ascending: false })
    setNotes(data ?? [])
    setLoading(false)
  }, [clientId, supabase])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const saveNote = async () => {
    if (!newNote.trim()) return
    setSaving(true)
    await supabase.from('clinical_notes').insert({ client_id: clientId, content: newNote.trim() })
    setNewNote('')
    await fetchNotes()
    setSaving(false)
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7A788F' }}>
        <FileText size={12} className="inline mr-1" />
        Notas clínicas — {clientName}
      </p>

      <div className="flex gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={2}
          placeholder="Agregar nota clínica…"
          className="flex-1 px-3 py-2 rounded-xl text-xs outline-none resize-none"
          style={{ background: '#F4F2FF', border: '1.5px solid rgba(184,175,240,0.3)', color: '#2D2B3D' }}
        />
        <button
          onClick={saveNote}
          disabled={saving || !newNote.trim()}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer disabled:opacity-40 flex items-center gap-1"
          style={{ background: '#0D6EFD', flexShrink: 0 }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Guardar
        </button>
      </div>

      {loading ? (
        <p className="text-xs" style={{ color: '#B8AFF0' }}>Cargando…</p>
      ) : notes.length === 0 ? (
        <p className="text-xs" style={{ color: '#9CA3AF' }}>Sin notas aún.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {notes.map((n) => (
            <div key={n.id} className="px-3 py-2.5 rounded-xl" style={{ background: '#F4F2FF' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#2D2B3D' }}>{n.content}</p>
              <p className="text-[10px] mt-1" style={{ color: '#9CA3AF' }}>
                {n.created_at ? new Date(n.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Appointment Row ────────────────────────────────────────────
function AppointmentRow({ appt, onStatusChange }: {
  appt: AppointmentWithProfile
  onStatusChange: (id: string, status: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const statusKey = (appt.status ?? 'pending') as keyof typeof STATUS_CONFIG
  const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending
  const StatusIcon = cfg.icon

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(184,175,240,0.15)' }}>
      <div
        className="px-5 py-4 flex items-center gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Date/time */}
        <div className="flex-shrink-0 w-14 text-center">
          <p className="text-lg font-bold leading-none" style={{ color: '#0D6EFD' }}>
            {new Date(appt.appointment_date + 'T00:00:00').getDate()}
          </p>
          <p className="text-[10px] uppercase" style={{ color: '#B8AFF0' }}>
            {new Date(appt.appointment_date + 'T00:00:00').toLocaleDateString('es-MX', { month: 'short' })}
          </p>
        </div>

        <div className="w-px h-10 flex-shrink-0" style={{ background: 'rgba(184,175,240,0.25)' }} />

        {/* Client */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: '#2D2B3D' }}>
            {appt.profiles?.full_name ?? 'Cliente'}
          </p>
          <p className="text-xs" style={{ color: '#7A788F' }}>
            {formatTime(appt.start_time)} •{' '}
            {appt.modality === 'online' ? <Video size={10} className="inline" /> : <MapPin size={10} className="inline" />}
            {' '}{appt.modality === 'online' ? 'En línea' : 'Presencial'}
          </p>
        </div>

        {/* Status */}
        <span
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          <StatusIcon size={11} />
          {cfg.label}
        </span>

        {/* Price */}
        <span className="text-sm font-bold flex-shrink-0" style={{ color: '#2D2B3D' }}>
          ${appt.session_price}
        </span>

        {expanded ? <ChevronUp size={16} style={{ color: '#B8AFF0' }} /> : <ChevronDown size={16} style={{ color: '#B8AFF0' }} />}
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t space-y-4" style={{ borderColor: 'rgba(184,175,240,0.15)' }}>
              <div className="pt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p style={{ color: '#9CA3AF' }}>Teléfono</p>
                  <p className="font-medium" style={{ color: '#2D2B3D' }}>{appt.profiles?.phone ?? '—'}</p>
                </div>
                <div>
                  <p style={{ color: '#9CA3AF' }}>Primera sesión</p>
                  <p className="font-medium" style={{ color: '#2D2B3D' }}>{appt.is_first_session ? 'Sí (30% dto)' : 'No'}</p>
                </div>
                {appt.reason && (
                  <div className="col-span-2">
                    <p style={{ color: '#9CA3AF' }}>Motivo</p>
                    <p className="font-medium" style={{ color: '#2D2B3D' }}>{appt.reason}</p>
                  </div>
                )}
              </div>

              {/* Status actions */}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#7A788F' }}>Cambiar estado</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG)
                    .filter(([k]) => k !== appt.status)
                    .map(([status, cfg]) => (
                      <button
                        key={status}
                        onClick={() => onStatusChange(appt.id, status)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </button>
                    ))}
                </div>
              </div>

              {/* Clinical notes */}
              {appt.profiles && (
                <ClientNotesPanel clientId={appt.client_id} clientName={appt.profiles.full_name} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Admin Page ────────────────────────────────────────────
export default function AdminPage() {
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [appointments, setAppointments] = useState<AppointmentWithProfile[]>([])
  const [clients, setClients] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all' | 'clients'>('today')
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    const [{ data: appts }, { data: clientData }] = await Promise.all([
      supabase
        .from('appointments')
        .select('*, profiles(*)')
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true }),
      supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false }),
    ])
    setAppointments((appts as AppointmentWithProfile[]) ?? [])
    setClients(clientData ?? [])
    setLoading(false)
    setRefreshing(false)
  }, [supabase])

  useEffect(() => {
    fetchData()
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchData)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchData, supabase])

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  const handleSignOut = async () => { await signOut(); router.push('/') }

  const todayStr = new Date().toISOString().slice(0, 10)
  const todayAppts = appointments.filter((a) => a.appointment_date === todayStr)
  const upcomingAppts = appointments.filter((a) => a.appointment_date > todayStr && (a.status === 'pending' || a.status === 'confirmed'))

  // Stats
  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthAppts = appointments.filter((a) => a.appointment_date.startsWith(thisMonth))
  const monthRevenue = monthAppts.filter((a) => a.status === 'completed').reduce((s, a) => s + (a.session_price ?? 0), 0)
  const pendingCount = appointments.filter((a) => a.status === 'pending').length

  const tabAppts: Record<string, AppointmentWithProfile[]> = {
    today: todayAppts,
    upcoming: upcomingAppts,
    all: appointments,
    clients: [],
  }

  return (
    <div className="min-h-screen" style={{ background: '#F4F2FF' }}>
      {/* Sidebar-less admin header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40" style={{ borderColor: 'rgba(184,175,240,0.2)', boxShadow: '0 1px 8px rgba(13,110,253,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #0D6EFD, #B8AFF0)' }}>
            <ShieldCheck size={16} />
          </div>
          <div>
            <p className="text-sm font-bold leading-none" style={{ color: '#2D2B3D' }}>Panel Admin</p>
            <p className="text-xs" style={{ color: '#7A788F' }}>Psic. {profile?.full_name?.split(' ')[0]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setRefreshing(true); fetchData() }}
            className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            style={{ background: '#F4F2FF' }}
            aria-label="Actualizar"
          >
            <RefreshCw size={14} style={{ color: '#7A788F' }} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <Link href="/" className="text-xs font-medium hidden sm:block" style={{ color: '#7A788F' }}>Sitio web</Link>
          <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs font-medium cursor-pointer px-3 py-2 rounded-xl" style={{ color: '#7A788F' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F2FF')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Calendar} label="Hoy" value={todayAppts.length} sub={todayAppts.length > 0 ? 'sesiones' : 'Sin sesiones'} color="#0D6EFD" />
          <StatCard icon={AlertCircle} label="Pendientes" value={pendingCount} sub="Por confirmar" color="#F59E0B" />
          <StatCard icon={DollarSign} label="Ingresos mes" value={`$${monthRevenue}`} sub="MXN completadas" color="#10B981" />
          <StatCard icon={Users} label="Clientes" value={clients.length} sub="Registrados" color="#B8AFF0" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto" style={{ background: 'rgba(184,175,240,0.15)' }}>
          {[
            { key: 'today', label: `Hoy (${todayAppts.length})` },
            { key: 'upcoming', label: `Próximas (${upcomingAppts.length})` },
            { key: 'all', label: `Todas (${appointments.length})` },
            { key: 'clients', label: `Clientes (${clients.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
              style={{
                background: activeTab === key ? 'white' : 'transparent',
                color: activeTab === key ? '#0D6EFD' : '#7A788F',
                boxShadow: activeTab === key ? '0 2px 8px rgba(13,110,253,0.1)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12" style={{ color: '#B8AFF0' }}>
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            Cargando datos…
          </div>
        ) : activeTab === 'clients' ? (
          <div className="space-y-3">
            {clients.length === 0 ? (
              <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px dashed rgba(184,175,240,0.4)' }}>
                <Users size={32} className="mx-auto mb-3" style={{ color: '#B8AFF0' }} />
                <p className="text-sm" style={{ color: '#7A788F' }}>Aún no hay clientes registrados.</p>
              </div>
            ) : clients.map((client) => {
              const clientAppts = appointments.filter((a) => a.client_id === client.id)
              const lastAppt = clientAppts[0]
              const totalSessions = clientAppts.filter((a) => a.status === 'completed').length
              return (
                <div key={client.id} className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(184,175,240,0.2)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #0D6EFD, #B8AFF0)' }}>
                        {client.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#2D2B3D' }}>{client.full_name}</p>
                        <p className="text-xs" style={{ color: '#7A788F' }}>{client.phone ?? 'Sin teléfono'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: '#10B981' }}>{totalSessions} sesiones</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>completadas</p>
                    </div>
                  </div>
                  {lastAppt && (
                    <p className="text-xs mb-3" style={{ color: '#7A788F' }}>
                      Última cita: {formatDate(lastAppt.appointment_date)}
                    </p>
                  )}
                  <ClientNotesPanel clientId={client.id} clientName={client.full_name} />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {tabAppts[activeTab].length === 0 ? (
              <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px dashed rgba(184,175,240,0.4)' }}>
                <Calendar size={32} className="mx-auto mb-3" style={{ color: '#B8AFF0' }} />
                <p className="text-sm" style={{ color: '#7A788F' }}>
                  {activeTab === 'today' ? 'No hay sesiones programadas para hoy.' : 'No hay citas en esta sección.'}
                </p>
              </div>
            ) : (
              tabAppts[activeTab].map((appt) => (
                <AppointmentRow key={appt.id} appt={appt} onStatusChange={handleStatusChange} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
