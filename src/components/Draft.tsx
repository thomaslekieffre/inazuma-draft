import { useState, useMemo } from 'react'
import type { DraftPool, Player } from '../types'
import { getDraftPools, getTeamRoster, isPlayerInPoolRoster } from '../data/players'
import { displayPoolLabel, draftPoolKey } from '../data/draft-pools'
import {
  autoPlacePlayer,
  compatibleEmptySlots,
  getFormation,
  missingPositions,
  remapLineupToFormation,
  sortPlayersByPosition,
  type FormationId,
  type LineupMap,
} from '../lib/lineup'
import { useAppSettings } from '../context/AppSettings'
import PlayerCard from './PlayerCard'
import PitchFormation from './PitchFormation'
import BoxScore from './BoxScore'
import FormationSelector from './FormationSelector'
import { lineupPower } from '../lib/power'

const TOTAL_ROUNDS = 11
const TOTAL_REROLLS = 3
const POS_ORDER = ['GK', 'DF', 'MF', 'FW'] as const

interface Props {
  mode: 'classic' | 'memory'
  onComplete: (players: Player[], lineup: LineupMap, poolsRolled: string[]) => void
}

export default function Draft({ mode, onComplete }: Props) {
  const { t } = useAppSettings()
  const [round, setRound] = useState(1)
  const [drafted, setDrafted] = useState<Player[]>([])
  const [lineup, setLineup] = useState<LineupMap>({})
  const [formationId, setFormationId] = useState<FormationId>('433')
  const [rolledPool, setRolledPool] = useState<DraftPool | null>(null)
  const [rolledRoster, setRolledRoster] = useState<Player[]>([])
  const [rolling, setRolling] = useState(false)
  const [rerollsLeft, setRerollsLeft] = useState(TOTAL_REROLLS)
  const [lastPoolKey, setLastPoolKey] = useState<string | null>(null)
  const [poolsRolled, setPoolsRolled] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const pools = getDraftPools()
  const missing = useMemo(() => missingPositions(lineup, formationId), [lineup, formationId])
  const formation = getFormation(formationId)
  const totalPower = useMemo(() => lineupPower(lineup, formationId), [lineup, formationId])

  function changeFormation(id: FormationId) {
    setFormationId(id)
    if (Object.keys(lineup).length > 0) {
      setLineup(remapLineupToFormation(lineup, id))
    }
    setError(null)
  }

  function drawPool(isReroll: boolean) {
    if (isReroll && rerollsLeft <= 0) return
    setError(null)
    setRolling(true)
    setRolledPool(null)
    setRolledRoster([])
    if (isReroll) setRerollsLeft(r => r - 1)

    setTimeout(() => {
      let pool: DraftPool
      do {
        pool = pools[Math.floor(Math.random() * pools.length)]
      } while (draftPoolKey(pool) === lastPoolKey && pools.length > 1)

      setRolledPool(pool)
      setRolledRoster(getTeamRoster(pool))
      setPoolsRolled(prev => [...prev, draftPoolKey(pool)])
      setRolling(false)
    }, 800)
  }

  function roll() {
    drawPool(false)
  }

  function reroll() {
    drawPool(true)
  }

  function assertInRoster(player: Player): boolean {
    if (!rolledPool) {
      setError(t('draft.err.rollFirst'))
      return false
    }
    if (!isPlayerInPoolRoster(player, rolledPool) || !rolledRoster.some(p => p.id === player.id)) {
      setError(t('draft.err.notInRoster', { name: player.name, team: displayPoolLabel(rolledPool) }))
      return false
    }
    return true
  }

  function pick(player: Player) {
    setError(null)
    if (!assertInRoster(player)) return

    if (compatibleEmptySlots(lineup, player, formationId).length === 0) {
      setError(t('draft.err.noSlot', {
        pos: player.position,
        missing: missing.map(m => `${m.count}× ${m.role}`).join(', '),
      }))
      return
    }

    const nextLineup = autoPlacePlayer(lineup, player, formationId)
    if (!nextLineup) {
      setError(t('draft.err.cantPlace', { name: player.name, pos: player.position }))
      return
    }

    const nextDrafted = [...drafted, player]
    setLineup(nextLineup)
    setDrafted(nextDrafted)
    setLastPoolKey(rolledPool ? draftPoolKey(rolledPool) : null)
    setRolledPool(null)
    setRolledRoster([])

    if (nextDrafted.length >= TOTAL_ROUNDS) {
      onComplete(nextDrafted, nextLineup, poolsRolled)
    } else {
      setRound(r => r + 1)
    }
  }

  const pool = useMemo(() => {
    if (!rolledPool || rolledRoster.length === 0) return []
    const draftedIds = new Set(drafted.map(d => d.id))
    return sortPlayersByPosition(
      rolledRoster.filter(p => !draftedIds.has(p.id)),
    )
  }, [rolledPool, rolledRoster, drafted])

  const poolByPos = useMemo(() => {
    const groups: Record<string, Player[]> = { GK: [], DF: [], MF: [], FW: [] }
    for (const p of pool) groups[p.position].push(p)
    return groups
  }, [pool])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-2xl font-bold text-iz-heading">
            {t('draft.title')} <span className="text-accent">{t('draft.team')}</span>
          </h2>
          <div className="text-sm text-iz-muted text-right">
            <div>{t('draft.round', { current: round, total: TOTAL_ROUNDS })}</div>
            <div className="text-xs mt-0.5">
              {t('draft.rerollsGlobal', { left: rerollsLeft, total: TOTAL_REROLLS })}
            </div>
            {mode === 'classic' && (
              <div className="text-xs mt-0.5">
                {t('stats.teamPower')}{' '}
                <span className="text-iz-cyan font-bold tabular-nums">{totalPower}</span>
              </div>
            )}
          </div>
        </div>

        {missing.length > 0 && (
          <p className="text-xs text-iz-muted mb-4">
            {t('draft.missing')}{' '}
            {missing.map(m => (
              <span key={m.role} className="text-iz-cyan mr-2 font-bold">{m.count}× {m.role}</span>
            ))}
          </p>
        )}

        {error && (
          <div className="mb-4 alert-error animate-fade-in">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(380px,480px)_260px] gap-6">
          <div className="flex flex-col min-h-[480px]">
            {!rolledPool && !rolling && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-iz-muted text-sm text-center">
                  {t('draft.rollHint', { rerolls: TOTAL_REROLLS })}
                </p>
                <button type="button" onClick={roll} className="btn-primary text-2xl px-16 py-6 animate-pulse-gold">
                  {t('draft.roll')}
                </button>
              </div>
            )}
            {rolling && (
              <div className="flex-1 flex items-center justify-center text-2xl font-heading text-accent animate-pulse">
                {t('draft.rolling')}
              </div>
            )}
            {rolledPool && !rolling && (
              <div className="animate-slide-up">
                <div className="text-center mb-4 pb-4 border-b divider-iz">
                  <p className="text-xs text-iz-cyan uppercase tracking-widest mb-1 font-heading font-bold">
                    {t('draft.roster')}
                  </p>
                  <h3 className="font-heading text-3xl font-black text-inazuma">{displayPoolLabel(rolledPool)}</h3>
                  <p className="text-iz-muted text-sm mt-1">
                    {t('draft.pool', { left: pool.length, total: rolledRoster.length })}
                  </p>
                  {rerollsLeft > 0 && (
                    <button
                      type="button"
                      onClick={reroll}
                      disabled={rolling}
                      className="btn-secondary mt-3 text-sm"
                    >
                      {t('draft.reroll', { left: rerollsLeft, total: TOTAL_REROLLS })}
                    </button>
                  )}
                </div>

                {POS_ORDER.map(pos => {
                  const players = poolByPos[pos]
                  if (players.length === 0) return null
                  const slotsLeft = compatibleEmptySlots(lineup, players[0], formationId).length
                  return (
                    <div key={pos} className="mb-4">
                      <h4 className="font-heading text-xs text-iz-cyan uppercase mb-2 flex items-center gap-2 font-bold">
                        {pos}
                        <span className="text-iz-muted">({players.length})</span>
                        {slotsLeft === 0 && <span className="text-red-400">— {t('draft.full')}</span>}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {players.map(p => {
                          const canPick = compatibleEmptySlots(lineup, p, formationId).length > 0
                          return (
                            <PlayerCard
                              key={p.id}
                              player={p}
                              mode={mode}
                              teamLabel={displayPoolLabel(rolledPool)}
                              onClick={canPick ? () => pick(p) : undefined}
                              disabled={!canPick}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <FormationSelector value={formationId} onChange={changeFormation} />
            <p className="text-xs text-iz-muted uppercase tracking-wider font-heading">{formation.label}</p>
            <PitchFormation lineup={lineup} formationId={formationId} strict size="lg" />
          </div>

          <BoxScore lineup={lineup} formationId={formationId} strict showPower={mode === 'classic'} />
        </div>
      </div>
    </div>
  )
}
