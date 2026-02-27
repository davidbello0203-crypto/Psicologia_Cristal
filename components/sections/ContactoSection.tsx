'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, inViewConfig } from '@/lib/motion'
import { SITE_CONFIG } from '@/lib/constants'
import { MessageCircle, Instagram, MapPin, Send, CheckCircle2 } from 'lucide-react'

export function ContactoSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=Hola%20Cristal%2C%20me%20gustar%C3%ADa%20agendar%20una%20sesi%C3%B3n.`
  const whatsappWithForm = (name: string, message: string) =>
    `https://wa.me/${SITE_CONFIG.whatsapp}?text=Hola%20Cristal%2C%20soy%20${encodeURIComponent(name)}.%20${encodeURIComponent(message)}`

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formState.name && formState.message) {
      window.open(whatsappWithForm(formState.name, formState.message), '_blank')
      setSubmitted(true)
    }
  }

  return (
    <section
      id="contacto"
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0D6EFD 0%, #9B8FE0 50%, #B8AFF0 100%)' }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: '#A8D8EA' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: '#F2A7B8' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-14"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-sm font-body font-semibold uppercase tracking-widest mb-3 text-white/70"
          >
            Estoy aquí para ti
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-white"
          >
            Demos el primer paso juntos
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg max-w-xl mx-auto text-white/75"
          >
            ¿Lista/o para comenzar tu proceso? Escríbeme por WhatsApp o Instagram y te responderé pronto.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Contact info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            {/* WhatsApp */}
            <motion.a
              variants={fadeInUp}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 rounded-2xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={26} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-body text-white/60 mb-1 uppercase tracking-wider">WhatsApp</p>
                <p className="font-heading font-bold text-white text-lg">{SITE_CONFIG.whatsappDisplay}</p>
                <p className="text-sm text-white/70 mt-0.5">Respondo rápido — escríbeme</p>
              </div>
            </motion.a>

            {/* Instagram */}
            <motion.a
              variants={fadeInUp}
              href={SITE_CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 rounded-2xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #E1306C 0%, #F77737 50%, #FCAF45 100%)' }}
              >
                <Instagram size={26} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-body text-white/60 mb-1 uppercase tracking-wider">Instagram</p>
                <p className="font-heading font-bold text-white text-lg">{SITE_CONFIG.instagramHandle}</p>
                <p className="text-sm text-white/70 mt-0.5">Sígueme para contenido de bienestar</p>
              </div>
            </motion.a>

            {/* Location */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-5 p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <MapPin size={26} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-body text-white/60 mb-1 uppercase tracking-wider">Ubicación</p>
                <p className="font-heading font-bold text-white text-base">{SITE_CONFIG.location}</p>
                <p className="text-sm text-white/70 mt-0.5">Sesiones presenciales y en línea</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div
              className="rounded-3xl p-8"
              style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'rgba(13,110,253,0.1)' }}
                  >
                    <CheckCircle2 size={32} style={{ color: '#0D6EFD' }} aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2" style={{ color: '#2D2B3D' }}>
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-sm" style={{ color: '#7A788F' }}>
                    Se abrirá WhatsApp para completar tu mensaje. Te responderé pronto.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormState({ name: '', email: '', message: '' }) }}
                    className="mt-6 text-sm font-semibold cursor-pointer underline"
                    style={{ color: '#0D6EFD' }}
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-heading font-bold text-xl mb-6" style={{ color: '#2D2B3D' }}>
                    Envíame un mensaje
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-body font-medium mb-2"
                        style={{ color: '#2D2B3D' }}
                      >
                        Tu nombre
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="¿Cómo te llamas?"
                        value={formState.name}
                        onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all duration-200"
                        style={{
                          border: '1.5px solid rgba(184,175,240,0.4)',
                          background: '#F4F2FF',
                          color: '#2D2B3D',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#0D6EFD')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.4)')}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-body font-medium mb-2"
                        style={{ color: '#2D2B3D' }}
                      >
                        Correo electrónico <span className="text-xs font-normal" style={{ color: '#7A788F' }}>(opcional)</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={formState.email}
                        onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all duration-200"
                        style={{
                          border: '1.5px solid rgba(184,175,240,0.4)',
                          background: '#F4F2FF',
                          color: '#2D2B3D',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#0D6EFD')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.4)')}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-body font-medium mb-2"
                        style={{ color: '#2D2B3D' }}
                      >
                        ¿En qué puedo ayudarte?
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="Cuéntame brevemente cómo te sientes o qué necesitas..."
                        value={formState.message}
                        onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all duration-200 resize-none"
                        style={{
                          border: '1.5px solid rgba(184,175,240,0.4)',
                          background: '#F4F2FF',
                          color: '#2D2B3D',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#0D6EFD')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.4)')}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-body font-semibold text-sm text-white transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                      style={{
                        background: 'linear-gradient(135deg, #0D6EFD 0%, #B8AFF0 100%)',
                        boxShadow: '0 8px 25px rgba(13,110,253,0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(13,110,253,0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(13,110,253,0.3)'
                      }}
                    >
                      <Send size={16} aria-hidden="true" />
                      Enviar por WhatsApp
                    </button>
                    <p className="text-xs text-center" style={{ color: '#7A788F' }}>
                      Al enviar, se abrirá WhatsApp con tu mensaje prellenado.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
