'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Player } from '@/types/tables'
import { Card } from '@/components/ui/Card'

export function AdminPlayerTestToggle({ player }: { player: Player }) {
  const [isTest, setIsTest] = useState(player.is_test)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    const supabase = createClient()
    const next = !isTest
    await supabase.from('players').update({ is_test: next }).eq('id', player.id)
    setIsTest(next)
    setLoading(false)
    router.refresh()
  }

  return (
    <Card className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{player.name}</p>
        <p className="truncate text-xs text-muted-foreground">{player.email}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className={`text-xs font-medium ${isTest ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
          {isTest ? 'teste' : 'desafio'}
        </span>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isTest ? 'bg-amber-500' : 'bg-emerald-500'}`}
          aria-label={isTest ? 'Marcar como participante real' : 'Marcar como teste'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform ${isTest ? 'translate-x-1' : 'translate-x-6'}`}
          />
        </button>
      </div>
    </Card>
  )
}
