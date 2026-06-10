import { createRngFromSeed } from './rng'

let rng: () => number = Math.random
let runSeed: string | null = null

export function initRunRng(seed: string) {
  runSeed = seed
  rng = createRngFromSeed(seed)
}

export function resetRunRng() {
  runSeed = null
  rng = Math.random
}

export function getRunSeed(): string | null {
  return runSeed
}

export function random(): number {
  return rng()
}
