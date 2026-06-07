import type { Player } from '../types'

const STORAGE_KEY = 'ffi-draft-local-stats-v1'

export interface LocalStats {
  runsStarted: number
  draftsCompleted: number
  totalPicks: number
  totalRolls: number
  uniquePlayerIds: string[]
  uniqueTeams: string[]
  finalsReached: number
  championships: number
  eliminatedGroups: number
  eliminatedSemi: number
  finalLosses: number
}

export type TournamentOutcome =
  | { stage: 'groups' }
  | { stage: 'semi' }
  | { stage: 'final'; won: boolean }

const EMPTY: LocalStats = {
  runsStarted: 0,
  draftsCompleted: 0,
  totalPicks: 0,
  totalRolls: 0,
  uniquePlayerIds: [],
  uniqueTeams: [],
  finalsReached: 0,
  championships: 0,
  eliminatedGroups: 0,
  eliminatedSemi: 0,
  finalLosses: 0,
}

function mergeUnique(existing: string[], added: string[]): string[] {
  const set = new Set(existing)
  for (const x of added) set.add(x)
  return [...set]
}

function read(): LocalStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY, uniquePlayerIds: [], uniqueTeams: [] }
    const parsed = JSON.parse(raw) as Partial<LocalStats>
    return {
      ...EMPTY,
      ...parsed,
      uniquePlayerIds: parsed.uniquePlayerIds ?? [],
      uniqueTeams: parsed.uniqueTeams ?? [],
    }
  } catch {
    return { ...EMPTY, uniquePlayerIds: [], uniqueTeams: [] }
  }
}

function write(stats: LocalStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function loadLocalStats(): LocalStats {
  return read()
}

export function recordRunStarted() {
  const s = read()
  s.runsStarted++
  write(s)
}

export function recordDraftComplete(players: Player[], teamsRolled: string[]) {
  const s = read()
  s.draftsCompleted++
  s.totalPicks += players.length
  s.totalRolls += teamsRolled.length
  s.uniquePlayerIds = mergeUnique(
    s.uniquePlayerIds,
    players.map(p => p.id),
  )
  s.uniqueTeams = mergeUnique(s.uniqueTeams, teamsRolled)
  write(s)
}

export function recordTournamentOutcome(outcome: TournamentOutcome) {
  const s = read()
  if (outcome.stage === 'groups') s.eliminatedGroups++
  else if (outcome.stage === 'semi') s.eliminatedSemi++
  else {
    s.finalsReached++
    if (outcome.won) s.championships++
    else s.finalLosses++
  }
  write(s)
}

export function resetLocalStats() {
  localStorage.removeItem(STORAGE_KEY)
}
