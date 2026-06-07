import type { Player } from '../types'
import { ALL_PLAYERS } from './players'
import { FFI_STARTING_XI } from './canonical-rosters'
import type { FFITeamId } from './team-names'

export { FFI_STARTING_XI }

export function pickFFIStarters(roster: Player[], teamId: FFITeamId): Player[] {
  const names = FFI_STARTING_XI[teamId]
  const byName = new Map(roster.map(p => [p.name, p]))
  const picked = names.map(name => byName.get(name)).filter((p): p is Player => !!p)

  if (picked.length === 11) return picked

  const used = new Set(picked.map(p => p.id))
  const remaining = roster.filter(p => !used.has(p.id))
  const need = { GK: 1, DF: 4, MF: 3, FW: 3 }
  for (const p of picked) need[p.position]--

  const fill = (pos: Player['position'], n: number) => {
    const pool = remaining.filter(p => p.position === pos && !used.has(p.id))
    pool.sort((a, b) => b.stats.guard + b.stats.kick + b.stats.control - (a.stats.guard + a.stats.kick + a.stats.control))
    for (let i = 0; i < n && i < pool.length; i++) {
      picked.push(pool[i])
      used.add(pool[i].id)
    }
  }
  fill('GK', need.GK)
  fill('DF', need.DF)
  fill('MF', need.MF)
  fill('FW', need.FW)

  return picked.slice(0, 11)
}
