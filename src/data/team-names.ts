/** Clés internes FFI (pour ffi-rosters / ffi-teams) */
export const FFI_TEAM_IDS = [
  'Orpheus',
  'Unicorn',
  'Knights of Queen',
  'The Empire',
  'The Kingdom',
  'Red Matador',
  'Rose Griffon',
  'Brockenborg',
  'Little Gigant',
] as const

export type FFITeamId = (typeof FFI_TEAM_IDS)[number]

/** Affichage = clé interne (noms anglais du jeu) */
export function displayTeamName(teamId: string): string {
  return teamId
}
