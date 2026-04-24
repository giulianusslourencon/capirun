'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { DayMood } from '@/lib/capiVisioMood'
import {
  CAPIVISIO_EXPRESS_EVENT,
  type CapiVisioExpressDetail,
  type CapiVisioExpression,
} from '@/lib/capiVisioExpressions'
import { pickQuote, pickReactionQuote } from '@/lib/capiVisioQuotes'
import { CapiVisioAvatar } from './CapiVisioAvatar'

type Props = {
  mood: DayMood | null
}

const PEEK_MIN_MS = 25_000
const PEEK_MAX_MS = 40_000
const PEEK_DISPLAY_MS = 4_500
const OVERRIDE_BUBBLE_PAD_MS = 500
const HOVER_CLOSE_DELAY_MS = 250

export function CapiVisioFloatingAvatar({ mood }: Props) {
  const reduce = useReducedMotion()
  const [override, setOverride] = useState<CapiVisioExpression | null>(null)
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const [stickyOpen, setStickyOpen] = useState(false)
  const [displayQuote, setDisplayQuote] = useState<string | null>(null)
  const [lastMoodDay, setLastMoodDay] = useState<number | null>(null)

  if (mood && mood.day !== lastMoodDay) {
    setLastMoodDay(mood.day)
    setDisplayQuote(null)
  }

  const quote = displayQuote ?? mood?.quotes[0] ?? ''

  const overrideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const stickyRef = useRef(stickyOpen)
  const moodRef = useRef(mood)
  const quoteRef = useRef(quote)
  const overrideRef = useRef(override)

  useEffect(() => {
    stickyRef.current = stickyOpen
  }, [stickyOpen])

  useEffect(() => {
    moodRef.current = mood
  }, [mood])

  useEffect(() => {
    quoteRef.current = quote
  }, [quote])

  useEffect(() => {
    overrideRef.current = override
  }, [override])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CapiVisioExpressDetail>).detail
      if (!detail) return
      setOverride(detail.expression)

      const reaction = pickReactionQuote(detail.expression)
      if (reaction) setDisplayQuote(reaction)
      setBubbleOpen(true)

      if (overrideTimeoutRef.current) clearTimeout(overrideTimeoutRef.current)
      if (bubbleCloseTimeoutRef.current) clearTimeout(bubbleCloseTimeoutRef.current)

      const dur = detail.duration ?? 1500
      overrideTimeoutRef.current = setTimeout(() => {
        setOverride(null)
        overrideTimeoutRef.current = null
      }, dur)

      bubbleCloseTimeoutRef.current = setTimeout(() => {
        bubbleCloseTimeoutRef.current = null
        if (stickyRef.current) return
        setBubbleOpen(false)
        const currentMood = moodRef.current
        if (currentMood) {
          setDisplayQuote(pickQuote(currentMood.quotes, quoteRef.current))
        }
      }, dur + OVERRIDE_BUBBLE_PAD_MS)
    }
    window.addEventListener(CAPIVISIO_EXPRESS_EVENT, handler)
    return () => {
      window.removeEventListener(CAPIVISIO_EXPRESS_EVENT, handler)
      if (overrideTimeoutRef.current) clearTimeout(overrideTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!mood || reduce) return

    let timer: ReturnType<typeof setTimeout> | null = null
    let cancelled = false

    const schedule = () => {
      if (cancelled) return
      const delay = PEEK_MIN_MS + Math.random() * (PEEK_MAX_MS - PEEK_MIN_MS)
      timer = setTimeout(tick, delay)
    }

    const tick = () => {
      timer = null
      if (cancelled) return
      if (document.visibilityState !== 'visible') {
        schedule()
        return
      }
      if (stickyRef.current || overrideRef.current) {
        schedule()
        return
      }
      const currentMood = moodRef.current
      if (!currentMood) {
        schedule()
        return
      }
      setDisplayQuote(pickQuote(currentMood.quotes, quoteRef.current))
      setBubbleOpen(true)
      if (bubbleCloseTimeoutRef.current) clearTimeout(bubbleCloseTimeoutRef.current)
      bubbleCloseTimeoutRef.current = setTimeout(() => {
        bubbleCloseTimeoutRef.current = null
        if (!stickyRef.current) setBubbleOpen(false)
      }, PEEK_DISPLAY_MS)
      schedule()
    }

    schedule()
    const onVis = () => {
      if (document.visibilityState === 'visible' && timer == null && !cancelled) schedule()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [mood, reduce])

  useEffect(() => {
    if (!bubbleOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBubbleOpen(false)
        setStickyOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bubbleOpen])

  useEffect(() => {
    if (!stickyOpen) return
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) {
        setBubbleOpen(false)
        setStickyOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [stickyOpen])

  useEffect(() => {
    return () => {
      if (bubbleCloseTimeoutRef.current) clearTimeout(bubbleCloseTimeoutRef.current)
    }
  }, [])

  if (!mood) return null

  const expression = override ?? mood.defaultExpression
  const intensity = override ? 1 : mood.intensity

  const handleClick = () => {
    if (stickyOpen) {
      setBubbleOpen(false)
      setStickyOpen(false)
      return
    }
    if (bubbleCloseTimeoutRef.current) {
      clearTimeout(bubbleCloseTimeoutRef.current)
      bubbleCloseTimeoutRef.current = null
    }
    setStickyOpen(true)
    setBubbleOpen(true)
  }

  const handleMouseEnter = () => {
    if (stickyOpen) return
    if (bubbleCloseTimeoutRef.current) {
      clearTimeout(bubbleCloseTimeoutRef.current)
      bubbleCloseTimeoutRef.current = null
    }
    setBubbleOpen(true)
  }

  const handleMouseLeave = () => {
    if (stickyOpen) return
    if (bubbleCloseTimeoutRef.current) clearTimeout(bubbleCloseTimeoutRef.current)
    bubbleCloseTimeoutRef.current = setTimeout(() => {
      bubbleCloseTimeoutRef.current = null
      if (!stickyRef.current) setBubbleOpen(false)
    }, HOVER_CLOSE_DELAY_MS)
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed right-4 z-50 sm:right-6"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div
        className="pointer-events-auto flex flex-col items-end gap-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence>
          {bubbleOpen && (
            <motion.div
              key="bubble"
              id="capivisio-bubble"
              role="status"
              aria-live="polite"
              className={`max-w-[18rem] rounded-2xl border px-4 py-3 shadow-lg ${mood.accent.banner}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs font-semibold">CapiVisio — {mood.mood}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={quote}
                  className="mt-0.5 text-sm italic opacity-90"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  &ldquo;{quote}&rdquo;
                </motion.p>
              </AnimatePresence>
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${mood.accent.badge}`}
              >
                {mood.pressureLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleClick}
          aria-expanded={bubbleOpen}
          aria-controls="capivisio-bubble"
          aria-label={`CapiVisio — ${mood.mood}`}
          className={`rounded-full border-2 p-1.5 shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${mood.accent.chip}`}
        >
          <CapiVisioAvatar
            expression={expression}
            intensity={intensity}
            size="lg"
            className="!h-16 !w-16 sm:!h-24 sm:!w-24"
          />
        </button>
      </div>
    </div>
  )
}
