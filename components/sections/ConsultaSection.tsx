'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Clock, Heart, Sparkles } from 'lucide-react'
import { TriageForm } from '@/components/TriageForm'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, inViewConfig } from '@/lib/motion'

const BENEFICIOS = [
  { icon: Shield, text: 'Completamente confidencial' },
  { icon: Clock,  text: 'Respuesta en menos de 24 h' },
  { icon: Heart,  text: 'Sin juicios, sin presión' },
  { icon: Sparkles, text: '30% de descuento en tu primera sesión' },
]

export function ConsultaSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)

  return (
    <section
      id="consulta"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #EDE9FF 0%, #E8E4FF 50%, #EDF6FB 100%)' }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: '#B8AFF0' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: '#A8D8EA' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: Copy ─────────────────────────────────── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:sticky lg:top-28 flex flex-col"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#9E94DF' }}
            >
              Pre-consulta gratuita
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-4"
              style={{ color: '#2D2B3D' }}
            >
              Da el{' '}
              <span
                className="relative inline-block"
                style={{ color: '#0D6EFD' }}
              >
                primer paso
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 5 Q50 0 100 3 Q150 6 200 2"
                    stroke="#F2A7B8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>{' '}
              hacia tu bienestar
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-base leading-relaxed mb-8"
              style={{ color: '#7A788F' }}
            >
              Completa este breve cuestionario para que pueda conocerte mejor
              antes de nuestra primera sesión. Con esta información preparo
              un espacio completamente personalizado para ti.
            </motion.p>

            {/* Beneficios */}
            <motion.ul
              variants={staggerContainer}
              className="flex flex-col gap-3 mb-8"
              aria-label="Beneficios"
            >
              {BENEFICIOS.map(({ icon: Icon, text }) => (
                <motion.li
                  key={text}
                  variants={fadeInUp}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(13,110,253,0.12)' }}
                    aria-hidden="true"
                  >
                    <Icon size={15} style={{ color: '#0D6EFD' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#2D2B3D' }}>
                    {text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Testimonial chip */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(184,175,240,0.3)',
              }}
            >
              <div className="flex -space-x-2 flex-shrink-0" aria-hidden="true">
                {['#0D6EFD', '#B8AFF0', '#A8D8EA'].map((c) => (
                  <div
                    key={c}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p className="text-xs leading-snug" style={{ color: '#7A788F' }}>
                <span className="font-semibold" style={{ color: '#2D2B3D' }}>+50 personas</span>{' '}
                ya encontraron su espacio seguro conmigo
              </p>
            </motion.div>
          </motion.div>

          {/* ── Right: Form ────────────────────────────────── */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <TriageForm />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
