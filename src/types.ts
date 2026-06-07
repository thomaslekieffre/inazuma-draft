export type Element = 'fire' | 'wood' | 'air' | 'earth'
export type Position = 'GK' | 'DF' | 'MF' | 'FW'

export type GameId = 'IE1' | 'IE2' | 'IE3' | 'GO1' | 'GO2' | 'GO3'

export interface DraftPool {
  game: GameId
  teamId: string
  label: string
}

export type DraftPoolKey = `${GameId}:${string}`

export interface PlayerStats {
  kick: number
  body: number
  control: number
  guard: number
  speed: number
  stamina: number
  guts: number
}

export interface Player {
  id: string
  name: string
  game: GameId
  team: string
  element: Element
  position: Position
  stats: PlayerStats
  hissatsu: string[]
}

export interface MatchEvent {
  minute: number
  type: 'goal' | 'save' | 'hissatsu' | 'penalty'
  team: 0 | 1
  player: string
  move?: string
}

export interface MatchResult {
  team1Name: string
  team2Name: string
  score: [number, number]
  events: MatchEvent[]
  /** Tirs au but si match nul en temps réglementaire (match à élimination) */
  penalties?: [number, number]
  decidedByPenalties?: boolean
}

export interface GroupStanding {
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  points: number
}

export interface FFITeam {
  name: string
  country: string
  flag: string
  block: 'A' | 'B'
  players: Player[]
}

export type GamePhase = 'landing' | 'draft' | 'lineup' | 'tournament' | 'result'
