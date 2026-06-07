/** Panneau dev global : ajoute ?dev=1 à l’URL (persisté en session). */
const SESSION_KEY = 'ffi-dev-mode'

export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).has('dev')) {
      sessionStorage.setItem(SESSION_KEY, '1')
      return true
    }
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}
