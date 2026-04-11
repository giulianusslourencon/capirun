import { createClient } from '@/lib/supabase/client'

export async function getRanking() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ranking')
    .select('*')
  if (error) throw error
  return data
}
