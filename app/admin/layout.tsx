import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel Admin | Psic. Cristal Hernandez',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
