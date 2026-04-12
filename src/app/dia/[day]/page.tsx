import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EventBlock } from '@/components/day/EventBlock'
import { readEventContent } from '@/lib/content'
import type { Puzzle } from '@/types/database'

type Params = { params: Promise<{ day: string }> }

export default async function DayPage({ params }: Params) {
  const { day: dayParam } = await params
  const dayNumber = parseInt(dayParam, 10)
  if (isNaN(dayNumber)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: dayData }, { data: puzzlesRaw }, { data: progress }] = await Promise.all([
    supabase.from('days').select('*').eq('day_number', dayNumber).single(),
    supabase
      .from('puzzles_public')
      .select('*')
      .eq('day_number', dayNumber)
      .order('order_in_day'),
    supabase
      .from('player_puzzles')
      .select('puzzle_id, completed')
      .eq('player_id', user!.id),
  ])

  if (!dayData || !dayData.is_unlocked) notFound()

  const puzzles = (puzzlesRaw ?? []) as Puzzle[]
  const completedIds = new Set(
    (progress ?? []).filter((p) => p.completed).map((p) => p.puzzle_id)
  )

  // A puzzle is accessible if all previous puzzles (by order) are completed
  const accessibleIds = new Set<string>()
  for (const puzzle of puzzles) {
    if (!puzzle.id || puzzle.order_in_day == null) continue
    const prevPuzzles = puzzles.filter((p) => p.order_in_day != null && p.order_in_day < puzzle.order_in_day!)
    const prevAllDone = prevPuzzles.every((p) => completedIds.has(p.id ?? ''))
    if (prevAllDone) accessibleIds.add(puzzle.id)
  }

  // Load event content per puzzle (1-to-1 relationship: each puzzle has its own .md)
  const puzzleEntries = await Promise.all(
    puzzles
      .filter((p) => p.content_path != null)
      .map(async (p) => ({ puzzle: p, event: await readEventContent(p.content_path!) }))
  )
  const validEntries = puzzleEntries.filter((e) => {
    if (e.event === null) {
      console.error(`[DayPage] Failed to load event content: ${e.puzzle.content_path}`)
      return false
    }
    return true
  })

  return (
    <>
      <Navbar />
      <PageWrapper title={`Dia ${dayNumber} — ${dayData.title}`}>
        <div className="flex flex-col gap-10">
          {validEntries.map(({ puzzle, event }) => (
            <EventBlock
              key={puzzle.id ?? ''}
              event={event!}
              puzzles={[puzzle]}
              completedPuzzleIds={completedIds}
              accessiblePuzzleIds={accessibleIds}
              allCompleted={completedIds.has(puzzle.id ?? '')}
            />
          ))}
        </div>
      </PageWrapper>
    </>
  )
}
