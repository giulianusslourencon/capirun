import Link from 'next/link'
import type { Puzzle } from '@/types/tables'
import { Badge } from '@/components/ui/Badge'

type EventStatus = 'completed' | 'available' | 'locked'

const statusConfig: Record<EventStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
  completed: { label: 'Concluído',   variant: 'success' },
  available:  { label: 'Disponível', variant: 'default' },
  locked:     { label: 'Bloqueado',  variant: 'danger'  },
}

type Props = {
  puzzle: Puzzle
  dayNumber: number
  isCompleted: boolean
  isAccessible: boolean
}

export function EventCalendarEntry({ puzzle, dayNumber, isCompleted, isAccessible }: Props) {
  const status: EventStatus = isCompleted ? 'completed' : isAccessible ? 'available' : 'locked'
  const { label, variant } = statusConfig[status]
  const isClickable = status !== 'locked'

  const inner = (
    <div
      className={[
        'flex items-center gap-4 px-4 py-4 transition-colors',
        isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-60',
      ].join(' ')}
    >
      {/* Order circle */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {String(puzzle.order_in_day ?? '?').padStart(2, '0')}
      </div>

      {/* Name + location */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{puzzle.name ?? '—'}</p>
        {puzzle.location && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {puzzle.location}
          </p>
        )}
      </div>

      {/* Status badge + chevron */}
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={variant}>{label}</Badge>
        {isClickable && (
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </div>
  )

  if (!isClickable || puzzle.order_in_day == null) return inner

  return <Link href={`/dia/${dayNumber}?evento=${puzzle.order_in_day}`}>{inner}</Link>
}
