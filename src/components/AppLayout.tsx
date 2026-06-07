import type { ReactNode } from 'react'
import TopBar from './TopBar'
import SiteFooter from './SiteFooter'

interface Props {
  children: ReactNode
  variant?: 'default' | 'landing'
}

export default function AppLayout({ children, variant = 'default' }: Props) {
  const isLanding = variant === 'landing'

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col">
      <TopBar />
      <main className={`flex-1 min-w-0 ${isLanding ? 'flex flex-col items-center justify-center' : ''}`}>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
