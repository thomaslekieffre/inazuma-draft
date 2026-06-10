import { useRef, useState } from 'react'
import type { FormationId, LineupMap } from '../lib/lineup'
import { getRunSeed } from '../lib/run-rng'
import { downloadNodePng } from '../lib/export-image'
import { useAppSettings } from '../context/AppSettings'
import TeamShareCard from './TeamShareCard'

interface Props {
  lineup: LineupMap
  formationId: FormationId
  mode: 'classic' | 'memory'
  won?: boolean
  className?: string
}

export default function ExportTeamButton({ lineup, formationId, mode, won, className = '' }: Props) {
  const { t } = useAppSettings()
  const ref = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)

  async function exportImage() {
    if (!ref.current || busy) return
    setBusy(true)
    try {
      await downloadNodePng(ref.current, `inazuma-japan-${getRunSeed() ?? 'team'}.png`)
    } catch {
      // ignore export failures (CORS images, etc.)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void exportImage()}
        disabled={busy}
        className={`btn-secondary ${className}`.trim()}
      >
        {busy ? t('export.busy') : t('export.image')}
      </button>
      <div className="team-share-card-host" aria-hidden>
        <TeamShareCard
          ref={ref}
          lineup={lineup}
          formationId={formationId}
          mode={mode}
          seed={getRunSeed()}
          won={won}
        />
      </div>
    </>
  )
}
