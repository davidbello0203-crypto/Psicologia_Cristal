'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { fadeInUp, staggerContainer, inViewConfig } from '@/lib/motion'
import { UserPlus, CalendarCheck, TrendingUp, ArrowRight, CalendarPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookingModal } from '@/components/dashboard/BookingModal'

const steps = [
  {
    number: '01',
    title: 'Crea tu cuenta',
    description: 'Regístrate en la plataforma en menos de un minuto. Solo necesitas tu correo y una contraseña.',
    icon: UserPlus,
    color: '#0D6EFD',
    bg: 'rgba(13,110,253,0.1)',
  },
  {
    number: '02',
    title: 'Agenda tu sesión',
    description: 'Elige el día y horario que mejor te acomode en el calendario. Los espacios se actualizan en tiempo real.',
    icon: CalendarCheck,
    color: '#A8D8EA',
    bg: 'rgba(168,216,234,0.15)',
  },
  {
    number: '03',
    title: 'Comienza tu proceso',
    description: 'Asiste a tu sesión y trabaja con Cristal en tu bienestar emocional con seguimiento personalizado.',
    icon: TrendingUp,
    color: '#F2A7B8',
    bg: 'rgba(242,167,184,0.15)',
  },
]

export function ProcesoAtencionSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [showModal, setShowModal] = useState(false)
  const [isFirstSession, setIsFirstSession] = useState(false)

  const handleAgendar = async () => {
    if (!user) { router.push('/registro'); return }
    const { data } = await supabase.from('appointments').select('id').eq('client_id', user.id).limit(1)
    setIsFirstSession(!data || data.length === 0)
    setShowModal(true)
  }

  return (
    <>
      <section
        ref={ref}
        className="py-24 overflow-hidden relative"
        style={{ background: '#FFFFFF' }}
      >
        <div
          className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: '#A8D8EA' }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-sm font-body font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#0D6EFD' }}
            >
              Cómo funciona
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: '#2D2B3D' }}
            >
              Empieza en 3 pasos
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg max-w-xl mx-auto"
              style={{ color: '#7A788F' }}
            >
              Comenzar tu proceso terapéutico es simple. Todo desde esta plataforma, sin llamadas ni esperas.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative flex items-start gap-0">
                  <motion.div variants={fadeInUp} className="flex-1 text-center relative">
                    <div className="flex justify-center mb-5">
                      <div className="relative">
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center"
                          style={{ background: step.bg, border: `2px solid ${step.color}30` }}
                        >
                          <Icon size={28} style={{ color: step.color }} aria-hidden="true" />
                        </div>
                        <span
                          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-bold text-white"
                          style={{ background: step.color }}
                        >
                          {step.number}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3" style={{ color: '#2D2B3D' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed font-body" style={{ color: '#7A788F' }}>
                      {step.description}
                    </p>
                  </motion.div>

                  {index < steps.length - 1 && (
                    <div className="hidden md:flex items-center justify-center absolute -right-4 top-10 z-10" aria-hidden="true">
                      <ArrowRight size={20} style={{ color: '#B8AFF0' }} />
                    </div>
                  )}
                </div>
              )
            })}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.5 }}
            className="text-center mt-14"
          >
            <motion.button
              onClick={handleAgendar}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-body font-semibold text-base text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              style={{
                background: 'linear-gradient(135deg, #0D6EFD 0%, #B8AFF0 100%)',
                boxShadow: '0 8px 30px rgba(13,110,253,0.25)',
              }}
            >
              <CalendarPlus size={18} aria-hidden="true" />
              {user ? 'Agendar mi sesión' : 'Comenzar ahora'}
            </motion.button>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <BookingModal
            onClose={() => setShowModal(false)}
            onSuccess={() => setShowModal(false)}
            isFirstSession={isFirstSession}
          />
        )}
      </AnimatePresence>
    </>
  )
}
