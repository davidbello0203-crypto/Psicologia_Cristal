'use client'

import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'w-10 h-10', text: 'text-base' },
    lg: { container: 'w-14 h-14', text: 'text-xl' },
  }

  const s = sizes[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${s.container} rounded-xl overflow-hidden flex-shrink-0 relative`}
        style={{ boxShadow: '0 2px 8px rgba(13,110,253,0.2)' }}
      >
        <Image
          src="/images/cristal.jpg"
          alt="Cristal Hernandez"
          fill
          className="object-cover object-top"
        />
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
