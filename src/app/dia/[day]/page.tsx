import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { DayProgress } from '@/components/day/DayProgress'
import { EventCalendarEntry } from '@/components/day/EventCalendarEntry'
import { EventBlock } from '@/components/day/EventBlock'
import { readEventContent } from '@/lib/content'
import { computeAccessibleIds } from '@/lib/utils'
import type { Puzzle } from '@/types/database'

type Props = {
  params: Promise<{ day: string }>
  searchParams: Promise<{ evento?: string }>
}

export default async function DayPage({ params, searchParams }: Props) {
  const { day: dayParam } = await params
  const { evento } = await searchParams
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
  const accessibleIds = computeAccessibleIds(puzzles, completedIds)
  const completedCount = puzzles.filter((p) => completedIds.has(p.id ?? '')).length

  // — Event detail view —
  if (evento !== undefined) {
    const orderInDay = parseInt(evento, 10)
    const puzzle = !isNaN(orderInDay)
      ? puzzles.find((p) => p.order_in_day === orderInDay) ?? null
      : null

    if (!puzzle || !puzzle.id) notFound()

    const isAccessible = accessibleIds.has(puzzle.id)
    const isCompleted = completedIds.has(puzzle.id)

    let event = null
    if (isAccessible && puzzle.content_path) {
      event = await readEventContent(puzzle.content_path)
      if (!event) console.error(`[DayPage] Failed to load content: ${puzzle.content_path}`)
    }

    const backLink = (
      <Link
        href={`/dia/${dayNumber}`}
        className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para o Dia {dayNumber}
      </Link>
    )

    return (
      <>
        <Navbar />
        <PageWrapper title={puzzle.name ?? `Evento ${orderInDay}`}>
          {!isAccessible ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="rounded-full bg-gray-100 p-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="font-medium text-gray-700">Evento bloqueado</p>
              <p className="text-sm text-gray-500">Complete os eventos anteriores para desbloquear este.</p>
              <Link href={`/dia/${dayNumber}`} className="mt-2 text-sm text-primary hover:underline">
                ← Voltar para o Dia {dayNumber}
              </Link>
            </div>
          ) : event === null ? (
            <>
              {backLink}
              <p className="text-sm text-gray-500">Conteúdo indisponível.</p>
            </>
          ) : (
            <>
              {backLink}
              <EventBlock
                event={event}
                puzzle={puzzle}
                isCompleted={isCompleted}
                isAccessible={isAccessible}
              />
            </>
          )}
        </PageWrapper>
      </>
    )
  }

  // — Calendar view —
  return (
    <>
      <Navbar />
      <PageWrapper title={`Dia ${dayNumber} — ${dayData.title}`}>
        <div className="mb-4">
          <DayProgress completed={completedCount} total={puzzles.length} />
        </div>

        {puzzles.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum evento disponível para este dia.</p>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="divide-y divide-gray-100">
              {puzzles.map((puzzle) => (
                <EventCalendarEntry
                  key={puzzle.id ?? ''}
                  puzzle={puzzle}
                  dayNumber={dayNumber}
                  isCompleted={completedIds.has(puzzle.id ?? '')}
                  isAccessible={accessibleIds.has(puzzle.id ?? '')}
                />
              ))}
            </div>
          </Card>
        )}
      </PageWrapper>
    </>
  )
}
