import { useState } from 'react'
import type { Player } from '../types'
import { getPlayerImage } from '../data/player-images'

const ELEMENT_BG: Record<string, string> = {
  fire: 'from-orange-500 to-red-800',
  wood: 'from-emerald-500 to-emerald-900',
  air: 'from-cyan-400 to-blue-700',
  earth: 'from-amber-500 to-amber-900',
}

interface Props {
  player: Player
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-20 h-20' }

export default function PlayerAvatar({ player, size = 'md', className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  const src = getPlayerImage(player.name)

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={player.name}
        onError={() => setFailed(true)}
        className={`${SIZES[size]} rounded-full object-cover object-top border-2 border-iz-cyan/40 bg-iz-card ${className}`}
      />
    )
  }

  return (
    <div className={`${SIZES[size]} rounded-full bg-gradient-to-b ${ELEMENT_BG[player.element]} flex items-center justify-center border-2 border-iz-cyan/30 font-heading font-bold text-white text-xs ${className}`}>
      {player.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
    </div>
  )
}
