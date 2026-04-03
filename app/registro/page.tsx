'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ── Password strength ─────────────────────────────────────────
const RULES = [
  { id: 'len',     label: 'Mínimo 8 caracteres',         test: (p: string) => p.length >= 8 },
  { id: 'upper',   label: 'Una letra mayúscula',          test: (p: string) => /[A-Z]/.test(p) },
  { id: 'number',  label: 'Un número',                   test: (p: string) => /[0-9]/.test(p) },
  { id: 'special', label: 'Un carácter especial (!@#$…)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function getStrength(password: string) {
  const passed = RULES.filter((r) => r.test(password)).length
  if (!password) return null
  if (passed <= 1) return { level: 1, label: 'Muy débil',  color: '#EF4444', bars: 1 }
  if (passed === 2) return { level: 2, label: 'Débil',      color: '#F59E0B', bars: 2 }
  if (passed === 3) return { level: 3, label: 'Buena',      color: '#0D6EFD', bars: 3 }
  return              { level: 4, label: '🔒 Muy segura', color: '#10B981', bars: 4 }
}

export default function RegistroPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)
  const [error, setError] = useState('')
  const [emailExists, setEmailExists] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const strength = useMemo(() => getStrength(form.password), [form.password])
  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden.'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.fullName, phone: form.phone } },
      })
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setEmailExists(true)
          setError('Este correo ya tiene una cuenta.')
        } else {
          setError(error.message)
        }
        return
      }
      setEmailExists(false)
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } finally {
      setLoading(false)
    }
  }

  const inputBase = "w-full pl-9 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(13,110,253,0.12)]"
  const inputStyle = { background: 'rgba(244,242,255,0.8)', border: '1.5px solid rgba(184,175,240,0.3)', color: '#2D2B3D' }

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
            {/* Logo text */}
            <div className="flex justify-center mb-8">
              <Link href="/" className="font-heading font-bold text-lg" style={{ color: '#0D6EFD' }}>
                Psic. Cristal Hernandez
              </Link>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-6 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.12)' }}
                >
                  <CheckCircle2 size={32} style={{ color: '#10B981' }} />
                </motion.div>
                <h2 className="font-heading text-xl font-bold" style={{ color: '#2D2B3D' }}>¡Cuenta creada!</h2>
                <p className="text-sm" style={{ color: '#7A788F' }}>Te damos la bienvenida. Redirigiendo a tu portal…</p>
              </motion.div>
            ) : (
              <>
                <h1 className="font-heading text-2xl font-bold text-center mb-1" style={{ color: '#2D2B3D' }}>
                  Crea tu cuenta
                </h1>
                <p className="text-sm text-center mb-8" style={{ color: '#7A788F' }}>
                  Accede a tu portal personal de bienestar
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-3 rounded-xl mb-5 text-sm"
                      style={{ background: 'rgba(192,74,74,0.08)', border: '1px solid rgba(192,74,74,0.2)', color: '#C04A4A' }}
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle size={15} className="flex-shrink-0" />
                        {error}
                      </div>
                      {emailExists && (
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-1 mt-2 font-semibold underline"
                          style={{ color: '#0D6EFD' }}
                        >
                          Ir a iniciar sesión →
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleRegister} className="space-y-4">

                  {/* Full name */}
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B8AFF0' }} />
                    <input type="text" value={form.fullName} onChange={update('fullName')} placeholder="Nombre completo" required
                      className={inputBase} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')} />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B8AFF0' }} />
                    <input type="email" value={form.email} onChange={update('email')} placeholder="Correo electrónico" required
                      className={inputBase} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')} />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B8AFF0' }} />
                    <input type="tel" value={form.phone} onChange={update('phone')} placeholder="WhatsApp / Teléfono (opcional)"
                      className={inputBase} style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)')} />
                  </div>

                  {/* Password + strength */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B8AFF0' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={update('password')}
                        placeholder="Contraseña"
                        required
                        className={`${inputBase} pr-11`}
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)'; setPwFocused(true) }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(184,175,240,0.3)'; setPwFocused(false) }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? <EyeOff size={15} style={{ color: '#B8AFF0' }} /> : <Eye size={15} style={{ color: '#B8AFF0' }} />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    <AnimatePresence>
                      {form.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          {/* 4 bar segments */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(184,175,240,0.2)' }}>
                                <motion.div
                                  className="h-full rounded-full"
                                  animate={{
                                    width: strength && i <= strength.bars ? '100%' : '0%',
                                    background: strength?.color ?? '#B8AFF0',
                                  }}
                                  transition={{ duration: 0.3, delay: i * 0.05 }}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Label */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold" style={{ color: strength?.color ?? '#B8AFF0' }}>
                              {strength?.label}
                            </span>
                            <Shield size={11} style={{ color: strength?.color ?? '#B8AFF0' }} />
                          </div>

                          {/* Rules checklist — show when focused or weak */}
                          <AnimatePresence>
                            {(pwFocused || (strength && strength.level < 4)) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1"
                              >
                                {RULES.map((rule) => {
                                  const ok = rule.test(form.password)
                                  return (
                                    <motion.div
                                      key={rule.id}
                                      animate={{ opacity: ok ? 1 : 0.6 }}
                                      className="flex items-center gap-1.5"
                                    >
                                      <motion.div
                                        animate={{ scale: ok ? [1, 1.3, 1] : 1 }}
                                        transition={{ duration: 0.25 }}
                                      >
                                        <CheckCircle2
                                          size={11}
                                          style={{ color: ok ? '#10B981' : '#D1D5DB' }}
                                        />
                                      </motion.div>
                                      <span className="text-[10.5px]" style={{ color: ok ? '#2D2B3D' : '#9CA3AF' }}>
                                        {rule.label}
                                      </span>
                                    </motion.div>
                                  )
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B8AFF0' }} />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={update('confirmPassword')}
                        placeholder="Confirmar contraseña"
                        required
                        className={`${inputBase} pr-11`}
                        style={{
                          ...inputStyle,
                          borderColor: form.confirmPassword
                            ? passwordsMatch ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.4)'
                            : 'rgba(184,175,240,0.3)',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(13,110,253,0.5)')}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = form.confirmPassword
                            ? passwordsMatch ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.4)'
                            : 'rgba(184,175,240,0.3)'
                        }}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showConfirm ? <EyeOff size={15} style={{ color: '#B8AFF0' }} /> : <Eye size={15} style={{ color: '#B8AFF0' }} />}
                      </button>
                    </div>

                    <AnimatePresence>
                      {form.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs flex items-center gap-1 pl-1"
                          style={{ color: passwordsMatch ? '#10B981' : '#EF4444' }}
                        >
                          <CheckCircle2 size={11} />
                          {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #0D6EFD 0%, #9E94DF 100%)',
                      boxShadow: '0 4px 20px rgba(13,110,253,0.3)',
                    }}
                  >
                    {/* shimmer */}
                    <motion.span
                      className="absolute inset-0 -skew-x-12"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
                      aria-hidden="true"
                    />
                    <span className="relative z-10">
                      {loading ? 'Creando cuenta…' : 'Crear mi cuenta'}
                    </span>
                  </motion.button>

                  {/* Privacy note */}
                  <p className="text-center text-xs" style={{ color: '#9CA3AF' }}>
                    🔒 Tus datos están cifrados y protegidos. Nunca los compartimos.
                  </p>
                </form>

                <p className="text-center text-sm mt-5" style={{ color: '#7A788F' }}>
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
