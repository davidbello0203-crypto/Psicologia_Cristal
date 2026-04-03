import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Psic. Cristal Hernandez | Psicóloga | Bienestar Emocional',
  description:
    'Psicóloga clínica y educativa en Guerrero, México. Servicios de atención psicológica individual en línea y presencial. Especialista en ansiedad, depresión, trauma y bienestar emocional.',
  keywords: [
    'psicóloga',
    'psicología clínica',
    'terapia individual',
    'bienestar emocional',
    'salud mental',
    'ansiedad',
    'depresión',
    'trauma',
    'psicología en línea',
    'Guerrero',
    'México',
    'Cristal Hernandez',
  ],
  authors: [{ name: 'Cristal Hernandez' }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    title: 'Psic. Cristal Hernandez | Psicóloga',
    description:
      'Espacio seguro y sin prejuicios para tu bienestar emocional. Atención psicológica individual en línea y presencial.',
    siteName: 'Cristal Hernandez Psicóloga',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psic. Cristal Hernandez | Psicóloga',
    description:
      'Espacio seguro y sin prejuicios para tu bienestar emocional.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="theme-color" content="#0D6EFD" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
