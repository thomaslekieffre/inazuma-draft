import type { Player, MatchResult, MatchEvent, GroupStanding } from '../types'
import { teamPower } from '../lib/power'

const ELEMENT_ADVANTAGE: Record<string, string> = {
  fire: 'wood', wood: 'air', air: 'earth', earth: 'fire',
}

function elementBonus(attackers: Player[], defenders: Player[]): number {
  let bonus = 0
  for (const a of attackers) {
    for (const d of defenders) {
      if (ELEMENT_ADVANTAGE[a.element] === d.element) bonus += 0.015
      else if (ELEMENT_ADVANTAGE[d.element] === a.element) bonus -= 0.015
    }
  }
  return Math.max(-0.12, Math.min(0.12, bonus))
}

function generateGoalEvents(scoringTeam: 0 | 1, players: Player[], count: number, matchMinutes: number[]): MatchEvent[] {
  const scorers = players.filter(p => p.position === 'FW' || p.position === 'MF')
  if (scorers.length === 0) return []
  return matchMinutes.slice(0, count).map(minute => {
    const player = scorers[Math.floor(Math.random() * scorers.length)]
    const move = player.hissatsu[Math.floor(Math.random() * player.hissatsu.length)]
    return { minute, type: 'goal' as const, team: scoringTeam, player: player.name, move }
  })
}

function clampGoals(goals: number, ratio: number, isFavourite: boolean): number {
  const gap = Math.abs(ratio - 0.5)
  const max = gap > 0.25 ? (isFavourite ? 6 : 4) : 5
  return Math.min(max, Math.max(0, goals))
}

export function simulateMatch(team1: Player[], team2: Player[], team1Name: string, team2Name: string): MatchResult {
  const power1 = teamPower(team1) * (1 + elementBonus(team1, team2))
  const power2 = teamPower(team2) * (1 + elementBonus(team2, team1))
  const total = power1 + power2
  const ratio = power1 / total

  const base = 2.2
  let eg1 = base * ratio * 1.5
  let eg2 = base * (1 - ratio) * 1.5

  const noise = () => (Math.random() - 0.5) * 1.2
  let goals1 = Math.round(eg1 + noise())
  let goals2 = Math.round(eg2 + noise())

  goals1 = clampGoals(goals1, ratio, true)
  goals2 = clampGoals(goals2, ratio, false)

  if (goals1 === 0 && goals2 === 0) {
    if (ratio >= 0.52) goals1 = 1
    else if (ratio <= 0.48) goals2 = 1
    else if (Math.random() < 0.5) goals1 = 1
    else goals2 = 1
  }

  const allMinutes = Array.from({ length: goals1 + goals2 }, () => Math.floor(Math.random() * 88) + 2).sort((a, b) => a - b)
  const mins1 = allMinutes.filter((_, i) => i < goals1)
  const mins2 = allMinutes.filter((_, i) => i >= goals1)

  const events = [
    ...generateGoalEvents(0, team1, goals1, mins1),
    ...generateGoalEvents(1, team2, goals2, mins2),
  ].sort((a, b) => a.minute - b.minute)

  return { team1Name, team2Name, score: [goals1, goals2], events }
}

export function simulateGroupStage(
  teams: { name: string; players: Player[] }[]
): { standings: GroupStanding[]; matches: MatchResult[] } {
  const standings: GroupStanding[] = teams.map(t => ({
    teamName: t.name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
  }))
  const matches: MatchResult[] = []

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const result = simulateMatch(teams[i].players, teams[j].players, teams[i].name, teams[j].name)
      matches.push(result)
      const si = standings.find(s => s.teamName === teams[i].name)!
      const sj = standings.find(s => s.teamName === teams[j].name)!
      si.played++; sj.played++
      si.gf += result.score[0]; si.ga += result.score[1]
      sj.gf += result.score[1]; sj.ga += result.score[0]
      if (result.score[0] > result.score[1]) { si.won++; si.points += 3; sj.lost++ }
      else if (result.score[0] < result.score[1]) { sj.won++; sj.points += 3; si.lost++ }
      else { si.drawn++; sj.drawn++; si.points++; sj.points++ }
    }
  }

  standings.sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf)
  return { standings, matches }
}

export function initStandings(teamNames: string[]): GroupStanding[] {
  return teamNames.map(teamName => ({
    teamName, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
  }))
}

export function applyMatchToStandings(standings: GroupStanding[], result: MatchResult): GroupStanding[] {
  const next = standings.map(s => ({ ...s }))
  const si = next.find(s => s.teamName === result.team1Name)!
  const sj = next.find(s => s.teamName === result.team2Name)!
  si.played++; sj.played++
  si.gf += result.score[0]; si.ga += result.score[1]
  sj.gf += result.score[1]; sj.ga += result.score[0]
  if (result.score[0] > result.score[1]) { si.won++; si.points += 3; sj.lost++ }
  else if (result.score[0] < result.score[1]) { sj.won++; sj.points += 3; si.lost++ }
  else { si.drawn++; sj.drawn++; si.points++; sj.points++ }
  return sortStandings(next)
}

export function sortStandings(standings: GroupStanding[]): GroupStanding[] {
  return [...standings].sort(
    (a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
  )
}

/** Simule les matchs restants d'une poule (hors paires déjà jouées). */
export function simulateRemainingGroupMatches(
  teams: { name: string; players: Player[] }[],
  played: MatchResult[],
): { standings: GroupStanding[]; matches: MatchResult[] } {
  const playedKey = (a: string, b: string) => [a, b].sort().join('|')
  const done = new Set(played.map(m => playedKey(m.team1Name, m.team2Name)))

  let standings = initStandings(teams.map(t => t.name))
  const matches: MatchResult[] = [...played]
  for (const m of played) standings = applyMatchToStandings(standings, m)

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const key = playedKey(teams[i].name, teams[j].name)
      if (done.has(key)) continue
      const result = simulateMatch(teams[i].players, teams[j].players, teams[i].name, teams[j].name)
      matches.push(result)
      standings = applyMatchToStandings(standings, result)
      done.add(key)
    }
  }

  return { standings: sortStandings(standings), matches }
}
