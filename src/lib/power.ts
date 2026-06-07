import type { Player, PlayerStats, Position } from '../types'
import { lineupToArray, type FormationId, type LineupMap } from './lineup'

/** Stats affichées par poste */
export const POSITION_STAT_KEYS: Record<Position, (keyof PlayerStats)[]> = {
  GK: ['guard', 'guts', 'body'],
  DF: ['guard', 'body', 'speed'],
  MF: ['control', 'speed', 'stamina'],
  FW: ['kick', 'speed', 'control'],
}

/** Poids pour la note — la stat principale du poste compte le plus */
const POSITION_WEIGHTS: Record<Position, number[]> = {
  GK: [0.55, 0.25, 0.2],
  DF: [0.55, 0.25, 0.2],
  MF: [0.5, 0.3, 0.2],
  FW: [0.55, 0.25, 0.2],
}

/** Note pondérée selon le poste (0–100) */
export function playerRating(p: Player): number {
  const keys = POSITION_STAT_KEYS[p.position]
  const weights = POSITION_WEIGHTS[p.position]
  const score = keys.reduce((sum, k, i) => sum + p.stats[k] * weights[i], 0)
  return Math.round(score)
}

export function playerPower(p: Player): number {
  return playerRating(p)
}

export function teamPower(players: Player[]): number {
  return players.reduce((sum, p) => sum + playerRating(p), 0)
}

export function lineupPower(lineup: LineupMap, formationId: FormationId = '433'): number {
  return teamPower(lineupToArray(lineup, formationId))
}
