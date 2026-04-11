'use client'
import type { Puzzle } from '@/types/database'
import { PuzzleLock } from './PuzzleLock'
import { PuzzleCodeInput } from './PuzzleCodeInput'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

type Props = {
  puzzle: Puzzle
  isCompleted: boolean
  isAccessible: boolean
}

export function PuzzleCard({ puzzle, isCompleted, isAccessible }: Props) {
  if (!isAccessible) return <PuzzleLock />

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{puzzle.name}</h3>
        {isCompleted && <Badge variant="success">Concluído</Badge>}
      </div>

      {puzzle.url && (
        <a
          href={puzzle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Abrir puzzle
        </a>
      )}

      {!isCompleted && <PuzzleCodeInput puzzleId={puzzle.id} />}

      {isCompleted && puzzle.text_after && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          <p className="font-medium mb-1">Dica desbloqueada:</p>
          <p>{puzzle.text_after}</p>
        </div>
      )}
    </Card>
  )
}
