import type { Player, Position } from '../types'
import type { TranslationKey } from '../i18n/translations'

export type SlotId =
  | 'GK'
  | 'LB' | 'CB1' | 'CB2' | 'CB3' | 'RB'
  | 'CM1' | 'CM2' | 'CM3' | 'CM4' | 'CM5'
  | 'LW' | 'ST' | 'RW'

/** Formations match Inazuma Eleven 3 (FFI) — noms officiels F-*. */
export type FormationId =
  | 'basic'
  | 'three_top'
  | 'butterfly'
  | 'phoenix'
  | 'neo'
  | 'death_zone'
  | 'wild_park'
  | 'ghost_dance'
  | 'mugen'
  | 'phalanx'

export interface FormationSlot {
  id: SlotId
  label: string
  role: Position
  x: number
  y: number
}

export interface FormationDef {
  id: FormationId
  nameKey: TranslationKey
  layout: string
  slots: FormationSlot[]
}

function s(id: SlotId, x: number, y: number, role: Position): FormationSlot {
  return { id, label: role, role, x, y }
}

const DF4 = [
  s('LB', 10, 62, 'DF'), s('CB1', 33, 67, 'DF'), s('CB2', 67, 67, 'DF'), s('RB', 90, 62, 'DF'),
] as const

const DF5 = [
  s('LB', 8, 70, 'DF'), s('CB1', 25, 74, 'DF'), s('CB2', 50, 76, 'DF'), s('CB3', 75, 74, 'DF'), s('RB', 92, 70, 'DF'),
] as const

/** y petit = attaque. Chaque formation a le bon nombre de DF/MF/FW. */
export const FORMATIONS: FormationDef[] = [
  {
    id: 'basic',
    nameKey: 'formation.basic',
    layout: '4-4-2',
    slots: [
      s('LW', 36, 8, 'FW'), s('RW', 64, 8, 'FW'),
      s('CM1', 18, 40, 'MF'), s('CM2', 38, 40, 'MF'), s('CM3', 62, 40, 'MF'), s('CM4', 82, 40, 'MF'),
      ...DF4,
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'three_top',
    nameKey: 'formation.three_top',
    layout: '4-3-3',
    slots: [
      s('LW', 14, 7, 'FW'), s('ST', 50, 5, 'FW'), s('RW', 86, 7, 'FW'),
      s('CM1', 28, 32, 'MF'), s('CM2', 50, 27, 'MF'), s('CM3', 72, 32, 'MF'),
      ...DF4,
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'butterfly',
    nameKey: 'formation.butterfly',
    layout: '4-3-3',
    slots: [
      s('LW', 10, 6, 'FW'), s('ST', 50, 8, 'FW'), s('RW', 90, 6, 'FW'),
      s('CM1', 30, 30, 'MF'), s('CM2', 50, 26, 'MF'), s('CM3', 70, 30, 'MF'),
      s('LB', 6, 48, 'DF'), s('CB1', 33, 66, 'DF'), s('CB2', 67, 66, 'DF'), s('RB', 94, 48, 'DF'),
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'phoenix',
    nameKey: 'formation.phoenix',
    layout: '4-3-3',
    slots: [
      s('LW', 18, 10, 'FW'), s('ST', 50, 10, 'FW'), s('RW', 82, 10, 'FW'),
      s('CM1', 30, 34, 'MF'), s('CM2', 50, 30, 'MF'), s('CM3', 70, 34, 'MF'),
      ...DF4,
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'neo',
    nameKey: 'formation.neo',
    layout: '4-3-3',
    slots: [
      s('LW', 12, 4, 'FW'), s('ST', 50, 3, 'FW'), s('RW', 88, 4, 'FW'),
      s('CM1', 26, 28, 'MF'), s('CM2', 50, 24, 'MF'), s('CM3', 74, 28, 'MF'),
      ...DF4,
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'death_zone',
    nameKey: 'formation.death_zone',
    layout: '5-3-2',
    slots: [
      s('LW', 36, 10, 'FW'), s('RW', 64, 10, 'FW'),
      s('CM1', 30, 45, 'MF'), s('CM2', 50, 42, 'MF'), s('CM3', 70, 45, 'MF'),
      ...DF5,
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'wild_park',
    nameKey: 'formation.wild_park',
    layout: '3-4-3',
    slots: [
      s('LW', 14, 7, 'FW'), s('ST', 50, 5, 'FW'), s('RW', 86, 7, 'FW'),
      s('CM1', 18, 38, 'MF'), s('CM2', 38, 36, 'MF'), s('CM3', 62, 36, 'MF'), s('CM4', 82, 38, 'MF'),
      s('CB1', 30, 70, 'DF'), s('CB2', 50, 72, 'DF'), s('CB3', 70, 70, 'DF'),
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'ghost_dance',
    nameKey: 'formation.ghost_dance',
    layout: '4-5-1',
    slots: [
      s('ST', 50, 6, 'FW'),
      s('CM1', 8, 42, 'MF'), s('CM2', 28, 35, 'MF'), s('CM3', 50, 32, 'MF'), s('CM4', 72, 35, 'MF'), s('CM5', 92, 42, 'MF'),
      ...DF4,
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'mugen',
    nameKey: 'formation.mugen',
    layout: '4-3-2-1',
    slots: [
      s('ST', 50, 5, 'FW'),
      s('LW', 16, 24, 'MF'), s('CM3', 50, 24, 'MF'), s('RW', 84, 24, 'MF'),
      s('CM1', 36, 48, 'MF'), s('CM2', 64, 48, 'MF'),
      ...DF4,
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: 'phalanx',
    nameKey: 'formation.phalanx',
    layout: '5-4-1',
    slots: [
      s('ST', 50, 6, 'FW'),
      s('CM1', 15, 38, 'MF'), s('CM2', 38, 38, 'MF'), s('CM3', 62, 38, 'MF'), s('CM4', 85, 38, 'MF'),
      ...DF5,
      s('GK', 50, 86, 'GK'),
    ],
  },
]

const ASSIGN_ORDER: Record<FormationId, SlotId[]> = {
  basic: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM1', 'CM2', 'CM3', 'CM4', 'LW', 'RW'],
  three_top: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  butterfly: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  phoenix: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  neo: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  death_zone: ['GK', 'LB', 'CB1', 'CB2', 'CB3', 'RB', 'CM2', 'CM1', 'CM3', 'LW', 'RW'],
  wild_park: ['GK', 'CB1', 'CB2', 'CB3', 'CM2', 'CM1', 'CM3', 'CM4', 'LW', 'ST', 'RW'],
  ghost_dance: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM3', 'CM2', 'CM1', 'CM4', 'CM5', 'ST'],
  mugen: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM1', 'CM2', 'CM3', 'LW', 'RW', 'ST'],
  phalanx: ['GK', 'LB', 'CB1', 'CB2', 'CB3', 'RB', 'CM2', 'CM1', 'CM3', 'CM4', 'ST'],
}

export const DEFAULT_FORMATION: FormationId = 'basic'

/** @deprecated use DEFAULT_FORMATION */
export const FORMATION_433 = FORMATIONS.find(f => f.id === 'three_top')!.slots

export type LineupMap = Partial<Record<SlotId, Player>>

const POS_ORDER: Position[] = ['GK', 'DF', 'MF', 'FW']

export function getFormation(id: FormationId): FormationDef {
  return FORMATIONS.find(f => f.id === id) ?? FORMATIONS[0]
}

export function getFormationSlots(formationId: FormationId = DEFAULT_FORMATION): FormationSlot[] {
  return getFormation(formationId).slots
}

export function getFormationSlotsByLine(formationId: FormationId = DEFAULT_FORMATION): FormationSlot[] {
  return [...getFormationSlots(formationId)].sort((a, b) => a.y - b.y || a.x - b.x)
}

export function getRoleCounts(formationId: FormationId): Record<Position, number> {
  const counts: Record<Position, number> = { GK: 0, DF: 0, MF: 0, FW: 0 }
  for (const slot of getFormationSlots(formationId)) counts[slot.role]++
  return counts
}

function activeSlotIds(formationId: FormationId): SlotId[] {
  return getFormationSlots(formationId).map(s => s.id)
}

export function getSlot(slotId: SlotId, formationId: FormationId = DEFAULT_FORMATION): FormationSlot | undefined {
  return getFormationSlots(formationId).find(s => s.id === slotId)
}

export function canPlace(player: Player, slot: FormationSlot): boolean {
  return player.position === slot.role
}

export function isSlotValid(lineup: LineupMap, slotId: SlotId, formationId: FormationId = DEFAULT_FORMATION): boolean {
  const player = lineup[slotId]
  if (!player) return true
  const slot = getSlot(slotId, formationId)
  return slot ? canPlace(player, slot) : false
}

function orderedCompatibleSlots(
  lineup: LineupMap,
  player: Player,
  formationId: FormationId,
): SlotId[] {
  const active = new Set(activeSlotIds(formationId))
  return ASSIGN_ORDER[formationId].filter(slotId => {
    if (!active.has(slotId)) return false
    const slot = getSlot(slotId, formationId)!
    return !lineup[slotId] && canPlace(player, slot)
  })
}

export function compatibleEmptySlots(
  lineup: LineupMap,
  player: Player,
  formationId: FormationId = DEFAULT_FORMATION,
): SlotId[] {
  return orderedCompatibleSlots(lineup, player, formationId)
}

export function nextEmptySlot(
  lineup: LineupMap,
  player: Player,
  formationId: FormationId = DEFAULT_FORMATION,
): SlotId | null {
  return orderedCompatibleSlots(lineup, player, formationId)[0] ?? null
}

export function missingPositions(lineup: LineupMap, formationId: FormationId = DEFAULT_FORMATION): { role: Position; count: number }[] {
  const needed = getRoleCounts(formationId)
  for (const slot of getFormationSlots(formationId)) {
    if (lineup[slot.id]) needed[slot.role]--
  }
  return POS_ORDER
    .filter(role => needed[role] > 0)
    .map(role => ({ role, count: needed[role] }))
}

export function autoAssign(players: Player[], formationId: FormationId = DEFAULT_FORMATION): LineupMap {
  const lineup: LineupMap = {}
  const remaining = [...players]
  const active = new Set(activeSlotIds(formationId))

  for (const slotId of ASSIGN_ORDER[formationId]) {
    if (!active.has(slotId)) continue
    const slot = getSlot(slotId, formationId)!
    const idx = remaining.findIndex(p => p.position === slot.role)
    if (idx < 0) continue
    lineup[slotId] = remaining.splice(idx, 1)[0]
  }
  return lineup
}

export function remapLineupToFormation(lineup: LineupMap, formationId: FormationId): LineupMap {
  const players = Object.values(lineup).filter((p): p is Player => !!p)
  return autoAssign(players, formationId)
}

export function autoPlacePlayer(
  lineup: LineupMap,
  player: Player,
  formationId: FormationId = DEFAULT_FORMATION,
): LineupMap | null {
  const slotId = nextEmptySlot(lineup, player, formationId)
  if (!slotId) return null
  return { ...lineup, [slotId]: player }
}

export function lineupToArray(lineup: LineupMap, formationId: FormationId = DEFAULT_FORMATION): Player[] {
  return activeSlotIds(formationId)
    .map(id => lineup[id])
    .filter((p): p is Player => !!p)
}

export function placePlayer(
  lineup: LineupMap,
  player: Player,
  slotId: SlotId,
  formationId: FormationId = DEFAULT_FORMATION,
): LineupMap | null {
  const slot = getSlot(slotId, formationId)
  if (!slot || !canPlace(player, slot)) return null

  const next = { ...lineup }
  const displaced = next[slotId]
  const prevSlot = Object.entries(next).find(([, p]) => p?.id === player.id)?.[0] as SlotId | undefined

  if (prevSlot) delete next[prevSlot]
  next[slotId] = player
  if (displaced && prevSlot) {
    const prevSlotDef = getSlot(prevSlot, formationId)
    if (prevSlotDef && canPlace(displaced, prevSlotDef)) {
      next[prevSlot] = displaced
    } else {
      return null
    }
  }
  return next
}

export function sortPlayersByPosition(players: Player[]): Player[] {
  return [...players].sort((a, b) => POS_ORDER.indexOf(a.position) - POS_ORDER.indexOf(b.position))
}
