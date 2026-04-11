import { createClient } from '@/lib/supabase/client'

export async function getMyProgress() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('player_puzzles')
    .select('puzzle_id, completed, completed_at')
    .eq('player_id', user.id)
  if (error) throw error
  return data
}
