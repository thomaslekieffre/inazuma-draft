import { useState } from 'react'
import { useAppSettings } from '../context/AppSettings'
import RulesModal from './RulesModal'

export default function TopBar() {
  const { theme, locale, toggleTheme, setLocale, t } = useAppSettings()
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b divider-iz bg-iz-bar backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            className="text-xs font-heading font-bold text-iz-cyan hover:text-iz-orange transition-colors"
          >
            📖 {t('nav.rules')}
          </button>

          <div className="flex items-center gap-1">
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
    </>
  )
}
