import { createClient } from '@/lib/supabase/client'

export async function getDays() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('days')
    .select('*')
    .order('day_number')
  if (error) throw error
  return data
}
