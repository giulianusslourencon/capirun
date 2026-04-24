import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Puzzle } from '@/types/tables'
import type { DayStatus } from '@/components/day/DayCard'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function computeAccessibleIds(puzzles: Puzzle[], completedIds: Set<string>): Set<string> {
  const accessibleIds = new Set<string>()
  for (const puzzle of puzzles) {
    if (!puzzle.id || puzzle.order_in_day == null) continue
    const prevPuzzles = puzzles.filter(
      (p) => p.order_in_day != null && p.order_in_day < puzzle.order_in_day!
    )
    const prevAllDone = prevPuzzles.every((p) => completedIds.has(p.id ?? ''))
    if (prevAllDone) accessibleIds.add(puzzle.id)
  }
  return accessibleIds
}

type DayRow = { day_number: number; is_unlocked: boolean }
type PuzzleRef = { id: string | null; day_number: number | null }

export function computeDayStatuses(
  days: DayRow[],
  allPuzzles: PuzzleRef[],
  completedIds: Set<string>
): Map<number, DayStatus> {
  const puzzlesByDay = new Map<number, string[]>()
  for (const p of allPuzzles) {
    if (p.id == null || p.day_number == null) continue
    const list = puzzlesByDay.get(p.day_number) ?? []
    list.push(p.id)
    puzzlesByDay.set(p.day_number, list)
  }

  const isAllCompleted = (dayNumber: number) => {
    const ids = puzzlesByDay.get(dayNumber) ?? []
    return ids.length > 0 && ids.every((id) => completedIds.has(id))
  }

  const sorted = [...days].sort((a, b) => a.day_number - b.day_number)
  const firstDayNumber = sorted[0]?.day_number ?? 1
  const statuses = new Map<number, DayStatus>()

  for (const day of sorted) {
    const prevDone =
      day.day_number === firstDayNumber || isAllCompleted(day.day_number - 1)
    let status: DayStatus
    if (!day.is_unlocked) status = 'locked'
    else if (day.day_number > firstDayNumber && !prevDone) status = 'unavailable'
    else if (isAllCompleted(day.day_number)) status = 'completed'
    else status = 'available'
    statuses.set(day.day_number, status)
  }

  return statuses
}
