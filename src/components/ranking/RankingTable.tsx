'use client'
import { useRanking } from '@/lib/hooks/useRanking'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function RankingTable() {
  const ranking = useRanking()

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-center">Puzzles</th>
            <th className="px-4 py-3 text-right">Último</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ranking.map((row, i) => (
            <tr key={row.player_id} className="bg-white hover:bg-gray-50">
              <td className="px-4 py-3 font-semibold text-gray-700">{i + 1}</td>
              <td className="px-4 py-3 text-gray-900">{row.name}</td>
              <td className="px-4 py-3 text-center text-indigo-600 font-medium">{row.puzzles_concluidos}</td>
              <td className="px-4 py-3 text-right text-gray-500">{formatDate(row.ultimo_concluido_em)}</td>
            </tr>
          ))}
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
