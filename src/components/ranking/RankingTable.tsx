'use client'
import { useRanking } from '@/lib/hooks/useRanking'
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
}

export function RankingTable({ currentPlayerId }: Props) {
  const ranking = useRanking()

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-center">Puzzles</th>
            <th className="px-4 py-3 text-right">Último puzzle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ranking.map((row, i) => {
            const isMe = !!currentPlayerId && row.player_id === currentPlayerId
            return (
              <tr
                key={row.player_id}
                className={cn(
                  'bg-white hover:bg-gray-50',
                  isMe && 'bg-primary/5 hover:bg-primary/10'
                )}
              >
                <td className={cn('px-4 py-3 font-semibold text-gray-700', isMe && 'text-primary')}>
                  {i + 1}
                </td>
                <td className={cn('px-4 py-3 text-gray-900', isMe && 'font-semibold')}>
                  {row.name}
                  {isMe && <span className="ml-2 text-xs font-normal text-gray-500">(você)</span>}
                </td>
                <td className="px-4 py-3 text-center text-primary font-medium">
                  {row.puzzles_concluidos}
                </td>
                <td className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">
                  {formatLastCompleted(row.ultimo_concluido_em)}
                </td>
              </tr>
            )
          })}
          {ranking.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Nenhum dado ainda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
