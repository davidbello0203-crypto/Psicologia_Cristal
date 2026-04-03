'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.includes('Invalid login')) {
          setError('Correo o contraseña incorrectos.')
        } else {
          setError(error.message)
        }
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: role } = await (supabase as any).rpc('get_my_role')
      window.location.href = role === 'admin' ? '/admin' : '/dashboard'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(160deg, #F4F2FF 0%, #EDE9FF 50%, #EDF6FB 100%)' }}
    >
      {/* Background blobs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: '#B8AFF0' }} aria-hidden="true" />
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#A8D8EA' }} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 24px 64px rgba(13,110,253,0.12)',
          }}
        >
          {/* Top accent bar */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #A8D8EA, #0D6EFD, #B8AFF0)' }} />

          <div className="px-8 py-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link href="/">
                <Logo size="md" />
              </Link>
            </div>

            <h1 className="font-heading text-2xl font-bold text-center mb-1" style={{ color: '#2D2B3D' }}>
              Bienvenida de vuelta
            </h1>
            <p className="text-sm text-center mb-8" style={{ color: '#7A788F' }}>
              Inicia sesión en tu espacio personal
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 py-3 rounded-xl mb-5 text-sm"
                style={{ background: 'rgba(192,74,74,0.08)', border: '1px solid rgba(192,74,74,0.2)', color: '#C04A4A' }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-1 mt-2 font-semibold underline"
                  style={{ color: '#0D6EFD' }}
                >
                  ¿No tienes cuenta? Regístrate →
                </Link>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                  <Mail size={15} style={{ color: '#B8AFF0' }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  required
                  className="w-full pl-9 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(13,110,253,0.12)]"
                  style={{
                    background: 'rgba(244,242,255,0.8)',
                    border: '1.5px solid rgba(184,175,240,0.3)',
                    color: '#2D2B3D',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                  <Lock size={15} style={{ color: '#B8AFF0' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  className="w-full pl-9 pr-11 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(13,110,253,0.12)]"
                  style={{
                    background: 'rgba(244,242,255,0.8)',
                    border: '1.5px solid rgba(184,175,240,0.3)',
                    color: '#2D2B3D',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword
                    ? <EyeOff size={15} style={{ color: '#B8AFF0' }} />
                    : <Eye size={15} style={{ color: '#B8AFF0' }} />
                  }
                </button>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #0D6EFD 0%, #9E94DF 100%)',
                  boxShadow: '0 4px 20px rgba(13,110,253,0.3)',
                }}
              >
                {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
              </motion.button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#7A788F' }}>
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="font-semibold" style={{ color: '#0D6EFD' }}>
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#B8AFF0' }}>
          <Link href="/" style={{ color: '#B8AFF0' }}>← Volver al inicio</Link>
        </p>
      </motion.div>
    </div>
  )
}
