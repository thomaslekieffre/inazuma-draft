import type { ReactNode } from 'react'
import TopBar from './TopBar'
import SiteFooter from './SiteFooter'
import AdSlot from './AdSlot'

interface Props {
  children: ReactNode
  variant?: 'default' | 'landing'
}

function MobileAdRow() {
  return (
    <div className="xl:hidden px-4 pt-3 pb-1 shrink-0">
      <div className="flex gap-2 max-w-md mx-auto">
        <AdSlot className="flex-1 min-w-0" />
        <AdSlot className="flex-1 min-w-0" />
      </div>
    </div>
  )
}

function ContentShell({ children, variant }: { children: ReactNode; variant: 'default' | 'landing' }) {
  return (
    <div className="flex-1 flex flex-col xl:flex-row min-h-0">
      <MobileAdRow />

      <aside className="hidden xl:flex w-32 2xl:w-40 shrink-0 px-3 py-4 flex-col self-stretch">
        <AdSlot variant="rail" className="flex-1 min-h-0" />
      </aside>

      <main className={`flex-1 min-w-0 ${variant === 'landing' ? 'flex flex-col' : ''}`}>
        {children}
      </main>

      <aside className="hidden xl:flex w-32 2xl:w-40 shrink-0 px-3 py-4 flex-col self-stretch">
        <AdSlot variant="rail" className="flex-1 min-h-0" />
      </aside>
    </div>
  )
}

export default function AppLayout({ children, variant = 'default' }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <ContentShell variant={variant}>{children}</ContentShell>
      <SiteFooter />
    </div>
  )
}
