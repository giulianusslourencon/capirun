import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EventBlock } from '@/components/day/EventBlock'
import type { Event, Puzzle } from '@/types/database'

type Params = { params: Promise<{ day: string }> }

type PuzzleWithEvent = Puzzle & {
  events: Pick<Event, 'title' | 'location' | 'order_in_day'> | null
}

export default async function DayPage({ params }: Params) {
  const { day: dayParam } = await params
  const dayNumber = parseInt(dayParam, 10)
  if (isNaN(dayNumber)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: dayData }, { data: puzzlesRaw }, { data: progress }, { data: eventsRaw }] = await Promise.all([
    supabase.from('days').select('*').eq('day_number', dayNumber).single(),
    supabase
      .from('puzzles_public')
      .select('*, events ( title, location, order_in_day )')
      .eq('day_number', dayNumber)
      .order('order_in_day'),
    supabase
      .from('player_puzzles')
      .select('puzzle_id, completed')
      .eq('player_id', user!.id),
    supabase
      .from('events')
      .select('*')
      .eq('day_number', dayNumber)
      .order('order_in_day'),
  ])

  if (!dayData || !dayData.is_unlocked) notFound()

  const puzzles = (puzzlesRaw ?? []) as PuzzleWithEvent[]
  const events = (eventsRaw ?? []) as Event[]
  const completedIds = new Set(
    (progress ?? []).filter((p) => p.completed).map((p) => p.puzzle_id)
  )

  // A puzzle is accessible if all previous puzzles (by order) are completed
  const accessibleIds = new Set<string>()
  for (const puzzle of puzzles) {
    const prevPuzzles = puzzles.filter((p) => p.order_in_day < puzzle.order_in_day)
    const prevAllDone = prevPuzzles.every((p) => completedIds.has(p.id))
    if (prevAllDone) accessibleIds.add(puzzle.id)
  }

  // Group puzzles by event
  const puzzlesByEvent = puzzles.reduce<Record<string, PuzzleWithEvent[]>>((acc, p) => {
    if (!acc[p.event_id]) acc[p.event_id] = []
    acc[p.event_id].push(p)
    return acc
  }, {})

  return (
    <>
      <Navbar />
      <PageWrapper title={`Dia ${dayNumber} — ${dayData.title}`}>
        <div className="flex flex-col gap-10">
          {events.map((event) => (
            <EventBlock
              key={event.id}
              event={event}
              puzzles={puzzlesByEvent[event.id] ?? []}
              completedPuzzleIds={completedIds}
              accessiblePuzzleIds={accessibleIds}
            />
          ))}
        </div>
      </PageWrapper>
    </>
  )
}
