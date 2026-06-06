import type { Player } from '../types'
import { lineupToArray, type FormationId, type LineupMap } from './lineup'

export function playerPower(p: Player): number {
  const { kick, body, control, guard, speed, guts } = p.stats
  switch (p.position) {
    case 'GK': return guard * 2 + guts + body * 0.5
    case 'DF': return guard * 1.5 + body + speed * 0.5
    case 'MF': return control * 1.5 + speed + kick * 0.5
    case 'FW': return kick * 2 + speed + control * 0.5
  }
}

export function teamPower(players: Player[]): number {
  return players.reduce((sum, p) => sum + playerPower(p), 0)
}

export function lineupPower(lineup: LineupMap, formationId: FormationId = '433'): number {
  return Math.round(teamPower(lineupToArray(lineup, formationId)))
}
