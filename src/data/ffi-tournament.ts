/**
 * Structure FFI Saison 1 — source:
 * https://inazuma-eleven.fandom.com/fr/wiki/Football_Frontier_International
 *
 * Clés internes = noms anglais IE3 (affichage draft / sim).
 */
export const FFI_FANDOM_FR =
  'https://inazuma-eleven.fandom.com/fr/wiki/Football_Frontier_International'

/** 10 équipes — phases finales (île Liocott) */
export const FFI_FINALS_POOL_A = [
  'Knights of Queen',
  'Inazuma Japan',
  'The Empire',
  'Unicorn',
  'Orpheus',
] as const

export const FFI_FINALS_POOL_B = [
  'Brockenborg',
  'Little Gigant',
  'The Kingdom',
  'Red Matador',
  'Rose Griffon',
] as const

/** Équipes adversaires jouées par l'utilisateur en poule A (hors IJ) */
export const FFI_PLAYER_GROUP_OPPONENTS = [
  'Orpheus',
  'Unicorn',
  'Knights of Queen',
  'The Empire',
] as const

/**
 * Bracket éliminatoire canon (anime / Fandom FR):
 * - 1er poule A vs 2e poule B
 * - 2e poule A vs 1er poule B  ← le joueur (souvent 2e A) affronte le 1er B
 * - Finale entre les deux vainqueurs
 */
export function ffiKnockoutPairings(
  poolA: readonly string[],
  poolB: readonly string[],
  playerTeam = 'Inazuma Japan',
) {
  const a1 = poolA[0]
  const a2 = poolA[1]
  const b1 = poolB[0]
  const b2 = poolB[1]
  const playerIsFirstInA = a1 === playerTeam

  return {
    playerSemiOpponent: playerIsFirstInA ? b2 : b1,
    otherSemi: { home: playerIsFirstInA ? a2 : a1, away: playerIsFirstInA ? b1 : b2 },
    playerIsFirstInA,
  }
}
