'use client'
import Image from 'next/image'
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

  const thumbnailPath = puzzle.content_path?.replace(/\.md$/, '-thumbnail.png')
  const thumbnailUrl = thumbnailPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events/${thumbnailPath}`
    : null

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{puzzle.name}</h3>
        {isCompleted && <Badge variant="success">Concluído</Badge>}
      </div>

      {thumbnailUrl && puzzle.url && (
        <a href={puzzle.url} target="_blank" rel="noopener noreferrer">
          <Image
            src={thumbnailUrl}
            alt={puzzle.name ?? ''}
            width={600}
            height={600}
            className="w-full rounded"
            loading="eager"
            priority
          />
        </a>
      )}

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
          Abrir no SudokuPad
        </a>
      )}

      {!isCompleted && puzzle.id && <PuzzleCodeInput puzzleId={puzzle.id} />}
    </Card>
  )
}
