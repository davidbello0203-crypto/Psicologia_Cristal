import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Portal | Psic. Cristal Hernandez',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
