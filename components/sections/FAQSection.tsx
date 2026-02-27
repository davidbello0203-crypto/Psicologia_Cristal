'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { fadeInUp, staggerContainer, inViewConfig } from '@/lib/motion'
import { FAQ_ITEMS } from '@/lib/constants'
import { ChevronDown, HelpCircle } from 'lucide-react'

export function FAQSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: '#F4F2FF' }}
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-14"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(13,110,253,0.1)' }}
            >
              <HelpCircle size={28} style={{ color: '#0D6EFD' }} aria-hidden="true" />
            </div>
          </motion.div>
          <motion.span
            variants={fadeInUp}
            className="inline-block text-sm font-body font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#0D6EFD' }}
          >
            Preguntas frecuentes
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: '#2D2B3D' }}
          >
            Resuelvo tus dudas
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg"
            style={{ color: '#7A788F' }}
          >
            Todo lo que necesitas saber antes de dar el primer paso.
          </motion.p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-3"
        >
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: 'white',
                border: openIndex === index ? '1.5px solid rgba(184,175,240,0.6)' : '1.5px solid rgba(184,175,240,0.2)',
                boxShadow: openIndex === index ? '0 4px 20px rgba(13,110,253,0.1)' : 'none',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span
                  className="font-body font-semibold text-base pr-4"
                  style={{ color: openIndex === index ? '#0D6EFD' : '#2D2B3D' }}
                >
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                  aria-hidden="true"
                >
                  <ChevronDown size={20} style={{ color: '#0D6EFD' }} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                    role="region"
                  >
                    <div className="px-6 pb-5 pt-0">
                      <div className="h-px mb-4" style={{ background: 'rgba(184,175,240,0.3)' }} aria-hidden="true" />
                      <p className="text-sm leading-relaxed font-body" style={{ color: '#7A788F' }}>
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
