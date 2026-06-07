import type { FFITeam } from '../types'
import { ALL_PLAYERS } from './players'
import { pickFFIStarters } from './ffi-rosters'
import { FFI_TEAM_IDS, type FFITeamId } from './team-names'

function makeFFITeam(name: FFITeamId, country: string, flag: string, block: 'A' | 'B'): FFITeam {
  const roster = ALL_PLAYERS.filter(p => p.team === name)
  return { name, country, flag, block, players: pickFFIStarters(roster, name) }
}

export const FFI_BLOCK_A: FFITeam[] = [
  makeFFITeam('Orpheus', 'Italie', '🇮🇹', 'A'),
  makeFFITeam('Unicorn', 'USA', '🇺🇸', 'A'),
  makeFFITeam('Knights of Queen', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'A'),
  makeFFITeam('The Empire', 'Argentine', '🇦🇷', 'A'),
]

export const FFI_BLOCK_B: FFITeam[] = [
  makeFFITeam('The Kingdom', 'Brésil', '🇧🇷', 'B'),
  makeFFITeam('Red Matador', 'Espagne', '🇪🇸', 'B'),
  makeFFITeam('Rose Griffon', 'France', '🇫🇷', 'B'),
  makeFFITeam('Brockenborg', 'Allemagne', '🇩🇪', 'B'),
  makeFFITeam('Little Gigant', 'Cotarl', '🌍', 'B'),
]

export const FFI_TEAMS = [...FFI_BLOCK_A, ...FFI_BLOCK_B]

export function isFFITeam(name: string): name is FFITeamId {
  return (FFI_TEAM_IDS as readonly string[]).includes(name)
}
