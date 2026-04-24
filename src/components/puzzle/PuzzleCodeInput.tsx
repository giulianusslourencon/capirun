'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitCode } from '@/lib/queries/puzzles'
import { Button } from '@/components/ui/Button'
import { fireCapiVisioExpression } from '@/lib/capiVisioExpressions'

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
        fireCapiVisioExpression('celebrating', 1800)
        router.refresh()
      } else {
        fireCapiVisioExpression('confused', 1200)
        setStatus('error')
      }
    } catch {
      fireCapiVisioExpression('confused', 1200)
      setStatus('error')
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <p className="text-sm text-gray-600">
        A senha são os dígitos no caminho entre <strong>CapiVisio</strong> e <strong>Lorenzzo Lopez</strong> no puzzle.
      </p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value.replace(/[^1-4]/g, '')); setStatus('idle') }}
          placeholder="Dígitos do caminho"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button onClick={handleSubmit} disabled={status === 'loading'}>
          {status === 'loading' ? 'Verificando...' : 'Confirmar'}
        </Button>
      </div>
      <p className="text-xs text-gray-400">Apenas dígitos de 1 a 4, sem espaços.</p>
      {status === 'error' && (
        <p className="text-sm text-red-600">Senha incorreta. Tente novamente.</p>
      )}
    </div>
  )
}
