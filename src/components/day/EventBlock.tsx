import ReactMarkdown from 'react-markdown'
import type { EventContent } from '@/lib/content'
import type { Puzzle } from '@/types/database'
import { PuzzleCard } from '@/components/puzzle/PuzzleCard'

type Props = {
  event: EventContent
  puzzles: Puzzle[]
  completedPuzzleIds: Set<string>
  accessiblePuzzleIds: Set<string>
  allCompleted: boolean
}

export function EventBlock({ event, puzzles, completedPuzzleIds, accessiblePuzzleIds, allCompleted }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
        {event.location && (
          <p className="mt-0.5 text-sm text-gray-500 flex items-center gap-1">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </p>
        )}
      </div>

      {event.text_before && (
        <div className="text-sm text-gray-600 leading-relaxed border-l-4 border-primary/30 pl-3 italic prose prose-sm max-w-none">
          <ReactMarkdown>{event.text_before}</ReactMarkdown>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {puzzles.map((puzzle) => (
          <PuzzleCard
            key={puzzle.id ?? ''}
            puzzle={puzzle}
            isCompleted={completedPuzzleIds.has(puzzle.id ?? '')}
            isAccessible={accessiblePuzzleIds.has(puzzle.id ?? '')}
          />
        ))}
      </div>

      {allCompleted && event.text_after && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 prose prose-sm max-w-none">
          <ReactMarkdown>{event.text_after}</ReactMarkdown>
        </div>
      )}
    </section>
  )
}
