'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer, inViewConfig } from '@/lib/motion'
import { MessageCircle, Calendar, TrendingUp, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

const steps = [
  {
    number: '01',
    title: 'Contáctame',
    description:
      'Escríbeme por WhatsApp o Instagram. Cuéntame brevemente cómo te sientes y agendamos juntos tu primera cita.',
    icon: MessageCircle,
    color: '#0D6EFD',
    bg: 'rgba(13,110,253,0.1)',
  },
  {
    number: '02',
    title: 'Primera sesión',
    description:
      'Nos conocemos, exploramos tu historia y establecemos los objetivos de tu proceso terapéutico en un ambiente cálido.',
    icon: Calendar,
    color: '#A8D8EA',
    bg: 'rgba(168,216,234,0.15)',
  },
  {
    number: '03',
    title: 'Tu proceso',
    description:
      'Trabajamos juntos de forma constante con seguimiento personalizado en cada etapa de tu camino hacia el bienestar.',
    icon: TrendingUp,
    color: '#F2A7B8',
    bg: 'rgba(242,167,184,0.15)',
  },
]

export function ProcesoAtencionSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=Hola%20Cristal%2C%20quiero%20comenzar%20mi%20proceso%20terapéutico.`

  return (
    <section
      ref={ref}
      className="py-24 overflow-hidden relative"
      style={{ background: '#FFFFFF' }}
    >
      {/* Background decoration */}
      <div
        className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: '#A8D8EA' }}
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
            Cómo funciona
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: '#2D2B3D' }}
          >
            Proceso de atención
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg max-w-xl mx-auto"
            style={{ color: '#7A788F' }}
          >
            Comenzar tu proceso terapéutico es simple. Estoy aquí para guiarte en cada paso.
          </motion.p>
        </motion.div>

        {/* Steps */}
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
                <motion.div
                  variants={fadeInUp}
                  className="flex-1 text-center relative"
                >
                  {/* Step number */}
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

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:flex items-center justify-center absolute -right-4 top-10 z-10"
                    aria-hidden="true"
                  >
                    <ArrowRight size={20} style={{ color: '#B8AFF0' }} />
                  </div>
                )}
              </div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-body font-semibold text-base text-white transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            style={{
              background: 'linear-gradient(135deg, #0D6EFD 0%, #B8AFF0 100%)',
              boxShadow: '0 8px 30px rgba(13,110,253,0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(13,110,253,0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(13,110,253,0.25)'
            }}
          >
            <MessageCircle size={18} aria-hidden="true" />
            Empezar ahora — primer paso
          </a>
        </motion.div>
      </div>
    </section>
  )
}
