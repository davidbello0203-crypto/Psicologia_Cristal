'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  CloudRain,
  Users,
  Heart,
  Briefcase,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Phone,
  Hash,
  Calendar,
  Clock,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  name: string
  whatsapp: string
  age: string
  motivos: string[]
  distressLevel: number
  previousTherapy: boolean
  onMedication: boolean
  datePreference: string
  timePreference: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MOTIVOS = [
  { id: 'anxiety',     label: 'Ansiedad',   icon: Brain,       color: '#0D6EFD' },
  { id: 'depression',  label: 'Depresión',  icon: CloudRain,   color: '#63BFEA' },
  { id: 'relaciones',  label: 'Relaciones', icon: Users,       color: '#F2A7B8' },
  { id: 'duelo',       label: 'Duelo',      icon: Heart,       color: '#A8D8EA' },
  { id: 'carrera',     label: 'Carrera',    icon: Briefcase,   color: '#0D6EFD' },
  { id: 'otros',       label: 'Otros',      icon: HelpCircle,  color: '#B8AFF0' },
]

const DATE_OPTIONS = ['Lo antes posible', 'Esta semana', 'Este mes']
const TIME_OPTIONS = ['Mañana (8–12h)', 'Tarde (12–18h)', 'Noche (18–21h)']
const TOTAL_STEPS = 4

// ── Animation variants ────────────────────────────────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 56 : -56,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.38, ease: EASE_OUT },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -56 : 56,
    opacity: 0,
    transition: { duration: 0.24, ease: EASE_OUT },
  }),
}

// ── Floating Label Input ──────────────────────────────────────────────────────

interface FloatingInputProps {
  id: string
  label: string
  icon: React.ElementType
  type?: string
  error?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  // Spread from register()
  name: string
  ref: React.Ref<HTMLInputElement>
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onBlur: React.FocusEventHandler<HTMLInputElement>
}

function FloatingInput({
  id, label, icon: Icon, type = 'text', error, inputMode, ...rest
}: FloatingInputProps) {
  return (
    <div>
      <div className="relative">
        <div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          aria-hidden="true"
        >
          <Icon size={15} style={{ color: '#B8AFF0' }} />
        </div>

        <input
          id={id}
          type={type}
          inputMode={inputMode}
          placeholder=" "
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={[
            'peer w-full pl-9 pr-4 pt-6 pb-2 rounded-xl text-sm',
            'outline-none transition-all duration-200',
            'focus:shadow-[0_0_0_3px_rgba(13,110,253,0.12)]',
            error
              ? 'border border-red-300/60'
              : 'border border-[#B8AFF0]/30 focus:border-[#0D6EFD]/50',
          ].join(' ')}
          style={{ background: 'rgba(255,255,255,0.65)', color: '#2D2B3D' }}
          {...rest}
        />

        <label
          htmlFor={id}
          className={[
            'absolute left-9 pointer-events-none select-none',
            'transition-all duration-200 text-sm',
            // Floated up state
            'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10.5px] peer-focus:font-semibold peer-focus:text-[#0D6EFD]',
            // Has value state (placeholder not shown)
            'peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10.5px]',
            // Default (empty + unfocused): vertically centered
            'top-1/2 -translate-y-1/2',
          ].join(' ')}
          style={{ color: '#9A98AF' }}
        >
          {label}
        </label>
      </div>

      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1 text-[11px] pl-1" style={{ color: '#C04A4A' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({
  id, label, checked, onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.45)' }}
    >
      <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none" style={{ color: '#2D2B3D' }}>
        {label}
      </label>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6EFD] focus-visible:ring-offset-1"
        style={{ background: checked ? '#0D6EFD' : '#D4D2E8' }}
      >
        <motion.div
          layout
          className="absolute top-1 w-4 h-4 bg-white rounded-full"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }}
          animate={{ left: checked ? '24px' : '4px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      </button>
    </div>
  )
}

// ── Step 1: Basic Info ────────────────────────────────────────────────────────

function Step1({ register, errors }: { register: ReturnType<typeof useForm<FormData>>['register']; errors: Record<string, { message?: string }> }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold leading-tight" style={{ color: '#2D2B3D' }}>
          Cuéntame un poco sobre ti
        </h2>
        <p className="text-sm mt-1" style={{ color: '#7A788F' }}>
          Esta información es completamente confidencial.
        </p>
      </div>

      <FloatingInput
        id="name"
        label="Nombre completo"
        icon={User}
        error={errors.name?.message}
        {...register('name', { required: 'Tu nombre es requerido' })}
      />
      <FloatingInput
        id="whatsapp"
        label="WhatsApp"
        icon={Phone}
        type="tel"
        inputMode="tel"
        error={errors.whatsapp?.message}
        {...register('whatsapp', {
          required: 'Tu WhatsApp es requerido',
          pattern: { value: /^[\d\s+\-()\u002B]{8,}$/, message: 'Ingresa un número válido' },
        })}
      />
      <FloatingInput
        id="age"
        label="Edad"
        icon={Hash}
        type="number"
        inputMode="numeric"
        error={errors.age?.message}
        {...register('age', {
          required: 'Tu edad es requerida',
          min: { value: 5, message: 'Edad mínima: 5 años' },
          max: { value: 110, message: 'Verifica tu edad' },
        })}
      />
    </div>
  )
}

// ── Step 2: Reason ────────────────────────────────────────────────────────────

function Step2({
  watch,
  setValue,
}: {
  watch: ReturnType<typeof useForm<FormData>>['watch']
  setValue: ReturnType<typeof useForm<FormData>>['setValue']
}) {
  const selected: string[] = watch('motivos') ?? []

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id]
    setValue('motivos', next, { shouldValidate: true })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold leading-tight" style={{ color: '#2D2B3D' }}>
          ¿Qué te trae aquí hoy?
        </h2>
        <p className="text-sm mt-1" style={{ color: '#7A788F' }}>
          Puedes seleccionar más de una opción.
        </p>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        role="group"
        aria-label="Motivo de consulta"
      >
        {MOTIVOS.map(({ id, label, icon: Icon, color }) => {
          const isSelected = selected.includes(id)
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              animate={isSelected ? { scale: [1, 1.07, 1] } : {}}
              transition={{ duration: 0.25 }}
              aria-pressed={isSelected}
              aria-label={label}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: isSelected ? `${color}1A` : 'rgba(255,255,255,0.55)',
                border: isSelected
                  ? `1.5px solid ${color}`
                  : '1.5px solid rgba(184,175,240,0.22)',
                boxShadow: isSelected ? `0 0 18px ${color}2E` : 'none',
              }}
            >
              <Icon size={22} style={{ color }} aria-hidden="true" />
              <span className="text-xs font-semibold text-center" style={{ color: '#2D2B3D' }}>
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 3: Clinical Context ──────────────────────────────────────────────────

function Step3({
  watch,
  setValue,
}: {
  watch: ReturnType<typeof useForm<FormData>>['watch']
  setValue: ReturnType<typeof useForm<FormData>>['setValue']
}) {
  const distress: number = watch('distressLevel') ?? 5
  const prevTherapy: boolean = watch('previousTherapy') ?? false
  const onMed: boolean = watch('onMedication') ?? false

  const distressColor =
    distress <= 3 ? '#7CC4E0' : distress <= 6 ? '#B8AFF0' : '#F2A7B8'

  const trackGradient = `linear-gradient(to right, ${distressColor} 0%, ${distressColor} ${
    ((distress - 1) / 9) * 100
  }%, rgba(184,175,240,0.25) ${((distress - 1) / 9) * 100}%, rgba(184,175,240,0.25) 100%)`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold leading-tight" style={{ color: '#2D2B3D' }}>
          Contexto clínico
        </h2>
        <p className="text-sm mt-1" style={{ color: '#7A788F' }}>
          Esto me ayuda a preparar mejor tu primera sesión.
        </p>
      </div>

      {/* Distress slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="distress-slider"
            className="text-sm font-medium"
            style={{ color: '#2D2B3D' }}
          >
            Nivel de malestar actual
          </label>
          <AnimatePresence mode="wait">
            <motion.span
              key={distress}
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.75, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-xl font-bold tabular-nums leading-none"
              style={{ color: distressColor }}
            >
              {distress}
              <span className="text-xs font-normal ml-0.5" style={{ color: '#7A788F' }}>
                /10
              </span>
            </motion.span>
          </AnimatePresence>
        </div>

        <input
          id="distress-slider"
          type="range"
          min={1}
          max={10}
          step={1}
          value={distress}
          onChange={(e) => setValue('distressLevel', Number(e.target.value))}
          aria-label="Nivel de malestar del 1 al 10"
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={distress}
          className="triage-slider w-full h-2 rounded-full appearance-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0D6EFD]/40"
          style={{ background: trackGradient, accentColor: distressColor }}
        />

        <div className="flex justify-between">
          <span className="text-[11px]" style={{ color: '#7A788F' }}>Leve</span>
          <span className="text-[11px]" style={{ color: '#7A788F' }}>Severo</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2.5">
        <Toggle
          id="prev-therapy"
          label="¿Has tenido terapia antes?"
          checked={prevTherapy}
          onChange={(v) => setValue('previousTherapy', v)}
        />
        <Toggle
          id="on-medication"
          label="¿Actualmente tomas medicación?"
          checked={onMed}
          onChange={(v) => setValue('onMedication', v)}
        />
      </div>
    </div>
  )
}

// ── Step 4: Finalize ──────────────────────────────────────────────────────────

function Step4({
  watch,
  setValue,
}: {
  watch: ReturnType<typeof useForm<FormData>>['watch']
  setValue: ReturnType<typeof useForm<FormData>>['setValue']
}) {
  const datePreference: string = watch('datePreference') ?? ''
  const timePreference: string = watch('timePreference') ?? ''

  const optionStyle = (active: boolean) => ({
    background: active ? 'rgba(13,110,253,0.12)' : 'rgba(255,255,255,0.5)',
    border: active ? '1.5px solid #0D6EFD' : '1.5px solid rgba(184,175,240,0.22)',
    color: active ? '#0D6EFD' : '#7A788F',
  })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold leading-tight" style={{ color: '#2D2B3D' }}>
          ¿Cuándo prefieres tu sesión?
        </h2>
        <p className="text-sm mt-1" style={{ color: '#7A788F' }}>
          Te contactaré para confirmar disponibilidad.
        </p>
      </div>

      {/* Date preference */}
      <div className="space-y-2">
        <p className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wide" style={{ color: '#7A788F' }}>
          <Calendar size={13} aria-hidden="true" /> Fecha preferida
        </p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Preferencia de fecha">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue('datePreference', opt)}
              aria-pressed={datePreference === opt}
              className="py-2.5 px-2 rounded-xl text-[11.5px] font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 leading-snug"
              style={optionStyle(datePreference === opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Time preference */}
      <div className="space-y-2">
        <p className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wide" style={{ color: '#7A788F' }}>
          <Clock size={13} aria-hidden="true" /> Horario preferido
        </p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Preferencia de horario">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue('timePreference', opt)}
              aria-pressed={timePreference === opt}
              className="py-2.5 px-2 rounded-xl text-[11.5px] font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 leading-snug"
              style={optionStyle(timePreference === opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency disclaimer */}
      <div
        className="rounded-xl p-4 flex gap-3"
        style={{
          background: 'rgba(192,74,74,0.06)',
          border: '1px solid rgba(192,74,74,0.22)',
        }}
        role="note"
        aria-label="Aviso de emergencias"
      >
        <AlertTriangle
          size={17}
          className="flex-shrink-0 mt-0.5"
          style={{ color: '#C04A4A' }}
          aria-hidden="true"
        />
        <div>
          <p className="text-[11.5px] font-bold mb-1" style={{ color: '#C04A4A' }}>
            Protocolo de emergencias
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: '#8A4A4A' }}>
            Si estás en crisis o riesgo inmediato, llama al{' '}
            <strong>800-290-0024</strong> (SAPTEL, 24h) o acude a urgencias.
            Este formulario no reemplaza atención de emergencia.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Success Screen ────────────────────────────────────────────────────────────

function SuccessScreen({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center py-10 gap-5"
    >
      {/* Animated checkmark */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(13,110,253,0.10)' }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 52 52" className="w-12 h-12" fill="none" aria-hidden="true">
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            stroke="#0D6EFD"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.path
            d="M14 26 L22 34 L38 18"
            stroke="#0D6EFD"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }}
          />
        </svg>
      </div>

      <div>
        <h2 className="font-heading text-2xl font-bold mb-2" style={{ color: '#2D2B3D' }}>
          ¡Todo listo{name ? `, ${name.split(' ')[0]}` : ''}!
        </h2>
        <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#7A788F' }}>
          Recibí tu información. Te contactaré pronto por WhatsApp para confirmar tu cita. ¡Gracias por dar este paso!
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="flex gap-2 flex-wrap justify-center"
      >
        {['Confidencial', 'Sin compromisos', 'Respuesta rápida'].map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(184,175,240,0.2)', color: '#0D6EFD' }}
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function TriageForm() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      motivos: [],
      distressLevel: 5,
      previousTherapy: false,
      onMedication: false,
    },
  })

  const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
    1: ['name', 'whatsapp', 'age'],
    2: [],
    3: [],
    4: [],
  }

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step])
    if (!valid) return
    setDirection(1)
    setStep((s) => s + 1)
  }

  const goPrev = () => {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  const onSubmit = (data: FormData) => {
    // In a real app: send data to API/email service
    console.log('Triage form submitted:', data)
    setSubmitted(true)
  }

  const progress = submitted
    ? 100
    : Math.round(((step - 1) / TOTAL_STEPS) * 100 + (1 / TOTAL_STEPS) * 100)

  const nameValue = watch('name') ?? ''

  return (
    <div
      className="w-full max-w-lg mx-auto rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.45)',
        boxShadow:
          '0 24px 64px rgba(13,110,253,0.14), 0 1px 0 rgba(255,255,255,0.85) inset',
      }}
      role="main"
      aria-label="Formulario de pre-consulta"
    >
      {/* Progress bar */}
      <div
        className="h-1"
        style={{ background: 'rgba(184,175,240,0.18)' }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso: ${progress}%`}
      >
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, #A8D8EA 0%, #0D6EFD 100%)',
            borderRadius: '0 4px 4px 0',
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        />
      </div>

      {/* Step dots */}
      {!submitted && (
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: '#B8AFF0' }}>
            Paso {step} / {TOTAL_STEPS}
          </span>
          <div className="flex gap-1.5" role="list" aria-label="Pasos del formulario">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <motion.div
                key={i}
                role="listitem"
                aria-current={i + 1 === step ? 'step' : undefined}
                className="h-1.5 rounded-full"
                animate={{
                  width: i + 1 === step ? 20 : 8,
                  background: i + 1 <= step ? '#0D6EFD' : 'rgba(184,175,240,0.3)',
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Form body */}
      <div className="px-6 pt-4 pb-2 overflow-hidden" style={{ minHeight: '320px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          {submitted ? (
            <motion.div
              key="success"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <SuccessScreen name={nameValue} />
            </motion.div>
          ) : (
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step === 1 && <Step1 register={register} errors={errors as Record<string, { message?: string }>} />}
              {step === 2 && <Step2 watch={watch} setValue={setValue} />}
              {step === 3 && <Step3 watch={watch} setValue={setValue} />}
              {step === 4 && <Step4 watch={watch} setValue={setValue} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {!submitted && (
        <div className="px-6 pb-6 pt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 1}
            aria-label="Paso anterior"
            className="flex items-center gap-1 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2"
            style={{ color: '#7A788F', background: 'rgba(184,175,240,0.15)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184,175,240,0.25)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(184,175,240,0.15)' }}
          >
            <ChevronLeft size={15} aria-hidden="true" />
            Atrás
          </button>

          {step < TOTAL_STEPS ? (
            <motion.button
              type="button"
              onClick={goNext}
              aria-label="Siguiente paso"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 text-sm font-semibold text-white px-6 py-2.5 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D6EFD]"
              style={{
                background: 'linear-gradient(135deg, #0D6EFD 0%, #9E94DF 100%)',
                boxShadow: '0 4px 16px rgba(13,110,253,0.32)',
              }}
            >
              Siguiente
              <ChevronRight size={15} aria-hidden="true" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit(onSubmit)}
              aria-label="Enviar formulario"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 text-sm font-semibold text-white px-6 py-2.5 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D6EFD]"
              style={{
                background: 'linear-gradient(135deg, #0D6EFD 0%, #9E94DF 100%)',
                boxShadow: '0 4px 16px rgba(13,110,253,0.32)',
              }}
            >
              <Check size={15} aria-hidden="true" />
              Enviar consulta
            </motion.button>
          )}
        </div>
      )}
    </div>
  )
}
