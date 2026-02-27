'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, inViewConfig } from '@/lib/motion'
import { EXPERIENCE, COURSES } from '@/lib/constants'
import { GraduationCap, BookOpen, Award, MapPin, Calendar } from 'lucide-react'

export function FormacionSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, inViewConfig)

  return (
    <section
      id="formacion"
      ref={ref}
      className="py-24 overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
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
            Formación y Experiencia
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: '#2D2B3D' }}
          >
            Preparada para acompañarte
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg max-w-xl mx-auto"
            style={{ color: '#7A788F' }}
          >
            Formación académica sólida y experiencia práctica en distintos contextos clínicos y educativos.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Timeline */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.h3
              variants={fadeInUp}
              className="font-heading text-xl font-semibold mb-8 flex items-center gap-3"
              style={{ color: '#2D2B3D' }}
            >
              <GraduationCap size={22} style={{ color: '#0D6EFD' }} aria-hidden="true" />
              Trayectoria
            </motion.h3>

            <div className="relative">
              {/* Timeline vertical line */}
              <div
                className="absolute left-4 top-2 bottom-2 w-0.5"
                style={{ background: 'linear-gradient(to bottom, #B8AFF0, #A8D8EA, #F2A7B8)' }}
                aria-hidden="true"
              />

              <div className="space-y-10 pl-12">
                {EXPERIENCE.map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-12 top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center"
                      style={{
                        background: 'white',
                        borderColor: index === 0 ? '#0D6EFD' : index === 1 ? '#A8D8EA' : '#F2A7B8',
                      }}
                      aria-hidden="true"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: index === 0 ? '#0D6EFD' : index === 1 ? '#A8D8EA' : '#F2A7B8',
                        }}
                      />
                    </div>

                    <div
                      className="rounded-2xl p-5"
                      style={{ background: '#F4F2FF', border: '1px solid rgba(184,175,240,0.3)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={13} style={{ color: '#0D6EFD' }} aria-hidden="true" />
                        <span className="text-xs font-body font-semibold" style={{ color: '#0D6EFD' }}>
                          {exp.period}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-base mb-1" style={{ color: '#2D2B3D' }}>
                        {exp.role}
                      </h4>
                      <p className="font-body text-sm font-medium mb-1" style={{ color: '#7A788F' }}>
                        {exp.institution}
                      </p>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin size={11} style={{ color: '#A8D8EA' }} aria-hidden="true" />
                        <p className="font-body text-xs" style={{ color: '#7A788F' }}>
                          {exp.location}
                        </p>
                      </div>
                      {exp.note && (
                        <span
                          className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-body font-semibold"
                          style={{ background: 'rgba(13,110,253,0.12)', color: '#0D6EFD' }}
                        >
                          {exp.note}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Courses grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.h3
              variants={fadeInUp}
              className="font-heading text-xl font-semibold mb-8 flex items-center gap-3"
              style={{ color: '#2D2B3D' }}
            >
              <BookOpen size={22} style={{ color: '#0D6EFD' }} aria-hidden="true" />
              Cursos y Certificaciones
            </motion.h3>

            <motion.div variants={staggerContainer} className="space-y-3">
              {COURSES.map((course, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-start gap-3 p-4 rounded-2xl transition-all duration-200"
                  style={{
                    background: '#F4F2FF',
                    border: '1px solid rgba(184,175,240,0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184,175,240,0.6)'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184,175,240,0.2)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <Award size={16} style={{ color: '#F2A7B8', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-body font-medium" style={{ color: '#2D2B3D' }}>
                      {course.title}
                    </p>
                    <span
                      className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-body"
                      style={{ background: 'rgba(168,216,234,0.3)', color: '#5A8FA3' }}
                    >
                      {course.institution}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
