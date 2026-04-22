import type { DayMood } from '@/lib/capiVisioMood'

type Props = {
  mood: DayMood | null
}

export function CapiVisioMoodStrip({ mood }: Props) {
  if (!mood) return null

  return (
    <div
      className={`border-b px-4 py-1.5 text-xs ${mood.accent.strip}`}
      role="status"
      aria-label={`CapiVisio está ${mood.mood}, pressão ${mood.pressure}`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <span aria-hidden>🦫</span>
        <span className="font-medium truncate">
          <span className="hidden sm:inline">CapiVisio — </span>
          {mood.mood}
        </span>
        <span className="opacity-60">·</span>
        <span className="font-semibold whitespace-nowrap">{mood.pressureLabel}</span>
      </div>
    </div>
  )
}
