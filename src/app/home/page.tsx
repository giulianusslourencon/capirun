import { createClient } from '@/lib/supabase/server'
import { DayCard, type DayStatus } from '@/components/day/DayCard'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { IntroModal } from '@/components/intro/IntroModal'
import type { Day } from '@/types/database'

type PuzzleProgressRow = {
  puzzle_id: string
  completed: boolean
  completed_at: string | null
}

function getDayStatus(
  day: Day,
  prevDayCompleted: boolean,
  allPuzzlesCompleted: boolean
): DayStatus {
  if (!day.is_unlocked) return 'locked'
  if (day.day_number > 1 && !prevDayCompleted) return 'unavailable'
  if (allPuzzlesCompleted) return 'completed'
  return 'available'
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: days }, { data: puzzles }, { data: progress }] = await Promise.all([
    supabase.from('days').select('*').order('day_number'),
    supabase.from('puzzles_public').select('id, day_number'),
    supabase.from('player_puzzles').select('puzzle_id, completed, completed_at').eq('player_id', user!.id),
  ])

  const completedIds = new Set(
    (progress as PuzzleProgressRow[] | null ?? []).filter((p) => p.completed).map((p) => p.puzzle_id)
  )

  const puzzlesByDay = (puzzles ?? []).reduce<Record<number, string[]>>((acc, p) => {
    if (p.day_number == null || p.id == null) return acc
    if (!acc[p.day_number]) acc[p.day_number] = []
    acc[p.day_number].push(p.id)
    return acc
  }, {})

  const isAllCompleted = (dayNumber: number) => {
    const ids = puzzlesByDay[dayNumber] ?? []
    return ids.length > 0 && ids.every((id) => completedIds.has(id))
  }

  const completedCount = (dayNumber: number) =>
    (puzzlesByDay[dayNumber] ?? []).filter((id) => completedIds.has(id)).length

  return (
    <>
      <IntroModal />
      <Navbar />
      <PageWrapper title="Dias">
        <div className="flex flex-col gap-4">
          {(days ?? []).map((day, i) => {
            const prevDayCompleted = i === 0 || isAllCompleted(day.day_number - 1)
            const allCompleted = isAllCompleted(day.day_number)
            const status = getDayStatus(day, prevDayCompleted, allCompleted)
            return (
              <DayCard
                key={day.day_number}
                day={day}
                status={status}
                completedCount={completedCount(day.day_number)}
                totalCount={(puzzlesByDay[day.day_number] ?? []).length}
              />
            )
          })}
        </div>
      </PageWrapper>
    </>
  )
}
