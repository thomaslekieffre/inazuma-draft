import { useAppSettings } from '../context/AppSettings'

import type { TranslationKey } from '../i18n/translations'

const SECTIONS: { title: TranslationKey; body: TranslationKey }[] = [
  { title: 'rules.sections.draft.title', body: 'rules.sections.draft.body' },
  { title: 'rules.sections.lineup.title', body: 'rules.sections.lineup.body' },
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
        className="card max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="rules-title"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 id="rules-title" className="font-heading text-xl font-bold text-iz-heading">
            {t('rules.title')}
          </h2>
          <button type="button" onClick={onClose} className="btn-secondary text-xs py-1 px-3 shrink-0">
            {t('rules.close')}
          </button>
        </div>
        <div className="space-y-5">
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
