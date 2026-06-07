import { useAppSettings } from '../context/AppSettings'

import type { TranslationKey } from '../i18n/translations'

const SECTIONS: { title: TranslationKey; body: TranslationKey }[] = [
  { title: 'rules.sections.draft.title', body: 'rules.sections.draft.body' },
  { title: 'rules.sections.lineup.title', body: 'rules.sections.lineup.body' },
  { title: 'rules.sections.stats.title', body: 'rules.sections.stats.body' },
  { title: 'rules.sections.ffi.title', body: 'rules.sections.ffi.body' },
  { title: 'rules.sections.win.title', body: 'rules.sections.win.body' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function RulesModal({ open, onClose }: Props) {
  const { t } = useAppSettings()
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="iz-panel max-w-lg w-full max-h-[85vh] overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="rules-title"
      >
        <div className="iz-panel-head flex items-center justify-between gap-4">
          <span id="rules-title">{t('rules.title')}</span>
          <button type="button" onClick={onClose} className="iz-nav-btn !text-[0.6rem] !py-0.5 shrink-0">
            {t('rules.close')}
          </button>
        </div>
        <div className="iz-panel-body overflow-y-auto space-y-5 max-h-[70vh]">
          {SECTIONS.map(s => (
            <section key={s.title}>
              <h3 className="font-heading text-sm font-bold text-accent mb-1">{t(s.title)}</h3>
              <p className="text-sm text-iz-text leading-relaxed">{t(s.body)}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
