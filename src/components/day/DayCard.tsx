import Link from 'next/link'
import type { Day } from '@/types/tables'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DayProgress } from './DayProgress'

export type DayStatus = 'locked' | 'unavailable' | 'available' | 'completed'

type Props = {
  day: Day
  status: DayStatus
  completedCount: number
  totalCount: number
}

const statusLabel: Record<DayStatus, string> = {
  locked: 'Bloqueado',
  unavailable: 'Indisponível',
  available: 'Disponível',
  completed: 'Concluído',
}

const statusVariant: Record<DayStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  locked: 'danger',
  unavailable: 'warning',
  available: 'default',
  completed: 'success',
}

export function DayCard({ day, status, completedCount, totalCount }: Props) {
  const isClickable = status === 'available' || status === 'completed'

  const content = (
    <Card className={`flex flex-col gap-3 ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : 'opacity-60'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dia {day.day_number}</p>
          <h2 className="mt-0.5 text-lg font-semibold text-foreground">{day.title}</h2>
        </div>
        <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
      </div>
      {status === 'locked' ? (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Aguardando liberação
        </div>
      ) : (
        <DayProgress completed={completedCount} total={totalCount} />
      )}
    </Card>
  )

  if (!isClickable) return content

  return <Link href={`/dia/${day.day_number}`}>{content}</Link>
}
