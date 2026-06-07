import type { Player } from '../types'
import { rosterIdentityKey } from './players'

function rating(p: Player): number {
  const s = p.stats
  return s.kick + s.body + s.control + s.guard + s.speed + s.stamina + s.guts
}

/** Meilleur XI par poste depuis un roster complet */
export function pickBestXI(roster: Player[]): Player[] {
  const need = { GK: 1, DF: 4, MF: 3, FW: 3 }
  const picked: Player[] = []
  const used = new Set<string>()

  for (const pos of ['GK', 'DF', 'MF', 'FW'] as const) {
    const pool = roster
      .filter(p => p.position === pos && !used.has(rosterIdentityKey(p)))
      .sort((a, b) => rating(b) - rating(a))
    for (let i = 0; i < need[pos] && i < pool.length; i++) {
      picked.push(pool[i])
      used.add(rosterIdentityKey(pool[i]))
    }
  }
  return picked.slice(0, 11)
}
