type SfxKind = 'roll' | 'pick' | 'goal' | 'qualify'

let ctx: AudioContext | null = null
let enabled = true

function getCtx(): AudioContext | null {
  if (!enabled) return null
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

export function setSfxEnabled(on: boolean) {
  enabled = on
  if (!on && ctx) {
    void ctx.close()
    ctx = null
  }
}

export function isSfxEnabled() {
  return enabled
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, gain = 0.08) {
  const ac = getCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime + start)
  g.gain.setValueAtTime(0, ac.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur)
  osc.connect(g)
  g.connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + dur + 0.02)
}

export function playSfx(kind: SfxKind) {
  if (!enabled) return
  switch (kind) {
    case 'roll':
      tone(220, 0, 0.08, 'square', 0.05)
      tone(330, 0.06, 0.1, 'square', 0.04)
      tone(440, 0.14, 0.12, 'triangle', 0.06)
      break
    case 'pick':
      tone(523, 0, 0.1, 'triangle', 0.07)
      tone(784, 0.08, 0.14, 'triangle', 0.05)
      break
    case 'goal':
      tone(392, 0, 0.12, 'square', 0.06)
      tone(523, 0.1, 0.12, 'square', 0.06)
      tone(659, 0.2, 0.2, 'triangle', 0.07)
      break
    case 'qualify':
      tone(440, 0, 0.15, 'triangle', 0.06)
      tone(554, 0.12, 0.15, 'triangle', 0.06)
      tone(659, 0.24, 0.15, 'triangle', 0.06)
      tone(880, 0.36, 0.25, 'triangle', 0.07)
      break
  }
}
