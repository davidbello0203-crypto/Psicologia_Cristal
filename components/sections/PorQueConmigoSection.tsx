'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer, scaleIn, inViewConfig } from '@/lib/motion'
import { Heart, Lock, Smile, RefreshCw } from 'lucide-react'

const iconMap = {
  Heart,
  Lock,
  Smile,
  RefreshCw,
}

const valueCards = [
  {
    icon: 'Heart' as const,
    title: 'Empatía',
    description: 'Te escucho sin juzgarte, en un espacio 100% seguro y lleno de comprensión.',
    color: '#F2A7B8',
    bg: 'rgba(242,167,184,0.12)',
  },
  {
    icon: 'Lock' as const,
    title: 'Confidencialidad',
    description: 'Todo lo que compartes se queda entre nosotros. Tu privacidad es sagrada.',
    color: '#A8D8EA',
    bg: 'rgba(168,216,234,0.12)',
  },
  {
    icon: 'Smile' as const,
    title: 'Sin prejuicios',
    description: 'Aquí puedes ser tú mismo/a con total libertad, sin miedo a ser criticado/a.',
    color: '#0D6EFD',
    bg: 'rgba(13,110,253,0.1)',
  },
  {
    icon: 'RefreshCw' as const,
    title: 'Seguimiento',
    description: 'Doy seguimiento a tu proceso en cada sesión para acompañar tu crecimiento.',
    color: '#B8AFF0',
    bg: 'rgba(184,175,240,0.15)',
  },
]

export function PorQueConmigoSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)

  return (
    <section
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: '#F4F2FF' }}
    >
      {/* Background decoration */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: '#B8AFF0' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
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
            Por qué elegirme
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: '#2D2B3D' }}
          >
            ¿Por qué conmigo?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg max-w-xl mx-auto"
            style={{ color: '#7A788F' }}
          >
            Cada persona merece un espacio donde sentirse comprendida y acompañada en su proceso.
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {valueCards.map((card) => {
            const Icon = iconMap[card.icon]
            return (
              <motion.div
                key={card.title}
                variants={scaleIn}
                className="group rounded-3xl p-7 transition-all duration-300 cursor-default"
                style={{
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(13,110,253,0.08)',
                  border: '1.5px solid rgba(184,175,240,0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(13,110,253,0.15)'
                  e.currentTarget.style.borderColor = 'rgba(184,175,240,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,110,253,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(184,175,240,0.2)'
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: card.bg }}
                >
                  <Icon size={24} style={{ color: card.color }} aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3" style={{ color: '#2D2B3D' }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed font-body" style={{ color: '#7A788F' }}>
                  {card.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
