'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitCode } from '@/lib/queries/puzzles'
import { Button } from '@/components/ui/Button'

export function PuzzleCodeInput({ puzzleId }: { puzzleId: string }) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!code.trim()) return
    setStatus('loading')
    try {
      const correct = await submitCode(puzzleId, code)
      if (correct) {
        router.refresh()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value); setStatus('idle') }}
          placeholder="Senha de conclusão"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button onClick={handleSubmit} disabled={status === 'loading'}>
          {status === 'loading' ? 'Verificando...' : 'Confirmar'}
        </Button>
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-600">Senha incorreta. Tente novamente.</p>
      )}
    </div>
  )
}
