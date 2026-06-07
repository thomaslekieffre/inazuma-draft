import type { Player } from '../types'
import {
  DEFAULT_FORMATION,
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

const AVATAR_CLS =
  'w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-14 lg:h-14 border-0 sm:border'
const EMPTY_CLS =
  'w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-14 lg:h-14'

export default function PitchFormation({
  lineup,
  formationId = DEFAULT_FORMATION,
  selectedSlot,
  selectedPlayer,
  onSlotClick,
  interactive = false,
  strict = false,
  size = 'lg',
}: Props) {
  const formation = getFormation(formationId)
  const maxW =
    size === 'lg'
      ? 'max-w-[min(64vw,220px)] sm:max-w-[280px] md:max-w-[360px] lg:max-w-[400px]'
      : 'max-w-[min(60vw,200px)] sm:max-w-[260px] md:max-w-[320px]'

  return (
    <div className={`relative w-full aspect-[3/4] ${maxW} mx-auto pitch-frame pitch-frame--compact`}>
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
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0 transition-all pitch-slot max-w-[20%]
              ${interactive ? 'cursor-pointer' : 'cursor-default'}
              ${isSelected ? 'scale-105 z-10' : ''}
              ${canReceive && empty ? 'animate-pulse-gold' : ''}`}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            {player ? (
              <>
                <PlayerAvatar
                  player={player}
                  size="xs"
                  className={`${AVATAR_CLS}
                    ${isSelected ? 'ring-1 sm:ring-2 ring-iz-orange' : ''}
                    ${invalid ? 'ring-1 sm:ring-2 ring-red-500' : 'ring-1 sm:ring-2 ring-iz-cyan/50'}`}
                />
                <span
                  className={`pitch-slot__name mt-px text-[6px] sm:text-[7px] md:text-[9px] font-bold px-0.5 sm:px-1 py-px rounded truncate w-full text-center font-heading leading-none
                  ${invalid ? 'text-red-200 bg-red-900/70' : 'pitch-slot-dark'}`}
                >
                  {player.name.split(' ').pop()}
                </span>
                <span className="pitch-slot__role text-[5px] sm:text-[7px] text-iz-cyan/80 font-bold hidden md:inline leading-none mt-px">
                  {slot.role}
                </span>
              </>
            ) : (
              <div
                className={`${EMPTY_CLS} rounded-full border border-dashed sm:border-2 flex items-center justify-center
                ${canReceive ? 'border-iz-orange bg-iz-orange/15' : isSelected ? 'border-iz-orange bg-iz-orange/25' : 'pitch-slot-empty'}`}
              >
                <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold font-heading">{slot.role}</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
