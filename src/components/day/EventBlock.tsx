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

type NarrativeBlock =
  | { type: 'dialog'; name: string; content: string }
  | { type: 'prose'; content: string }

function parseNarrativeBlocks(markdown: string): NarrativeBlock[] {
  return markdown.split(/\n\n+/).flatMap(para => {
    const trimmed = para.trim()
    if (!trimmed) return []
    const m = trimmed.match(/^>\s*\*\*(.+?):\*\*\s*(.*)$/s)
    return m
      ? [{ type: 'dialog' as const, name: m[1], content: m[2].trim() }]
      : [{ type: 'prose' as const, content: trimmed }]
  })
}

function DialogBox({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden text-sm shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {name}
      </div>
      <div className="px-3 py-2.5 text-gray-800 leading-relaxed italic prose prose-sm max-w-none">
        {children}
      </div>
    </div>
  )
}

function NarrativeSection({ markdown, proseClassName }: { markdown: string; proseClassName: string }) {
  return (
    <div className="flex flex-col gap-2">
      {parseNarrativeBlocks(markdown).map((block, i) =>
        block.type === 'dialog' ? (
          <DialogBox key={i} name={block.name}>
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </DialogBox>
        ) : (
          <div key={i} className={proseClassName}>
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        )
      )}
    </div>
  )
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
        <NarrativeSection
          markdown={event.text_before}
          proseClassName="text-sm text-gray-600 leading-relaxed italic prose prose-sm max-w-none"
        />
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
        <div className="rounded-lg bg-green-50 p-3">
          <NarrativeSection
            markdown={event.text_after}
            proseClassName="text-sm text-green-800 leading-relaxed prose prose-sm max-w-none"
          />
        </div>
      )}
    </section>
  )
}
