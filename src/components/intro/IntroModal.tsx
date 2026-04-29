'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const STORAGE_KEY = 'capirun:intro_seen'

export function IntroModal() {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setOpen(false)
  }

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true)
    }

    const handler = () => setOpen(true)
    window.addEventListener('show-intro', handler)
    return () => window.removeEventListener('show-intro', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) handleClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-card text-card-foreground p-8 shadow-2xl">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
          CapiRun
        </p>
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          O Mistério Começa…
        </h2>

        <div className="rounded-lg border border-border bg-muted px-5 py-4 text-sm leading-relaxed text-foreground italic">
          O MauMau pediu para entregarem direto de Bertioga o lendário{' '}
          <span className="font-semibold not-italic text-foreground">
            Lorenzzo Lopez
          </span>{' '}
          — um tênis relíquia com história — para ser o prêmio do sorteio do
          All Hands de sexta-feira. Ele foi recebido por Leo na manhã de
          segunda-feira da semana presencial, mas algo de estranho aconteceu…
        </div>

        <Button className="mt-6 w-full" onClick={handleClose}>
          Começar
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Antes de começar,{' '}
          <Link href="/faq" onClick={handleClose} className="underline hover:text-foreground">
            confira as regras do jogo
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
