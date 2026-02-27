'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer, scaleIn, inViewConfig } from '@/lib/motion'
import { Brain, Clock, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function ServiciosSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=Hola%20Cristal%2C%20me%20gustar%C3%ADa%20agendar%20una%20sesi%C3%B3n.`

  const features = [
    'Historial Clínico completo',
    'Manejo de Emociones',
    'Seguimiento de consulta',
    'Prevención de recaídas',
  ]

  const specialties = [
    'Ansiedad y Estrés',
    'Depresión',
    'Autoestima',
    'Duelo',
    'Trauma',
    'Violencia familiar',
    'Adicciones',
    'Desarrollo personal',
    'Problemas de pareja',
    'Orientación educativa',
  ]

  return (
    <section
      id="servicios"
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: '#F4F2FF' }}
    >
      {/* Background blob */}
      <div
        className="absolute right-0 top-1/2 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: '#B8AFF0' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
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
            Servicios
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: '#2D2B3D' }}
          >
            ¿En qué puedo ayudarte?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg max-w-xl mx-auto"
            style={{ color: '#7A788F' }}
          >
            Ofrezco atención psicológica personalizada para acompañarte en tu proceso de bienestar.
          </motion.p>
        </motion.div>

        {/* Main service card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-2xl mx-auto mb-16"
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0D6EFD 0%, #9B8FE0 50%, #B8AFF0 100%)',
              boxShadow: '0 20px 60px rgba(13,110,253,0.3)',
            }}
          >
            {/* Promo badge */}
            <div
              className="absolute top-6 right-6 px-4 py-2 rounded-full flex items-center gap-2"
              style={{ background: 'rgba(242,167,184,0.9)' }}
            >
              <Sparkles size={14} className="text-white" aria-hidden="true" />
              <span className="text-xs font-body font-bold text-white">30% descuento primera sesión</span>
            </div>

            <div className="p-8 sm:p-10">
              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Brain size={28} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white">Atención Psicológica</h3>
                  <p className="text-white/70 font-body text-sm mt-1">Cualquier Modalidad — En línea o Presencial</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 mb-6">
                <Clock size={16} className="text-white/70" aria-hidden="true" />
                <span className="text-sm text-white/80 font-body">45 – 60 minutos por sesión</span>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 size={16} style={{ color: '#F2A7B8' }} aria-hidden="true" />
                    <span className="text-sm text-white/90 font-body">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-body font-semibold text-base transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
                style={{ background: 'white', color: '#0D6EFD' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <MessageCircle size={18} aria-hidden="true" />
                Agendar mi sesión
              </a>
            </div>
          </div>
        </motion.div>

        {/* Specialties grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.h3
            variants={fadeInUp}
            className="text-center font-heading text-xl font-semibold mb-8"
            style={{ color: '#2D2B3D' }}
          >
            Áreas de atención
          </motion.h3>
          <motion.div
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-3"
          >
            {specialties.map((specialty) => (
              <motion.span
                key={specialty}
                variants={fadeInUp}
                className="px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all duration-200 cursor-default"
                style={{
                  background: 'white',
                  color: '#0D6EFD',
                  border: '1.5px solid #B8AFF0',
                  boxShadow: '0 2px 10px rgba(13,110,253,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0D6EFD'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#0D6EFD'
                }}
              >
                {specialty}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
