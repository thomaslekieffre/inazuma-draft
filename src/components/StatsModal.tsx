import { useEffect, useState } from 'react'
import { useAppSettings } from '../context/AppSettings'
import type { TranslationKey } from '../i18n/translations'
import { isAnalyticsEnabled } from '../lib/analytics'
import { isDevMode } from '../lib/dev-mode'
import { fetchGlobalMetrics, type GlobalMetrics } from '../lib/global-metrics'
import { loadLocalStats, resetLocalStats } from '../lib/local-stats'
import { SITE } from '../config/site'

interface Props {
  open: boolean
  onClose: () => void
  onReset?: () => void
}

type StatRow = { key: TranslationKey; value: number | string }

function StatList({ rows }: { rows: StatRow[] }) {
  const { t } = useAppSettings()
  return (
    <dl className="space-y-2">
      {rows.map(({ key, value }) => (
        <div key={key} className="flex items-center justify-between gap-3 text-sm">
          <dt className="text-iz-muted">{t(key)}</dt>
          <dd className="font-heading font-bold text-iz-cyan tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function StatsModal({ open, onClose, onReset }: Props) {
  const { t } = useAppSettings()
  const dev = isDevMode()
  const [global, setGlobal] = useState<GlobalMetrics | null>(null)
  const [globalLoading, setGlobalLoading] = useState(false)

  useEffect(() => {
    if (!open || !dev) return
    setGlobalLoading(true)
    fetchGlobalMetrics()
      .then(setGlobal)
      .finally(() => setGlobalLoading(false))
  }, [open, dev])

  if (!open) return null

  const s = loadLocalStats()
  const localRows: StatRow[] = [
    { key: 'stats.local.runs', value: s.runsStarted },
    { key: 'stats.local.uniquePlayers', value: s.uniquePlayerIds.length },
    { key: 'stats.local.totalPicks', value: s.totalPicks },
    { key: 'stats.local.uniqueTeams', value: s.uniqueTeams.length },
    { key: 'stats.local.totalRolls', value: s.totalRolls },
    { key: 'stats.local.finals', value: s.finalsReached },
    { key: 'stats.local.championships', value: s.championships },
    { key: 'stats.local.elimGroups', value: s.eliminatedGroups },
    { key: 'stats.local.elimSemi', value: s.eliminatedSemi },
    { key: 'stats.local.finalLosses', value: s.finalLosses },
  ]

  const globalRows: StatRow[] = global
    ? [
        { key: 'stats.global.visits', value: global.visits ?? '—' },
        { key: 'stats.global.runs', value: global.runs ?? '—' },
        { key: 'stats.global.drafts', value: global.drafts ?? '—' },
        { key: 'stats.global.finals', value: global.finals ?? '—' },
      ]
    : []

  function handleReset() {
    if (!confirm(t('stats.local.resetConfirm'))) return
    resetLocalStats()
    onReset?.()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="card max-w-sm w-full max-h-[85vh] overflow-y-auto p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="stats-title"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="stats-title" className="font-heading text-xl font-bold text-iz-heading">
              {t(dev ? 'stats.title.dev' : 'stats.local.title')}
            </h2>
            <p className="text-xs text-iz-muted mt-1">
              {t(dev ? 'stats.global.hint' : 'stats.local.hint')}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-secondary text-xs py-1 px-3 shrink-0">
            {t('stats.local.close')}
          </button>
        </div>

        {dev && (
          <section className="mb-6 pb-6 border-b divider-iz">
            <h3 className="font-heading text-xs text-iz-orange uppercase font-bold mb-2">
              {t('stats.global.title')}
            </h3>
            {globalLoading ? (
              <p className="text-xs text-iz-muted">{t('stats.global.loading')}</p>
            ) : (
              <StatList rows={globalRows} />
            )}
            <p className="text-[11px] text-iz-muted mt-3 leading-relaxed">
              {t('stats.global.uniqueNote')}
            </p>
            {isAnalyticsEnabled() && (
              <p className="text-[11px] text-iz-cyan mt-2">{t('stats.global.posthogOn')}</p>
            )}
            <p className="text-[11px] text-iz-muted mt-2">
              <a
                href={`https://vercel.com/analytics`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-iz-cyan hover:underline"
              >
                Vercel Analytics
              </a>
              {' · '}
              <a href={SITE.url} className="text-iz-cyan hover:underline">
                {SITE.url}
              </a>
            </p>
          </section>
        )}

        {!dev && (
          <p className="text-[11px] text-iz-muted mb-4">
            {t('stats.dev.unlock')}{' '}
            <code className="text-iz-cyan">?dev=1</code>
          </p>
        )}

        <section>
          <h3 className="font-heading text-xs text-iz-cyan uppercase font-bold mb-2">
            {t('stats.local.section')}
          </h3>
          <StatList rows={localRows} />
        </section>

        <button type="button" onClick={handleReset} className="btn-secondary w-full mt-6 text-xs">
          {t('stats.local.reset')}
        </button>
      </div>
    </div>
  )
}
