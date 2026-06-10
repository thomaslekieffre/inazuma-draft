/** Mulberry32 — PRNG déterministe pour seeds partagées. */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function createRngFromSeed(seed: string): () => number {
  return mulberry32(hashSeed(seed.trim().toLowerCase()))
}

export function generateSeedString(): string {
  const bytes = new Uint32Array(2)
  crypto.getRandomValues(bytes)
  return `${bytes[0].toString(36)}${bytes[1].toString(36)}`.slice(0, 10)
}

export function readSeedFromLocation(search = window.location.search): string | null {
  const seed = new URLSearchParams(search).get('seed')?.trim()
  return seed && seed.length >= 4 ? seed : null
}

export function readModeFromLocation(search = window.location.search): 'classic' | 'memory' | null {
  const m = new URLSearchParams(search).get('mode')
  return m === 'classic' || m === 'memory' ? m : null
}

export function buildShareUrl(seed: string, mode: 'classic' | 'memory'): string {
  const url = new URL(window.location.href)
  url.searchParams.set('seed', seed)
  url.searchParams.set('mode', mode)
  url.hash = ''
  return url.toString()
}

export function syncRunUrl(seed: string, mode: 'classic' | 'memory') {
  const next = buildShareUrl(seed, mode)
  window.history.replaceState(null, '', next)
}
