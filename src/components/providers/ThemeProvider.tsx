'use client'
import { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'

const WEDNESDAY_PINK_STAMP = 'capirun:wednesday-pink-applied'

function localDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function WednesdayPinkForcer() {
  const { setTheme } = useTheme()
  useEffect(() => {
    const now = new Date()
    if (now.getDay() !== 3) return
    const today = localDateKey(now)
    try {
      if (localStorage.getItem(WEDNESDAY_PINK_STAMP) === today) return
      localStorage.setItem(WEDNESDAY_PINK_STAMP, today)
    } catch {
      return
    }
    setTheme('ultra-pink')
  }, [setTheme])
  return null
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={['light', 'dark', 'ultra-pink', 'system']}
    >
      <WednesdayPinkForcer />
      {children}
    </NextThemesProvider>
  )
}
