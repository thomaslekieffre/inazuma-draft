export type Element = 'fire' | 'wood' | 'air' | 'earth'
export type Position = 'GK' | 'DF' | 'MF' | 'FW'

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
  team: string
  element: Element
  position: Position
  stats: PlayerStats
  hissatsu: string[]
}

export interface MatchEvent {
  minute: number
  type: 'goal' | 'save' | 'hissatsu'
  team: 0 | 1
  player: string
  move?: string
}

export interface MatchResult {
  team1Name: string
  team2Name: string
  score: [number, number]
  events: MatchEvent[]
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
