'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DayMood } from '@/lib/capiVisioMood'
import {
  CAPIVISIO_EXPRESS_EVENT,
  type CapiVisioExpressDetail,
  type CapiVisioExpression,
} from '@/lib/capiVisioExpressions'
import { CapiVisioAvatar } from './CapiVisioAvatar'

type Props = {
  mood: DayMood | null
}

export function CapiVisioMoodBanner({ mood }: Props) {
  const [override, setOverride] = useState<CapiVisioExpression | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CapiVisioExpressDetail>).detail
      if (!detail) return
      setOverride(detail.expression)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setOverride(null)
        timeoutRef.current = null
      }, detail.duration ?? 1500)
    }
    window.addEventListener(CAPIVISIO_EXPRESS_EVENT, handler)
    return () => {
      window.removeEventListener(CAPIVISIO_EXPRESS_EVENT, handler)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!mood) return null

  const expression = override ?? mood.defaultExpression
  const intensity = override ? 1 : mood.intensity

  return (
    <div
      className={`mb-4 flex flex-col gap-2 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${mood.accent.banner}`}
      role="status"
      aria-label={`Estado da CapiVisio: ${mood.mood}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <CapiVisioAvatar
          expression={expression}
          intensity={intensity}
          size="md"
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold">CapiVisio — {mood.mood}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={mood.quote}
              className="mt-0.5 text-sm italic opacity-90"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.9, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              &ldquo;{mood.quote}&rdquo;
            </motion.p>
          </AnimatePresence>
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
