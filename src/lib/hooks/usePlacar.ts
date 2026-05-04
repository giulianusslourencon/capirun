'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getPlacar } from '@/lib/queries/placar'
import type { PlacarRow } from '@/types/tables'

export function usePlacar() {
  const [placar, setPlacar] = useState<PlacarRow[]>([])

  useEffect(() => {
    getPlacar().then(setPlacar)

    const supabase = createClient()

    const channel = supabase
      .channel('placar-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_puzzles' },
        () => getPlacar().then(setPlacar)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return placar
}
