'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, UserCircle2, ChevronDown } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 20)
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    router.push('/')
  }

  const dashboardHref = profile?.role === 'admin' ? '/admin' : '/dashboard'

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* LEFT: User widget */}
          {!loading && (
            user ? (
              /* Logged in — avatar + name + dropdown */
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer focus-visible:outline-none"
                  style={{
                    background: scrolled ? 'white' : 'rgba(255,255,255,0.85)',
                    borderColor: 'rgba(184,175,240,0.4)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0D6EFD')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.4)')}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative" style={{ background: 'linear-gradient(135deg, #0D6EFD, #B8AFF0)' }}>
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                    ) : (
                      profile?.role === 'admin'
                        ? <ShieldCheck size={14} className="absolute inset-0 m-auto text-white" />
                        : <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{profile?.full_name?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block" style={{ color: '#2D2B3D' }}>
                    {profile?.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} style={{ color: '#B8AFF0' }} />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-xl border overflow-hidden"
                      style={{ borderColor: 'rgba(184,175,240,0.3)', boxShadow: '0 8px 30px rgba(13,110,253,0.12)' }}
                    >
                      {/* Profile summary */}
                      <div className="px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(184,175,240,0.2)' }}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 relative" style={{ background: 'linear-gradient(135deg, #0D6EFD, #B8AFF0)' }}>
                          {profile?.avatar_url ? (
                            <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">{profile?.full_name?.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: '#2D2B3D' }}>{profile?.full_name}</p>
                          <p className="text-xs" style={{ color: '#B8AFF0' }}>{profile?.role === 'admin' ? 'Psicóloga' : 'Cliente'}</p>
                        </div>
                      </div>

                      <Link
                        href={dashboardHref}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 cursor-pointer"
                        style={{ color: '#2D2B3D' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F2FF')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LayoutDashboard size={15} style={{ color: '#0D6EFD' }} />
                        {profile?.role === 'admin' ? 'Panel admin' : 'Mi portal'}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 cursor-pointer"
                        style={{ color: '#C04A4A' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF5F5')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut size={15} />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Not logged in — placeholder */
              <Link
                href="/registro"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer flex-shrink-0"
                style={{
                  background: scrolled ? 'white' : 'rgba(255,255,255,0.85)',
                  borderColor: 'rgba(184,175,240,0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0D6EFD'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(184,175,240,0.4)'
                }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F4F2FF' }}>
                  <UserCircle2 size={16} style={{ color: '#B8AFF0' }} />
                </div>
                <span className="text-sm font-medium hidden sm:block" style={{ color: '#7A788F' }}>
                  Regístrate
                </span>
              </Link>
            )
          )}

          {/* CENTER: Nav */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center" role="navigation" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-body font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                style={{ color: '#7A788F' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0D6EFD')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#7A788F')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* RIGHT: CTA */}
          <div className="hidden md:flex items-center flex-shrink-0">
            {!loading && user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href={dashboardHref}
                  className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-semibold text-white overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  style={{
                    background: 'linear-gradient(135deg, #0D6EFD 0%, #9E94DF 100%)',
                    boxShadow: '0 4px 18px rgba(13,110,253,0.35)',
                  }}
                >
                  <motion.span
                    className="absolute inset-0 -skew-x-12"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'linear', repeatDelay: 1 }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{profile?.role === 'admin' ? 'Panel admin' : 'Mis citas'}</span>
                </Link>
              </motion.div>
            )}
            {!loading && !user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href="/login"
                  className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-semibold text-white overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  style={{
                    background: 'linear-gradient(135deg, #0D6EFD 0%, #9E94DF 100%)',
                    boxShadow: '0 4px 18px rgba(13,110,253,0.35)',
                  }}
                >
                  {/* shimmer sweep */}
                  <motion.span
                    className="absolute inset-0 -skew-x-12"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'linear', repeatDelay: 1 }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10">Iniciar sesión</span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ml-auto"
            style={{ color: '#0D6EFD' }}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-t"
            style={{ borderColor: 'rgba(184,175,240,0.3)' }}
          >
            <nav className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4" role="navigation" aria-label="Navegación móvil">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-body font-medium cursor-pointer"
                  style={{ color: '#2D2B3D' }}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t flex flex-col gap-3" style={{ borderColor: 'rgba(184,175,240,0.2)' }}>
                {!loading && (
                  user ? (
                    <>
                      <Link
                        href={dashboardHref}
                        onClick={() => setMobileOpen(false)}
                        className="inline-flex justify-center items-center px-6 py-3 rounded-full text-sm font-body font-semibold text-white cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #0D6EFD 0%, #B8AFF0 100%)' }}
                      >
                        {profile?.role === 'admin' ? 'Panel admin' : 'Mi portal'}
                      </Link>
                      <button
                        onClick={() => { handleSignOut(); setMobileOpen(false) }}
                        className="text-sm font-medium text-center cursor-pointer"
                        style={{ color: '#C04A4A' }}
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/registro"
                        onClick={() => setMobileOpen(false)}
                        className="inline-flex justify-center items-center px-6 py-3 rounded-full text-sm font-body font-semibold text-white cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #0D6EFD 0%, #B8AFF0 100%)' }}
                      >
                        Registrarse
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-center cursor-pointer"
                        style={{ color: '#0D6EFD' }}
                      >
                        Iniciar sesión
                      </Link>
                    </>
                  )
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
