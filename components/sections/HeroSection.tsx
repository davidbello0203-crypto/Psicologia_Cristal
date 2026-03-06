'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { fadeInUp, staggerContainer, fadeIn, scaleIn } from '@/lib/motion'
import { SITE_CONFIG } from '@/lib/constants'
import { Sparkles, ArrowDown } from 'lucide-react'

export function HeroSection() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=Hola%20Cristal%2C%20me%20gustar%C3%ADa%20agendar%20mi%20primera%20sesi%C3%B3n.`

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{ background: 'linear-gradient(160deg, #F4F2FF 0%, #EDE9FF 40%, #F4F2FF 100%)' }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: '#B8AFF0' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: '#A8D8EA' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: '#F2A7B8' }}
        aria-hidden="true"
      />

      {/* Decorative psi symbol */}
      <div
        className="absolute top-24 right-10 text-8xl font-bold opacity-5 pointer-events-none select-none"
        style={{ color: '#0D6EFD', fontFamily: 'serif' }}
        aria-hidden="true"
      >
        Ψ
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-semibold"
                style={{ background: 'rgba(242,167,184,0.2)', color: '#C07A8A' }}
              >
                <Sparkles size={14} aria-hidden="true" />
                30% de descuento en tu primera sesión
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={fadeInUp}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: '#2D2B3D' }}
            >
              Tu espacio{' '}
              <span style={{ color: '#0D6EFD' }}>seguro</span>{' '}
              para sanar y{' '}
              <span
                className="relative inline-block"
                style={{ color: '#0D6EFD' }}
              >
                crecer
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl leading-relaxed mb-8 max-w-lg"
              style={{ color: '#7A788F' }}
            >
              Acompaño procesos de bienestar emocional, autoconocimiento y salud mental en un espacio libre de prejuicios donde podrás expresarte con libertad.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-body font-semibold text-white text-base transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                style={{
                  background: 'linear-gradient(135deg, #0D6EFD 0%, #B8AFF0 100%)',
                  boxShadow: '0 8px 30px rgba(13,110,253,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(13,110,253,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(13,110,253,0.3)'
                }}
              >
                Escríbeme para agendar
              </a>
              <a
                href="#sobre-mi"
                className="inline-flex items-center justify-center px-7 py-4 rounded-full font-body font-semibold text-base border-2 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                style={{ color: '#0D6EFD', borderColor: '#B8AFF0', background: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(13,110,253,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Conoce más
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2" aria-hidden="true">
                {['#0D6EFD', '#B8AFF0', '#A8D8EA', '#F2A7B8'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <p className="text-sm" style={{ color: '#7A788F' }}>
                <span className="font-semibold" style={{ color: '#2D2B3D' }}>+50 personas</span>{' '}
                han encontrado su espacio seguro
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Illustration placeholder */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="relative flex justify-center items-center"
          >
            {/* Photo card */}
            <div
              className="relative w-80 h-96 sm:w-96 sm:h-[480px] rounded-3xl overflow-hidden"
              style={{
                boxShadow: '0 20px 60px rgba(13,110,253,0.2)',
              }}
            >
              <Image
                src="/images/cristal.jpg"
                alt="Cristal Hernández – Psicóloga"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Gradient overlay at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24"
                style={{ background: 'linear-gradient(to top, rgba(13,110,253,0.5) 0%, transparent 100%)' }}
                aria-hidden="true"
              />
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 sm:right-0 bg-white rounded-2xl px-4 py-3 shadow-lg"
              style={{ boxShadow: '0 8px 25px rgba(13,110,253,0.15)' }}
              aria-hidden="true"
            >
              <p className="text-xs font-body font-medium" style={{ color: '#7A788F' }}>Espacio seguro</p>
              <p className="text-sm font-heading font-bold" style={{ color: '#0D6EFD' }}>Sin prejuicios</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-4 sm:left-0 bg-white rounded-2xl px-4 py-3 shadow-lg"
              style={{ boxShadow: '0 8px 25px rgba(168,216,234,0.3)' }}
              aria-hidden="true"
            >
              <p className="text-xs font-body font-medium" style={{ color: '#7A788F' }}>30% descuento</p>
              <p className="text-sm font-heading font-bold" style={{ color: '#5A8FA3' }}>Primera sesión</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowDown size={20} style={{ color: '#B8AFF0' }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
