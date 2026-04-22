'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Day } from '@/types/tables'
import { Card } from '@/components/ui/Card'

export function AdminDayToggle({ day }: { day: Day }) {
  const [unlocked, setUnlocked] = useState(day.is_unlocked)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    const supabase = createClient()
    const next = !unlocked
    await supabase
      .from('days')
      .update({ is_unlocked: next, unlocked_at: next ? new Date().toISOString() : null })
      .eq('day_number', day.day_number)
    setUnlocked(next)
    setLoading(false)
    router.refresh()
  }

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900">Dia {day.day_number} — {day.title}</p>
        {day.unlocked_at && (
          <p className="text-xs text-gray-400">
            Liberado em {new Date(day.unlocked_at).toLocaleString('pt-BR')}
          </p>
        )}
      </div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${unlocked ? 'bg-primary' : 'bg-gray-300'}`}
        aria-label={unlocked ? 'Bloquear dia' : 'Liberar dia'}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${unlocked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </Card>
  )
}
