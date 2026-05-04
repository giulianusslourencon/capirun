'use client'
import { usePlacar } from '@/lib/hooks/usePlacar'
import { cn } from '@/lib/utils'

function formatLastCompleted(iso: string | null) {
  if (!iso) return '—'
  const date = new Date(iso)
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.floor((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)

  if (diffDays <= 0) return `hoje, ${time}`
  if (diffDays === 1) return `ontem, ${time}`
  if (diffDays < 7) {
    const weekday = date
      .toLocaleDateString('pt-BR', { weekday: 'short' })
      .replace('.', '')
      .toLowerCase()
    return `${weekday}, ${time}`
  }
  const dm = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  return `${dm} ${time}`
}

type Props = {
  currentPlayerId?: string
  totalPuzzles: number
}

export function PlacarTable({ currentPlayerId, totalPuzzles }: Props) {
  const placar = usePlacar()

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-left">Progresso</th>
            <th className="px-4 py-3 text-right">Último puzzle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {placar.map((row) => {
            const isMe = !!currentPlayerId && row.player_id === currentPlayerId
            const done = row.puzzles_concluidos ?? 0
            const pct = totalPuzzles > 0 ? Math.min(100, (done / totalPuzzles) * 100) : 0
            return (
              <tr
                key={row.player_id}
                className={cn(
                  'bg-card hover:bg-accent',
                  isMe && 'bg-primary/5 hover:bg-primary/10'
                )}
              >
                <td className={cn('px-4 py-3 text-foreground', isMe && 'font-semibold')}>
                  {row.name}
                  {isMe && <span className="ml-2 text-xs font-normal text-muted-foreground">(você)</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                      {done} de {totalPuzzles}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                  {formatLastCompleted(row.ultimo_concluido_em)}
                </td>
              </tr>
            )
          })}
          {placar.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Ninguém concluiu puzzle ainda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
