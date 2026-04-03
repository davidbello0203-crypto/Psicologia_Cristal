'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

export default function RegistroPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            phone: form.phone,
          },
        },
      })
      if (error) {
        if (error.message.includes('already registered')) {
          setError('Este correo ya está registrado. Intenta iniciar sesión.')
        } else {
          setError(error.message)
        }
        return
      }
      setSuccess(true)
      // Small delay then redirect to dashboard
      setTimeout(() => router.push('/dashboard'), 2000)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(244,242,255,0.8)',
    border: '1.5px solid rgba(184,175,240,0.3)',
    color: '#2D2B3D',
  }
  const inputClass = "w-full pl-9 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(13,110,253,0.12)]"

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(160deg, #F4F2FF 0%, #EDE9FF 50%, #EDF6FB 100%)' }}
    >
      <div className="fixed top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: '#B8AFF0' }} aria-hidden="true" />
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#A8D8EA' }} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 24px 64px rgba(13,110,253,0.12)',
          }}
        >
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #F2A7B8, #0D6EFD, #B8AFF0)' }} />

          <div className="px-8 py-10">
            <div className="flex justify-center mb-8">
              <Link href="/"><Logo size="md" /></Link>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-6 gap-4"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(13,110,253,0.1)' }}>
                  <CheckCircle2 size={32} style={{ color: '#0D6EFD' }} />
                </div>
                <h2 className="font-heading text-xl font-bold" style={{ color: '#2D2B3D' }}>¡Cuenta creada!</h2>
                <p className="text-sm" style={{ color: '#7A788F' }}>
                  Te damos la bienvenida. Redirigiendo a tu portal…
                </p>
              </motion.div>
            ) : (
              <>
                <h1 className="font-heading text-2xl font-bold text-center mb-1" style={{ color: '#2D2B3D' }}>
                  Crea tu cuenta
                </h1>
                <p className="text-sm text-center mb-8" style={{ color: '#7A788F' }}>
                  Accede a tu portal personal de bienestar
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
                    style={{ background: 'rgba(192,74,74,0.08)', border: '1px solid rgba(192,74,74,0.2)', color: '#C04A4A' }}
                  >
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Full name */}
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                      <User size={15} style={{ color: '#B8AFF0' }} />
                    </div>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={update('fullName')}
                      placeholder="Nombre completo"
                      required
                      className={inputClass}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                      <Mail size={15} style={{ color: '#B8AFF0' }} />
                    </div>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder="Correo electrónico"
                      required
                      className={inputClass}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                      <Phone size={15} style={{ color: '#B8AFF0' }} />
                    </div>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="WhatsApp / Teléfono (opcional)"
                      className={inputClass}
                      style={inputStyle}
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
                      value={form.password}
                      onChange={update('password')}
                      placeholder="Contraseña (mín. 6 caracteres)"
                      required
                      className={`${inputClass} pr-11`}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                    >
                      {showPassword ? <EyeOff size={15} style={{ color: '#B8AFF0' }} /> : <Eye size={15} style={{ color: '#B8AFF0' }} />}
                    </button>
                  </div>

                  {/* Confirm password */}
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                      <Lock size={15} style={{ color: '#B8AFF0' }} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={update('confirmPassword')}
                      placeholder="Confirmar contraseña"
                      required
                      className={inputClass}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')}
                    />
                  </div>

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
                    {loading ? 'Creando cuenta…' : 'Crear mi cuenta'}
                  </motion.button>
                </form>

                <p className="text-center text-sm mt-6" style={{ color: '#7A788F' }}>
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="font-semibold" style={{ color: '#0D6EFD' }}>
                    Iniciar sesión
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6">
          <Link href="/" style={{ color: '#B8AFF0' }}>← Volver al inicio</Link>
        </p>
      </motion.div>
    </div>
  )
}
