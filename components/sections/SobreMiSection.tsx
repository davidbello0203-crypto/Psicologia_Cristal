'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, inViewConfig } from '@/lib/motion'
import { GraduationCap, Heart, Shield } from 'lucide-react'

export function SobreMiSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)

  return (
    <section
      id="sobre-mi"
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Decorative illustration */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative flex justify-center"
          >
            <div
              className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden"
              style={{
                boxShadow: '0 20px 60px rgba(13,110,253,0.15)',
              }}
            >
              <Image
                src="/images/cristal.jpg"
                alt="Cristal Hernández – Psicóloga"
                fill
                className="object-cover object-top"
              />
              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(13,110,253,0.8) 0%, transparent 100%)' }}>
                <p className="text-white font-heading font-bold text-lg">Cristal Hernández</p>
                <p className="text-white/80 text-sm font-body">Psicóloga Clínica y Educativa</p>
              </div>
            </div>

            {/* Achievement badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg"
              style={{ boxShadow: '0 8px 30px rgba(13,110,253,0.2)' }}
              aria-hidden="true"
            >
              <GraduationCap size={20} style={{ color: '#0D6EFD' }} />
              <p className="text-xs font-heading font-bold mt-1" style={{ color: '#2D2B3D' }}>Titulada por</p>
              <p className="text-xs" style={{ color: '#7A788F' }}>Excelencia Académica</p>
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-sm font-body font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#0D6EFD' }}
            >
              Sobre mí
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl sm:text-4xl font-bold mb-6 leading-tight"
              style={{ color: '#2D2B3D' }}
            >
              Un proceso de bienestar
              <br />
              <span style={{ color: '#0D6EFD' }}>personalizado para ti</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg leading-relaxed mb-6"
              style={{ color: '#7A788F' }}
            >
              Me llamo Cristal y me dedico a acompañar procesos de bienestar emocional, autoconocimiento y salud mental. Conmigo encontrarás un espacio seguro y sin prejuicios en donde podrás expresarte libremente.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-base leading-relaxed mb-8"
              style={{ color: '#7A788F' }}
            >
              Con experiencia en psicología clínica y educativa, he trabajado con personas en diversas etapas de la vida — desde niños y adolescentes hasta adultos — acompañando procesos de crecimiento personal, manejo emocional y bienestar mental.
            </motion.p>

            {/* Values */}
            <motion.div variants={staggerContainer} className="space-y-4">
              {[
                { icon: Heart, text: 'Atención empática y sin juicio en cada sesión', color: '#F2A7B8' },
                { icon: Shield, text: 'Confidencialidad absoluta en todo momento', color: '#A8D8EA' },
                { icon: GraduationCap, text: 'Formación sólida y actualizada en psicología', color: '#B8AFF0' },
              ].map(({ icon: Icon, text, color }) => (
                <motion.div
                  key={text}
                  variants={fadeInUp}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}30` }}
                  >
                    <Icon size={18} style={{ color }} aria-hidden="true" />
                  </div>
                  <p className="text-sm font-body" style={{ color: '#2D2B3D' }}>{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
