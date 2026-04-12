import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Puzzle } from '@/types/database'

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
