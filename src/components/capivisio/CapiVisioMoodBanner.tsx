import type { DayMood } from '@/lib/capiVisioMood'

type Props = {
  mood: DayMood | null
}

export function CapiVisioMoodBanner({ mood }: Props) {
  if (!mood) return null

  return (
    <div
      className={`mb-4 flex flex-col gap-2 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${mood.accent.banner}`}
      role="status"
      aria-label={`Estado da CapiVisio: ${mood.mood}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="text-2xl leading-none" aria-hidden>🦫</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            CapiVisio — {mood.mood}
          </p>
          <p className="mt-0.5 text-sm italic opacity-90">
            &ldquo;{mood.quote}&rdquo;
          </p>
        </div>
      </div>
      <span
        className={`self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide whitespace-nowrap sm:self-center ${mood.accent.badge}`}
      >
        {mood.pressureLabel}
      </span>
    </div>
  )
}
