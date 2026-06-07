import type { Player, PlayerStats, Position } from '../types'
import { ALL_PLAYERS } from '../data/players'
import { lineupToArray, type FormationId, type LineupMap } from './lineup'

/** Stats affichées par poste */
export const POSITION_STAT_KEYS: Record<Position, (keyof PlayerStats)[]> = {
  GK: ['guard', 'guts', 'body'],
  DF: ['guard', 'body', 'speed'],
  MF: ['control', 'speed', 'stamina'],
  FW: ['kick', 'speed', 'control'],
}

const POSITION_WEIGHTS: Record<Position, number[]> = {
  GK: [0.55, 0.25, 0.2],
  DF: [0.55, 0.25, 0.2],
  MF: [0.5, 0.3, 0.2],
  FW: [0.55, 0.25, 0.2],
}

const STAT_KEYS: (keyof PlayerStats)[] = ['kick', 'body', 'control', 'guard', 'speed', 'stamina', 'guts']
const NOTE_MIN = 42
const NOTE_MAX = 99
const STAT_CURVE = 1.75
/** 1 = linéaire (étale tout l'échelle), >1 = écrase le milieu */
const RATING_CURVE = 1.15

type Bounds = { min: number; max: number }

function buildGlobalBounds(players: Player[]): Record<keyof PlayerStats, Bounds> {
  const bounds = {} as Record<keyof PlayerStats, Bounds>
  for (const key of STAT_KEYS) {
    let min = Infinity
    let max = -Infinity
    for (const p of players) {
      const v = p.stats[key]
      if (v < min) min = v
      if (v > max) max = v
    }
    bounds[key] = { min, max }
  }
  return bounds
}

function rawWeightedRating(p: Player): number {
  const keys = POSITION_STAT_KEYS[p.position]
  const weights = POSITION_WEIGHTS[p.position]
  return keys.reduce((sum, k, i) => sum + p.stats[k] * weights[i], 0)
}

function curveToNote(t: number, curve: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return NOTE_MIN + Math.pow(clamped, curve) * (NOTE_MAX - NOTE_MIN)
}

const GLOBAL_BOUNDS = buildGlobalBounds(ALL_PLAYERS)

const RAW_BOUNDS_BY_POSITION: Record<Position, Bounds> = {
  GK: { min: Infinity, max: -Infinity },
  DF: { min: Infinity, max: -Infinity },
  MF: { min: Infinity, max: -Infinity },
  FW: { min: Infinity, max: -Infinity },
}
for (const p of ALL_PLAYERS) {
  const raw = rawWeightedRating(p)
  const b = RAW_BOUNDS_BY_POSITION[p.position]
  if (raw < b.min) b.min = raw
  if (raw > b.max) b.max = raw
}

/** Stat brute zukan → échelle jeu 42–99 */
export function normalizeStatValue(value: number, key: keyof PlayerStats): number {
  const { min, max } = GLOBAL_BOUNDS[key]
  if (max <= min) return Math.round((NOTE_MIN + NOTE_MAX) / 2)
  const t = (value - min) / (max - min)
  return curveToNote(t, STAT_CURVE)
}

export function displayStatValue(p: Player, key: keyof PlayerStats): number {
  return Math.round(normalizeStatValue(p.stats[key], key))
}

/** Note pondérée par poste (42–99), courbe sur le score brut intra-poste */
export function playerRating(p: Player): number {
  const raw = rawWeightedRating(p)
  const { min, max } = RAW_BOUNDS_BY_POSITION[p.position]
  if (max <= min) return Math.round((NOTE_MIN + NOTE_MAX) / 2)
  const t = (raw - min) / (max - min)
  return Math.round(curveToNote(t, RATING_CURVE))
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
