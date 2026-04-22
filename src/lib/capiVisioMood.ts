import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export type FridayPressure = 'leve' | 'moderada' | 'forte' | 'urgente' | 'critica'

export type MoodAccent = {
  banner: string
  strip: string
  chip: string
  badge: string
}

export type DayMood = {
  day: number
  weekday: string
  mood: string
  quote: string
  pressure: FridayPressure
  pressureLabel: string
  accent: MoodAccent
}

export const DAY_MOODS: Record<number, DayMood> = {
  1: {
    day: 1,
    weekday: 'Segunda',
    mood: 'Tranquila, curiosa',
    quote: 'A semana está só começando…',
    pressure: 'leve',
    pressureLabel: 'Pressão pra sexta: leve',
    accent: {
      banner: 'bg-sky-50 border-sky-200 text-sky-900',
      strip: 'bg-sky-100 text-sky-900 border-sky-200',
      chip: 'bg-sky-100 text-sky-800 border-sky-200',
      badge: 'bg-sky-200 text-sky-900',
    },
  },
  2: {
    day: 2,
    weekday: 'Terça',
    mood: 'Animada, depois frustrada',
    quote: 'Metade da semana ainda pela frente.',
    pressure: 'moderada',
    pressureLabel: 'Pressão pra sexta: moderada',
    accent: {
      banner: 'bg-amber-50 border-amber-200 text-amber-900',
      strip: 'bg-amber-100 text-amber-900 border-amber-200',
      chip: 'bg-amber-100 text-amber-800 border-amber-200',
      badge: 'bg-amber-200 text-amber-900',
    },
  },
  3: {
    day: 3,
    weekday: 'Quarta',
    mood: 'Estressada, perdida',
    quote: 'Quarta-feira já — e nada concreto.',
    pressure: 'forte',
    pressureLabel: 'Pressão pra sexta: forte',
    accent: {
      banner: 'bg-orange-50 border-orange-300 text-orange-900',
      strip: 'bg-orange-100 text-orange-900 border-orange-300',
      chip: 'bg-orange-100 text-orange-800 border-orange-300',
      badge: 'bg-orange-300 text-orange-950',
    },
  },
  4: {
    day: 4,
    weekday: 'Quinta',
    mood: 'Focada, determinada',
    quote: 'A dinâmica começa amanhã.',
    pressure: 'urgente',
    pressureLabel: 'Pressão pra sexta: urgente',
    accent: {
      banner: 'bg-rose-50 border-rose-300 text-rose-900',
      strip: 'bg-rose-100 text-rose-900 border-rose-300',
      chip: 'bg-rose-100 text-rose-800 border-rose-300',
      badge: 'bg-rose-300 text-rose-950',
    },
  },
  5: {
    day: 5,
    weekday: 'Sexta',
    mood: 'Aliviada, correndo',
    quote: 'Poucas horas.',
    pressure: 'critica',
    pressureLabel: 'Pressão pra sexta: crítica',
    accent: {
      banner: 'bg-red-50 border-red-400 text-red-900 animate-pulse',
      strip: 'bg-red-100 text-red-900 border-red-400',
      chip: 'bg-red-100 text-red-900 border-red-400',
      badge: 'bg-red-500 text-white',
    },
  },
}

export function moodForDay(day: number | null | undefined): DayMood | null {
  if (day == null) return null
  return DAY_MOODS[day] ?? null
}

export async function getCurrentMood(
  supabase: SupabaseClient<Database>
): Promise<DayMood | null> {
  const { data, error } = await supabase
    .from('days')
    .select('day_number')
    .eq('is_unlocked', true)
    .order('day_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return moodForDay(data.day_number)
}
