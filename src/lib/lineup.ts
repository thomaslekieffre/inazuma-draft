import type { Player, Position } from '../types'

export type SlotId =
  | 'GK'
  | 'LB' | 'CB1' | 'CB2' | 'CB3' | 'RB'
  | 'CM1' | 'CM2' | 'CM3' | 'CM4' | 'CM5'
  | 'LW' | 'ST' | 'RW'

export type FormationId = '433' | '442' | '352' | '4231'

export interface FormationSlot {
  id: SlotId
  label: string
  role: Position
  x: number
  y: number
}

export interface FormationDef {
  id: FormationId
  label: string
  slots: FormationSlot[]
}

function s(id: SlotId, x: number, y: number, role: Position): FormationSlot {
  return { id, label: role, role, x, y }
}

/** y petit = attaque. Chaque formation a le bon nombre de DF/MF/FW. */
export const FORMATIONS: FormationDef[] = [
  {
    id: '433',
    label: '4-3-3',
    slots: [
      s('LW', 14, 7, 'FW'), s('ST', 50, 5, 'FW'), s('RW', 86, 7, 'FW'),
      s('CM1', 28, 32, 'MF'), s('CM2', 50, 27, 'MF'), s('CM3', 72, 32, 'MF'),
      s('LB', 10, 62, 'DF'), s('CB1', 33, 67, 'DF'), s('CB2', 67, 67, 'DF'), s('RB', 90, 62, 'DF'),
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: '442',
    label: '4-4-2',
    slots: [
      s('LW', 36, 8, 'FW'), s('RW', 64, 8, 'FW'),
      s('CM1', 18, 40, 'MF'), s('CM2', 38, 40, 'MF'), s('CM3', 62, 40, 'MF'), s('CM4', 82, 40, 'MF'),
      s('LB', 10, 66, 'DF'), s('CB1', 32, 68, 'DF'), s('CB2', 68, 68, 'DF'), s('RB', 90, 66, 'DF'),
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: '352',
    label: '3-5-2',
    slots: [
      s('LW', 36, 8, 'FW'), s('RW', 64, 8, 'FW'),
      s('LB', 6, 40, 'MF'), s('CM1', 24, 38, 'MF'), s('CM2', 50, 36, 'MF'), s('CM3', 76, 38, 'MF'), s('RB', 94, 40, 'MF'),
      s('CB1', 30, 70, 'DF'), s('CB2', 50, 72, 'DF'), s('CB3', 70, 70, 'DF'),
      s('GK', 50, 86, 'GK'),
    ],
  },
  {
    id: '4231',
    label: '4-2-3-1',
    slots: [
      s('ST', 50, 5, 'FW'),
      s('LW', 16, 24, 'MF'), s('CM3', 50, 24, 'MF'), s('RW', 84, 24, 'MF'),
      s('CM1', 36, 48, 'MF'), s('CM2', 64, 48, 'MF'),
      s('LB', 10, 62, 'DF'), s('CB1', 33, 67, 'DF'), s('CB2', 67, 67, 'DF'), s('RB', 90, 62, 'DF'),
      s('GK', 50, 86, 'GK'),
    ],
  },
]

const ASSIGN_ORDER: Record<FormationId, SlotId[]> = {
  '433': ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  '442': ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM1', 'CM2', 'CM3', 'CM4', 'LW', 'RW'],
  '352': ['GK', 'CB1', 'CB2', 'CB3', 'CM2', 'CM1', 'CM3', 'LB', 'RB', 'LW', 'RW'],
  '4231': ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM1', 'CM2', 'CM3', 'LW', 'RW', 'ST'],
}

/** @deprecated */
export const FORMATION_433 = FORMATIONS[0].slots

export type LineupMap = Partial<Record<SlotId, Player>>

const POS_ORDER: Position[] = ['GK', 'DF', 'MF', 'FW']

export function getFormation(id: FormationId): FormationDef {
  return FORMATIONS.find(f => f.id === id) ?? FORMATIONS[0]
}

export function getFormationSlots(formationId: FormationId = '433'): FormationSlot[] {
  return getFormation(formationId).slots
}

export function getFormationSlotsByLine(formationId: FormationId = '433'): FormationSlot[] {
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

export function getSlot(slotId: SlotId, formationId: FormationId = '433'): FormationSlot | undefined {
  return getFormationSlots(formationId).find(s => s.id === slotId)
}

export function canPlace(player: Player, slot: FormationSlot): boolean {
  return player.position === slot.role
}

export function isSlotValid(lineup: LineupMap, slotId: SlotId, formationId: FormationId = '433'): boolean {
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
  formationId: FormationId = '433',
): SlotId[] {
  return orderedCompatibleSlots(lineup, player, formationId)
}

export function nextEmptySlot(
  lineup: LineupMap,
  player: Player,
  formationId: FormationId = '433',
): SlotId | null {
  return orderedCompatibleSlots(lineup, player, formationId)[0] ?? null
}

export function missingPositions(lineup: LineupMap, formationId: FormationId = '433'): { role: Position; count: number }[] {
  const needed = getRoleCounts(formationId)
  for (const slot of getFormationSlots(formationId)) {
    if (lineup[slot.id]) needed[slot.role]--
  }
  return POS_ORDER
    .filter(role => needed[role] > 0)
    .map(role => ({ role, count: needed[role] }))
}

export function autoAssign(players: Player[], formationId: FormationId = '433'): LineupMap {
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
  formationId: FormationId = '433',
): LineupMap | null {
  const slotId = nextEmptySlot(lineup, player, formationId)
  if (!slotId) return null
  return { ...lineup, [slotId]: player }
}

export function lineupToArray(lineup: LineupMap, formationId: FormationId = '433'): Player[] {
  return activeSlotIds(formationId)
    .map(id => lineup[id])
    .filter((p): p is Player => !!p)
}

export function placePlayer(
  lineup: LineupMap,
  player: Player,
  slotId: SlotId,
  formationId: FormationId = '433',
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
