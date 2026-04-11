'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getRanking } from '@/lib/queries/ranking'
import type { RankingRow } from '@/types/database'

export function useRanking() {
  const [ranking, setRanking] = useState<RankingRow[]>([])

  useEffect(() => {
    getRanking().then(setRanking)

    const supabase = createClient()

    const channel = supabase
      .channel('ranking-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_puzzles' },
        () => getRanking().then(setRanking)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return ranking
}
