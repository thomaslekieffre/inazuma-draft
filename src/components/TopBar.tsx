import { useState } from 'react'
import { SITE } from '../config/site'
import { useAppSettings } from '../context/AppSettings'
import RulesModal from './RulesModal'
import StatsModal from './StatsModal'

export default function TopBar() {
  const { theme, locale, toggleTheme, setLocale, t } = useAppSettings()
  const [rulesOpen, setRulesOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [statsTick, setStatsTick] = useState(0)

  return (
    <>
      <header className="sticky top-0 z-40 border-b divider-iz bg-iz-bar backdrop-blur-md">
        <div className="relative max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 shrink-0 z-10">
            <button
              type="button"
              onClick={() => setStatsOpen(true)}
              className="text-xs font-heading font-bold text-iz-cyan hover:text-iz-orange transition-colors"
            >
              📊 {t('nav.stats')}
            </button>
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="text-xs font-heading font-bold text-iz-cyan hover:text-iz-orange transition-colors"
            >
              📖 {t('nav.rules')}
            </button>
          </div>

          <a
            href={SITE.url}
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img src="/favicon.svg" alt="" className="w-8 h-8 rounded-lg shadow-iz-orange" width={32} height={32} />
            <span className="font-heading font-black text-sm tracking-tight hidden sm:inline">
              <span className="text-inazuma">FFI</span>
              <span className="text-iz-heading"> 6-0</span>
            </span>
          </a>

          <div className="flex items-center gap-1 shrink-0 z-10">
            <div className="seg-group">
              {(['fr', 'en'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={`seg-btn seg-btn--sm ${locale === l ? 'seg-btn--on' : 'seg-btn--off'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary text-xs py-1 px-2.5 ml-1"
              title={theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>
      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <StatsModal
        key={statsTick}
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        onReset={() => setStatsTick(n => n + 1)}
      />
    </>
  )
}
