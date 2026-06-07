import { useMemo } from 'react'
import { getFormationSlotsByLine, type FormationId, type LineupMap, isSlotValid } from '../lib/lineup'
import { lineupPower, playerRating } from '../lib/power'
import { useAppSettings } from '../context/AppSettings'
import PlayerAvatar from './PlayerAvatar'

interface Props {
  lineup: LineupMap
  formationId?: FormationId
  onSlotClick?: (slotId: import('../lib/lineup').SlotId) => void
  selectedSlot?: import('../lib/lineup').SlotId | null
  strict?: boolean
  showPower?: boolean
}

export default function BoxScore({ lineup, formationId = '433', onSlotClick, selectedSlot, strict, showPower }: Props) {
  const { t } = useAppSettings()
  const slots = getFormationSlotsByLine(formationId)
  const filled = slots.filter(s => lineup[s.id]).length
  const totalPower = useMemo(() => lineupPower(lineup, formationId), [lineup, formationId])

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-xs text-iz-cyan uppercase tracking-wider font-bold">{t('box.title')}</h3>
        <span className="text-xs text-iz-orange font-bold">{filled}/11</span>
      </div>
      {showPower && (
        <p className="text-xs text-iz-muted mb-2">
          {t('stats.teamPower')}{' '}
          <span className="text-iz-cyan font-bold tabular-nums">{totalPower}</span>
        </p>
      )}
      <div className="space-y-1">
        {slots.map(slot => {
          const player = lineup[slot.id]
          const isSelected = selectedSlot === slot.id
          const valid = !player || !strict || isSlotValid(lineup, slot.id, formationId)
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSlotClick?.(slot.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-sm transition-colors
                ${isSelected ? 'bg-iz-orange/15 border border-iz-orange/50' : 'hover:bg-iz-blue/10 border border-transparent'}
                ${!valid ? 'bg-red-950/40 border-red-500/30' : ''}
                ${onSlotClick ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="w-8 text-xs font-bold text-iz-muted">{slot.role}</span>
              {player ? (
                <>
                  <PlayerAvatar player={player} size="sm" />
                  <span className="truncate font-medium flex-1 text-iz-text">{player.name}</span>
                  <span className={`text-xs font-bold shrink-0 ${valid ? 'text-emerald-400' : 'text-red-400'}`}>
                    {showPower && (
                      <span className="text-iz-cyan mr-1 tabular-nums">{playerRating(player)}</span>
                    )}
                    {valid ? '✓' : '✗'} {player.position}
                  </span>
                </>
              ) : (
                <span className="text-iz-muted/60">{slot.role} —</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
