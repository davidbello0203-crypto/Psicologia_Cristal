'use client'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8 text-xs', text: 'text-sm' },
    md: { container: 'w-10 h-10 text-sm', text: 'text-base' },
    lg: { container: 'w-14 h-14 text-base', text: 'text-xl' },
  }

  const s = sizes[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${s.container} rounded-xl flex items-center justify-center font-bold text-white relative overflow-hidden`}
        style={{ background: 'linear-gradient(135deg, #0D6EFD 0%, #B8AFF0 100%)' }}
        aria-hidden="true"
      >
        <span className="relative z-10 font-heading tracking-tight">
          CH
        </span>
        <span
          className="absolute -bottom-1 -right-1 text-white/20 font-bold"
          style={{ fontSize: '1.4em' }}
        >
          Ψ
        </span>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`${s.text} font-heading font-bold`}
          style={{ color: '#0D6EFD' }}
        >
          Cristal Hernandez
        </span>
        <span className="text-xs font-body" style={{ color: '#7A788F' }}>
          Psicóloga
        </span>
      </div>
    </div>
  )
}
