import { useState } from 'react'
import type { Player } from '../types'
import {
  autoAssign,
  canPlace,
  getFormation,
  getFormationSlots,
  getSlot,
  isSlotValid,
  lineupToArray,
  placePlayer,
  remapLineupToFormation,
  type FormationId,
  type LineupMap,
  type SlotId,
} from '../lib/lineup'
import { useAppSettings } from '../context/AppSettings'
import PitchFormation from './PitchFormation'
import BoxScore from './BoxScore'
import PlayerCard from './PlayerCard'
import FormationSelector from './FormationSelector'
import { lineupPower } from '../lib/power'

interface Props {
  players: Player[]
  lineup: LineupMap
  mode: 'classic' | 'memory'
  onLineupChange: (lineup: LineupMap) => void
  onConfirm: () => void
}

export default function LineupReview({ players, lineup: initialLineup, mode, onLineupChange, onConfirm }: Props) {
  const { t } = useAppSettings()
  const [formationId, setFormationId] = useState<FormationId>('433')
  const [lineup, setLineup] = useState<LineupMap>(
    Object.keys(initialLineup).length ? initialLineup : autoAssign(players, '433')
  )
  const [selectedSlot, setSelectedSlot] = useState<SlotId | null>(null)
  const [movingPlayer, setMovingPlayer] = useState<Player | null>(null)
  const [error, setError] = useState<string | null>(null)

  const formation = getFormation(formationId)
  const slots = getFormationSlots(formationId)
  const all = lineupToArray(lineup, formationId)
  const totalPower = lineupPower(lineup, formationId)
  const isValid = slots.every(s => lineup[s.id] && isSlotValid(lineup, s.id, formationId)) && all.length === 11

  function changeFormation(id: FormationId) {
    const next = remapLineupToFormation(lineup, id)
    setFormationId(id)
    setLineup(next)
    onLineupChange(next)
    setMovingPlayer(null)
    setSelectedSlot(null)
  }

  function handleSlotClick(slotId: SlotId) {
    setError(null)
    const slot = getSlot(slotId, formationId)
    if (!slot) return
    const occupant = lineup[slotId]

    if (movingPlayer) {
      if (!canPlace(movingPlayer, slot)) {
        setError(t('lineup.err.cantPlace', { name: movingPlayer.name, pos: movingPlayer.position, role: slot.role }))
        return
      }
      const next = placePlayer(lineup, movingPlayer, slotId, formationId)
      if (!next) {
        setError(t('lineup.err.swap'))
        return
      }
      setLineup(next)
      onLineupChange(next)
      setMovingPlayer(null)
      setSelectedSlot(null)
      return
    }

    if (occupant) {
      setMovingPlayer(occupant)
      setSelectedSlot(slotId)
    } else {
      setSelectedSlot(prev => prev === slotId ? null : slotId)
    }
  }

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-2xl font-bold mb-1 text-iz-heading">
          {t('lineup.title')} <span className="text-accent">{t('lineup.team')}</span>
        </h2>
        <p className="text-iz-muted text-sm mb-4">
          {formation.label} · {t('stats.teamPower')}{' '}
          <span className="text-iz-cyan font-bold">{totalPower}</span>
          {movingPlayer && (
            <span className="text-accent ml-2">
              — {t('lineup.place', { name: movingPlayer.name, pos: movingPlayer.position })}
            </span>
          )}
        </p>

        {error && (
          <div className="mb-4 alert-error">{error}</div>
        )}

        <div className="grid md:grid-cols-[minmax(380px,480px)_280px] gap-6 mb-8 justify-center">
          <div className="flex flex-col items-center gap-3">
            <FormationSelector value={formationId} onChange={changeFormation} />
            <PitchFormation
              lineup={lineup}
              formationId={formationId}
              selectedSlot={selectedSlot}
              selectedPlayer={movingPlayer}
              onSlotClick={handleSlotClick}
              interactive
              strict
              size="lg"
            />
          </div>
          <BoxScore
            lineup={lineup}
            formationId={formationId}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            strict
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {all.map(p => (
            <PlayerCard key={p.id} player={p} mode={mode} compact />
          ))}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!isValid}
          className={`btn-primary w-full text-xl py-4 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isValid ? t('lineup.launch') : t('lineup.incomplete')}
        </button>
      </div>
    </div>
  )
}
