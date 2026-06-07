import type { Player } from '../types'
import { POSITION_STAT_KEYS, displayStatValue, playerRating } from '../lib/power'
import { useAppSettings } from '../context/AppSettings'
import PlayerAvatar from './PlayerAvatar'

const POS_CLASS: Record<string, string> = {
  GK: 'pos-gk',
  DF: 'pos-df',
  MF: 'pos-mf',
  FW: 'pos-fw',
}

const ELEMENT_LABELS: Record<string, string> = {
  fire: '🔥', wood: '🌿', air: '💨', earth: '🪨',
}

interface Props {
  player: Player
  mode: 'classic' | 'memory'
  onClick?: () => void
  selected?: boolean
  compact?: boolean
  disabled?: boolean
  teamLabel?: string
}

export default function PlayerCard({ player, mode, onClick, selected, compact, disabled, teamLabel }: Props) {
  const { t } = useAppSettings()
  const border = selected
    ? 'border-iz-orange ring-2 ring-iz-orange/50 shadow-iz-orange'
    : disabled
      ? 'border-iz-blue/10 opacity-40'
      : `border-iz-blue/25 element-bg-${player.element}`

  if (compact) {
    return (
      <div
        className={`player-chip player-chip--${player.element} flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm
          ${selected ? 'player-chip--selected' : ''} ${disabled ? 'opacity-40' : ''}`}
      >
        <PlayerAvatar player={player} size="sm" />
        <span className={`px-1.5 py-0.5 rounded text-xs font-bold shrink-0 ${POS_CLASS[player.position]}`}>
          {player.position}
        </span>
        <span className="font-medium truncate text-iz-heading">{player.name}</span>
        <span className={`element-${player.element} text-xs ml-auto shrink-0`}>{ELEMENT_LABELS[player.element]}</span>
      </div>
    )
  }

  const rating = playerRating(player)
  const statKeys = POSITION_STAT_KEYS[player.position]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick || disabled}
      className={`card p-3 text-left w-full border transition-all ${border}
        ${onClick && !disabled ? 'hover:border-iz-orange hover:shadow-iz-orange hover:scale-[1.02] cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <PlayerAvatar player={player} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="font-heading font-bold text-sm truncate text-iz-heading">{player.name}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${POS_CLASS[player.position]}`}>{player.position}</span>
          </div>
          <div className={`text-xs element-${player.element}`}>{teamLabel ?? player.team}</div>
        </div>
      </div>
      {mode === 'classic' && (
        <>
          <div className="flex items-baseline justify-between mb-2 px-1">
            <span className="text-xs text-iz-muted font-heading">{t('stats.rating')}</span>
            <span className="text-xl font-heading font-black text-iz-cyan tabular-nums">{rating}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-iz-muted mb-2">
            {statKeys.map(key => (
              <span key={key}>
                {t(`stats.${key}`)} <span className="text-iz-text font-medium tabular-nums">{displayStatValue(player, key)}</span>
              </span>
            ))}
          </div>
          {player.hissatsu[0] && (
            <div className="text-xs text-hissatsu truncate font-heading">⚡ {player.hissatsu[0]}</div>
          )}
        </>
      )}
    </button>
  )
}
