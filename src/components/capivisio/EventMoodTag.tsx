import type { DayMood } from '@/lib/capiVisioMood'

type Props = {
  mood: DayMood | null
}

export function EventMoodTag({ mood }: Props) {
  if (!mood) return null

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${mood.accent.chip}`}
      title={`CapiVisio: ${mood.mood}`}
    >
      <span aria-hidden>🦫</span>
      {mood.pressureLabel}
    </span>
  )
}
