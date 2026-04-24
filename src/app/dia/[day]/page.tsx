import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { DayProgress } from '@/components/day/DayProgress'
import { EventCalendarEntry } from '@/components/day/EventCalendarEntry'
import { EventBlock } from '@/components/day/EventBlock'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PrevNextNav, type NavTarget } from '@/components/navigation/PrevNextNav'
import { readEventContent } from '@/lib/content'
import { computeAccessibleIds, computeDayStatuses } from '@/lib/utils'
import { getCurrentMood } from '@/lib/capiVisioMood'
import { getMyLastMurdleAccusation } from '@/lib/queries/murdle'
import type { Puzzle } from '@/types/tables'

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

  const [
    { data: dayData },
    { data: puzzlesRaw },
    { data: allDays },
    { data: allPuzzles },
    { data: progress },
    mood,
  ] = await Promise.all([
    supabase.from('days').select('*').eq('day_number', dayNumber).single(),
    supabase
      .from('puzzles_public')
      .select('*')
      .eq('day_number', dayNumber)
      .order('order_in_day'),
    supabase
      .from('days')
      .select('day_number, is_unlocked, title')
      .order('day_number'),
    supabase.from('puzzles_public').select('id, day_number'),
    supabase
      .from('player_puzzles')
      .select('puzzle_id, completed')
      .eq('player_id', user!.id),
    getCurrentMood(supabase, user!.id),
  ])

  if (!dayData || !dayData.is_unlocked) notFound()

  const puzzles = (puzzlesRaw ?? []) as Puzzle[]
  const completedIds = new Set(
    (progress ?? []).filter((p) => p.completed).map((p) => p.puzzle_id)
  )
  const accessibleIds = computeAccessibleIds(puzzles, completedIds)
  const completedCount = puzzles.filter((p) => completedIds.has(p.id ?? '')).length

  const dayStatuses = computeDayStatuses(allDays ?? [], allPuzzles ?? [], completedIds)

  type DayNav = { target: NavTarget | null; disabled: boolean; reason?: string }

  const toDayNav = (n: number): DayNav => {
    const status = dayStatuses.get(n)
    if (!status) return { target: null, disabled: false }
    const disabled = status === 'locked' || status === 'unavailable'
    const reason =
      status === 'locked'
        ? 'Dia bloqueado'
        : status === 'unavailable'
          ? 'Complete o dia anterior para liberar'
          : undefined
    return {
      target: { href: `/dia/${n}`, label: `Dia ${n}` },
      disabled,
      reason,
    }
  }

  const prevDayNav = toDayNav(dayNumber - 1)
  const nextDayNav = toDayNav(dayNumber + 1)

  // — Event detail view —
  if (evento !== undefined) {
    const orderInDay = parseInt(evento, 10)
    const puzzle = !isNaN(orderInDay)
      ? puzzles.find((p) => p.order_in_day === orderInDay) ?? null
      : null

    if (!puzzle || !puzzle.id) notFound()

    const isAccessible = accessibleIds.has(puzzle.id)
    const isCompleted = completedIds.has(puzzle.id)
    const shouldFetchAccusation =
      isAccessible && isCompleted && puzzle.day_number === 5

    const [event, initialAccusation] = await Promise.all([
      isAccessible && puzzle.content_path
        ? readEventContent(puzzle.content_path)
        : Promise.resolve(null),
      shouldFetchAccusation
        ? getMyLastMurdleAccusation(supabase, user!.id, puzzle.id)
        : Promise.resolve(null),
    ])

    if (isAccessible && puzzle.content_path && !event) {
      console.error(`[DayPage] Failed to load content: ${puzzle.content_path}`)
    }

    const toEventNav = (p: Puzzle | undefined): DayNav => {
      if (!p?.id || p.order_in_day == null) return { target: null, disabled: false }
      const disabled = !accessibleIds.has(p.id)
      return {
        target: {
          href: `/dia/${dayNumber}?evento=${p.order_in_day}`,
          label: `Evento ${String(p.order_in_day).padStart(2, '0')}`,
        },
        disabled,
        reason: disabled ? 'Complete o evento anterior para liberar' : undefined,
      }
    }

    const prevEventNav = toEventNav(
      puzzles.find((p) => p.order_in_day === orderInDay - 1)
    )
    const nextEventNav = toEventNav(
      puzzles.find((p) => p.order_in_day === orderInDay + 1)
    )

    const eventBreadcrumb = (
      <Breadcrumb
        items={[
          { label: 'Início', href: '/home' },
          { label: `Dia ${dayNumber}`, href: `/dia/${dayNumber}` },
          { label: `Evento ${String(orderInDay).padStart(2, '0')}` },
        ]}
      />
    )

    const eventTopNav = (
      <PrevNextNav
        prev={prevEventNav.target}
        next={nextEventNav.target}
        prevDisabled={prevEventNav.disabled}
        nextDisabled={nextEventNav.disabled}
        prevDisabledReason={prevEventNav.reason}
        nextDisabledReason={nextEventNav.reason}
        className="mb-6"
      />
    )

    const eventBottomNav = (
      <PrevNextNav
        prev={prevEventNav.target}
        next={nextEventNav.target}
        prevDisabled={prevEventNav.disabled}
        nextDisabled={nextEventNav.disabled}
        prevDisabledReason={prevEventNav.reason}
        nextDisabledReason={nextEventNav.reason}
        className="mt-8"
      />
    )

    return (
      <>
        <Navbar mood={mood} />
        <PageWrapper title={puzzle.name ?? `Evento ${orderInDay}`}>
          {eventBreadcrumb}
          {eventTopNav}
          {!isAccessible ? (
            <>
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
              {eventBottomNav}
            </>
          ) : event === null ? (
            <>
              <p className="text-sm text-gray-500">Conteúdo indisponível.</p>
              {eventBottomNav}
            </>
          ) : (
            <>
              <EventBlock
                event={event}
                puzzle={puzzle}
                isCompleted={isCompleted}
                isAccessible={isAccessible}
                initialAccusation={initialAccusation}
              />
              {eventBottomNav}
            </>
          )}
        </PageWrapper>
      </>
    )
  }

  // — Calendar view —
  const dayTopNav = (
    <PrevNextNav
      prev={prevDayNav.target}
      next={nextDayNav.target}
      prevDisabled={prevDayNav.disabled}
      nextDisabled={nextDayNav.disabled}
      prevDisabledReason={prevDayNav.reason}
      nextDisabledReason={nextDayNav.reason}
      className="mb-6"
    />
  )

  const dayBottomNav = (
    <PrevNextNav
      prev={prevDayNav.target}
      next={nextDayNav.target}
      prevDisabled={prevDayNav.disabled}
      nextDisabled={nextDayNav.disabled}
      prevDisabledReason={prevDayNav.reason}
      nextDisabledReason={nextDayNav.reason}
      className="mt-8"
    />
  )

  return (
    <>
      <Navbar mood={mood} />
      <PageWrapper title={`Dia ${dayNumber} — ${dayData.title}`}>
        <Breadcrumb
          items={[
            { label: 'Início', href: '/home' },
            { label: `Dia ${dayNumber}` },
          ]}
        />
        {dayTopNav}
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
        {dayBottomNav}
      </PageWrapper>
    </>
  )
}
