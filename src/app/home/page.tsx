import { createClient } from '@/lib/supabase/server'
import { DayCard } from '@/components/day/DayCard'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { IntroModal } from '@/components/intro/IntroModal'
import { IntroTrigger } from '@/components/intro/IntroTrigger'
import { getCurrentMood } from '@/lib/capiVisioMood'
import { canAccessRanking } from '@/lib/auth/canAccessRanking'
import { computeDayStatuses } from '@/lib/utils'

type PuzzleProgressRow = {
  puzzle_id: string
  completed: boolean
  completed_at: string | null
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: days }, { data: puzzles }, { data: progress }, mood, rankingAccess] = await Promise.all([
    supabase.from('days').select('*').order('day_number'),
    supabase.from('puzzles_public').select('id, day_number'),
    supabase.from('player_puzzles').select('puzzle_id, completed, completed_at').eq('player_id', user!.id),
    getCurrentMood(supabase, user!.id),
    canAccessRanking(supabase, user),
  ])

  const completedIds = new Set(
    (progress as PuzzleProgressRow[] | null ?? []).filter((p) => p.completed).map((p) => p.puzzle_id)
  )

  const dayStatuses = computeDayStatuses(days ?? [], puzzles ?? [], completedIds)

  const puzzlesByDay = (puzzles ?? []).reduce<Record<number, string[]>>((acc, p) => {
    if (p.day_number == null || p.id == null) return acc
    if (!acc[p.day_number]) acc[p.day_number] = []
    acc[p.day_number].push(p.id)
    return acc
  }, {})

  const completedCount = (dayNumber: number) =>
    (puzzlesByDay[dayNumber] ?? []).filter((id) => completedIds.has(id)).length

  return (
    <>
      <IntroModal />
      <Navbar mood={mood} canAccessRanking={rankingAccess} />
      <PageWrapper>
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dias</h1>
          <IntroTrigger />
        </div>
        <div className="flex flex-col gap-4">
          {(days ?? []).map((day) => (
            <DayCard
              key={day.day_number}
              day={day}
              status={dayStatuses.get(day.day_number) ?? 'locked'}
              completedCount={completedCount(day.day_number)}
              totalCount={(puzzlesByDay[day.day_number] ?? []).length}
            />
          ))}
        </div>
      </PageWrapper>
    </>
  )
}
