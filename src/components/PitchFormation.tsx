import type { Player } from '../types'
import {
  getFormation,
  type FormationId,
  type LineupMap,
  type SlotId,
  canPlace,
  isSlotValid,
} from '../lib/lineup'
import PlayerAvatar from './PlayerAvatar'

interface Props {
  lineup: LineupMap
  formationId?: FormationId
  selectedSlot?: SlotId | null
  selectedPlayer?: Player | null
  onSlotClick?: (slotId: SlotId) => void
  interactive?: boolean
  strict?: boolean
  size?: 'md' | 'lg'
}

export default function PitchFormation({
  lineup,
  formationId = '433',
  selectedSlot,
  selectedPlayer,
  onSlotClick,
  interactive = false,
  strict = false,
  size = 'lg',
}: Props) {
  const formation = getFormation(formationId)
  const maxW = size === 'lg' ? 'max-w-[480px]' : 'max-w-[360px]'
  const avatarSize = size === 'lg' ? 'lg' : 'md'
  const emptySize = size === 'lg' ? 'w-[4.5rem] h-[4.5rem]' : 'w-14 h-14'

  return (
    <div className={`relative w-full aspect-[3/4] ${maxW} mx-auto pitch-frame`}>
      <div className="absolute inset-0 bg-iz-pitch" />
      <div className="absolute inset-[8%] border-2 border-white/40 rounded-sm" />
      <div className="absolute top-1/2 left-[8%] right-[8%] h-0.5 bg-white/35" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18%] aspect-square rounded-full border-2 border-white/35" />
      <div className="absolute bottom-[8%] left-[28%] right-[28%] h-[18%] border-2 border-white/35 border-b-0" />
      <div className="absolute top-[8%] left-[28%] right-[28%] h-[18%] border-2 border-white/35 border-t-0" />

      {[...new Set(formation.slots.map(s => Math.round(s.y / 5) * 5))].sort((a, b) => a - b).map(y => (
        <div
          key={y}
          className="absolute left-[6%] right-[6%] border-t border-white/15 pointer-events-none"
          style={{ top: `${y}%` }}
        />
      ))}

      {formation.slots.map(slot => {
        const player = lineup[slot.id]
        const isSelected = selectedSlot === slot.id
        const canReceive = selectedPlayer && canPlace(selectedPlayer, slot)
        const empty = !player
        const invalid = strict && player && !isSlotValid(lineup, slot.id, formationId)

        return (
          <button
            key={slot.id}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onSlotClick?.(slot.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 transition-all
              ${interactive ? 'cursor-pointer' : 'cursor-default'}
              ${isSelected ? 'scale-110 z-10' : ''}
              ${canReceive && empty ? 'animate-pulse-gold' : ''}`}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            {player ? (
              <>
                <PlayerAvatar
                  player={player}
                  size={avatarSize}
                  className={`${isSelected ? 'ring-2 ring-iz-orange' : ''} ${invalid ? 'ring-2 ring-red-500' : 'ring-2 ring-iz-cyan/40'}`}
                />
                <span className={`text-[10px] font-bold px-1.5 rounded truncate max-w-[88px] font-heading
                  ${invalid ? 'text-red-200 bg-red-900/70' : 'pitch-slot-dark'}`}>
                  {player.name.split(' ').pop()}
                </span>
                <span className="text-[9px] text-iz-cyan/90 font-bold">{slot.role}</span>
              </>
            ) : (
              <div className={`${emptySize} rounded-full border-2 border-dashed flex flex-col items-center justify-center
                ${canReceive ? 'border-iz-orange bg-iz-orange/15' : isSelected ? 'border-iz-orange bg-iz-orange/25' : 'pitch-slot-empty'}`}>
                <span className="text-xs font-bold font-heading">{slot.role}</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
