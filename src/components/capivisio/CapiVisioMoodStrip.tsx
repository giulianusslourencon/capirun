'use client'

import { useEffect, useRef, useState } from 'react'
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

export function CapiVisioMoodStrip({ mood }: Props) {
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
      className={`border-b px-4 py-1.5 text-xs ${mood.accent.strip}`}
      role="status"
      aria-label={`CapiVisio está ${mood.mood}, pressão ${mood.pressure}`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <CapiVisioAvatar
          expression={expression}
          intensity={intensity}
          size="sm"
          className="shrink-0"
        />
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
