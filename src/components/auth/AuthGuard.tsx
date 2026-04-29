'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayer } from '@/lib/hooks/usePlayer'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = usePlayer()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>
  if (!user) return null

  return <>{children}</>
}
