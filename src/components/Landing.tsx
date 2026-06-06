import { useAppSettings } from '../context/AppSettings'

interface Props {
  mode: 'classic' | 'memory'
  onModeChange: (mode: 'classic' | 'memory') => void
  onStart: () => void
}

export default function Landing({ mode, onModeChange, onStart }: Props) {
  const { t } = useAppSettings()

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(0,212,255,0.03) 40px, rgba(0,212,255,0.03) 41px)',
        }}
      />

      <div className="text-center max-w-lg relative z-10">
        <p className="text-xs tracking-[0.35em] text-iz-cyan uppercase mb-4 font-heading font-bold">
          {t('landing.subtitle')}
        </p>
        <h1 className="font-heading text-6xl md:text-8xl font-black text-inazuma mb-1 drop-shadow-lg">INAZUMA</h1>
        <h1 className="font-heading text-5xl md:text-7xl font-black text-iz-heading mb-6 tracking-tight">DRAFT</h1>
        <p className="text-lg text-iz-text mb-1">{t('landing.tagline1')}</p>
        <p className="text-lg text-iz-muted mb-10">{t('landing.tagline2')}</p>

        <div className="flex gap-2 justify-center mb-8">
          {(['classic', 'memory'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => onModeChange(m)}
              className={`seg-btn seg-btn--md ${mode === m ? 'seg-btn--on' : 'seg-btn--off'}`}
            >
              {m === 'classic' ? t('landing.mode.classic') : t('landing.mode.memory')}
            </button>
          ))}
        </div>
        <p className="text-xs text-iz-muted mb-8">
          {mode === 'classic' ? t('landing.mode.classicHint') : t('landing.mode.memoryHint')}
        </p>

        <button type="button" onClick={onStart} className="btn-primary animate-pulse-gold text-xl px-12 rounded-lg">
          {t('landing.play')}
        </button>
      </div>
    </div>
  )
}
