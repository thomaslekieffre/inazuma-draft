/** Alias noms IE3 (versions JP / scrape → noms Fandom) */
export const NAME_OVERRIDES: Record<string, string> = {
  Nero: 'Nello',
  Azbel: 'Azubel',
}

/** Alias par équipe */
export const TEAM_NAME_OVERRIDES: Record<string, Record<string, string>> = {
  'Team K': { Nero: 'Nello', Azbel: 'Azubel' },
}

export function resolvePlayerName(name: string, team: string): string {
  return TEAM_NAME_OVERRIDES[team]?.[name] ?? NAME_OVERRIDES[name] ?? name
}
