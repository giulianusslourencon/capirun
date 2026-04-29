'use client'
import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'

const labels: Record<string, string> = {
  light: 'claro',
  dark: 'escuro',
  system: 'sistema',
}

const subscribe = () => () => {}
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false)

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return <div className={`h-7 w-7 ${className}`} aria-hidden />
  }

  const current = theme ?? 'system'
  const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
  const Icon = current === 'dark' ? Moon : current === 'system' ? Monitor : Sun

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Tema atual: ${labels[current]}. Trocar para ${labels[next]}.`}
      title={`Tema: ${labels[current]}`}
      className={`rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  )
}
