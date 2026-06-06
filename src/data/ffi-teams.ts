import type { FFITeam } from '../types'
import { ALL_PLAYERS } from './players'

function makeFFITeam(name: string, country: string, flag: string, block: 'A' | 'B'): FFITeam {
  const roster = ALL_PLAYERS.filter(p => p.team === name)
  const gk = roster.filter(p => p.position === 'GK').slice(0, 1)
  const df = roster.filter(p => p.position === 'DF').slice(0, 4)
  const mf = roster.filter(p => p.position === 'MF').slice(0, 3)
  const fw = roster.filter(p => p.position === 'FW').slice(0, 3)
  return { name, country, flag, block, players: [...gk, ...df, ...mf, ...fw] }
}

export const FFI_BLOCK_A: FFITeam[] = [
  makeFFITeam("Orpheus", "Italie", "🇮🇹", "A"),
  makeFFITeam("Unicorn", "USA", "🇺🇸", "A"),
  makeFFITeam("Knights of Queen", "Angleterre", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "A"),
  makeFFITeam("The Empire", "Argentine", "🇦🇷", "A"),
]

export const FFI_BLOCK_B: FFITeam[] = [
  makeFFITeam("The Kingdom", "Brésil", "🇧🇷", "B"),
  makeFFITeam("Red Matador", "Espagne", "🇪🇸", "B"),
  makeFFITeam("Rose Griffon", "France", "🇫🇷", "B"),
  makeFFITeam("Brockenborg", "Allemagne", "🇩🇪", "B"),
  makeFFITeam("Little Gigant", "Cotarl", "🌍", "B"),
]

export const FFI_TEAMS = [...FFI_BLOCK_A, ...FFI_BLOCK_B]
