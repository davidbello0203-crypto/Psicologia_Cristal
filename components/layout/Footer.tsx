'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Phone, Heart } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'

export function Footer() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=Hola%20Cristal%2C%20me%20gustar%C3%ADa%20agendar%20una%20sesi%C3%B3n.`

  return (
    <footer
      className="pt-16 pb-8"
      style={{ background: '#2D2B3D' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Logo + tagline */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 relative"
                  style={{ boxShadow: '0 2px 8px rgba(13,110,253,0.2)' }}
                >
                  <Image src="/images/cristal.jpg" alt="Cristal Hernandez" fill className="object-cover object-top" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-heading font-bold text-white text-base">
                    Cristal Hernandez
                  </span>
                  <span className="text-xs" style={{ color: '#B8AFF0' }}>
                    Psicóloga
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A788F' }}>
              Un espacio seguro y sin prejuicios para tu bienestar emocional y salud mental.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ background: 'rgba(13,110,253,0.15)' }}
                aria-label="Instagram de Cristal Hernandez"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(13,110,253,0.35)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(13,110,253,0.15)')}
              >
                <Instagram size={16} style={{ color: '#B8AFF0' }} />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ background: 'rgba(13,110,253,0.15)' }}
                aria-label="WhatsApp de Cristal Hernandez"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(13,110,253,0.35)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(13,110,253,0.15)')}
              >
                <Phone size={16} style={{ color: '#B8AFF0' }} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                    style={{ color: '#7A788F' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#B8AFF0')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#7A788F')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-200 cursor-pointer"
                  style={{ color: '#7A788F' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#B8AFF0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#7A788F')}
                >
                  {SITE_CONFIG.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-200 cursor-pointer"
                  style={{ color: '#7A788F' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#B8AFF0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#7A788F')}
                >
                  {SITE_CONFIG.instagramHandle}
                </a>
              </li>
              <li>
                <span className="text-sm" style={{ color: '#7A788F' }}>
                  {SITE_CONFIG.location}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Crisis Resources (always present) */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: '#F2A7B8' }}>
              Recursos de Crisis
            </h4>
            <ul className="space-y-3">
              <li className="text-xs leading-relaxed" style={{ color: '#7A788F' }}>
                <span className="block font-medium mb-0.5" style={{ color: '#B8AFF0' }}>
                  SAPTEL (México)
                </span>
                55 5259-8121 — 24 horas
              </li>
              <li className="text-xs leading-relaxed" style={{ color: '#7A788F' }}>
                <span className="block font-medium mb-0.5" style={{ color: '#B8AFF0' }}>
                  Línea de la Vida (SSa)
                </span>
                800 911 2000 — Gratuita
              </li>
              <li className="text-xs leading-relaxed" style={{ color: '#7A788F' }}>
                <span className="block font-medium mb-0.5" style={{ color: '#B8AFF0' }}>
                  IMSS Salud Mental
                </span>
                800 890 7000 — Gratuita
              </li>
              <li className="text-xs leading-relaxed" style={{ color: '#7A788F' }}>
                <span className="block font-medium mb-0.5" style={{ color: '#B8AFF0' }}>
                  Crisis Text Line (Internacional)
                </span>
                crisistextline.org
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(13,110,253,0.2)' }}>
          <p className="text-xs flex items-center gap-1" style={{ color: '#7A788F' }}>
            Hecho con <Heart size={11} className="inline" style={{ color: '#F2A7B8' }} aria-hidden="true" /> para el bienestar emocional &mdash; &copy; {new Date().getFullYear()} Cristal Hernandez
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: '#7A788F' }}>
              Sesión desde $200 MXN
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
