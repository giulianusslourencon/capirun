import matter from 'gray-matter'
import { createClient } from '@/lib/supabase/server'

export type EventContent = {
  title: string
  location: string
  order_in_day: number
  text_before: string
  text_after: string
}

const BUCKET = 'events'

export async function readEventContent(storagePath: string): Promise<EventContent | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(BUCKET).download(storagePath)
  if (error || !data) return null

  const raw = await data.text()
  const { data: fm, content } = matter(raw)

  const afterBefore = content.split('<!-- text_before -->')[1] ?? ''
  const [textBeforeRaw, textAfterRaw = ''] = afterBefore.split('<!-- text_after -->')

  return {
    title: fm.title ?? '',
    location: fm.location ?? '',
    order_in_day: fm.order_in_day ?? 0,
    text_before: textBeforeRaw.trim(),
    text_after: textAfterRaw.trim(),
  }
}
