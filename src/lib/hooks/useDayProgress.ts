'use client'
import { useEffect, useState } from 'react'
import { getMyProgress } from '@/lib/queries/progress'
import type { PlayerPuzzle } from '@/types/tables'

export function useDayProgress() {
  const [progress, setProgress] = useState<Pick<PlayerPuzzle, 'puzzle_id' | 'completed' | 'completed_at'>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyProgress().then((data) => {
      setProgress(data)
      setLoading(false)
    })
  }, [])

  const isCompleted = (puzzleId: string) =>
    progress.some((p) => p.puzzle_id === puzzleId && p.completed)

  return { progress, loading, isCompleted }
}
