/**
 * Compteurs globaux (tous visiteurs) via CountAPI — pas de DB à gérer.
 * = nombre de sessions / events, pas des utilisateurs uniques.
 * Pour les uniques : PostHog ou Vercel Analytics (dashboard).
 */
const NS = 'ffi-6-0'

const SESSION_FLAGS = {
  visit: 'ffi-global-visit',
  run: 'ffi-global-run',
} as const

async function hit(key: string) {
  try {
    await fetch(`https://api.countapi.xyz/hit/${NS}/${key}`)
  } catch {
    /* réseau / CORS */
  }
}

async function get(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.countapi.xyz/get/${NS}/${key}`)
    if (!res.ok) return null
    const json = (await res.json()) as { value?: number }
    return typeof json.value === 'number' ? json.value : null
  } catch {
    return null
  }
}

function oncePerSession(flag: keyof typeof SESSION_FLAGS) {
  try {
    if (sessionStorage.getItem(SESSION_FLAGS[flag])) return false
    sessionStorage.setItem(SESSION_FLAGS[flag], '1')
    return true
  } catch {
    return true
  }
}

export function recordGlobalVisit() {
  if (!oncePerSession('visit')) return
  void hit('visits')
}

export function recordGlobalRunStarted() {
  if (!oncePerSession('run')) return
  void hit('runs')
}

export function recordGlobalDraftComplete() {
  void hit('drafts')
}

export function recordGlobalFinalReached() {
  void hit('finals')
}

export type GlobalMetrics = {
  visits: number | null
  runs: number | null
  drafts: number | null
  finals: number | null
}

export async function fetchGlobalMetrics(): Promise<GlobalMetrics> {
  const [visits, runs, drafts, finals] = await Promise.all([
    get('visits'),
    get('runs'),
    get('drafts'),
    get('finals'),
  ])
  return { visits, runs, drafts, finals }
}
