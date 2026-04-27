'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { DayMood } from '@/lib/capiVisioMood'
import { CapiVisioFloatingAvatar } from '@/components/capivisio/CapiVisioFloatingAvatar'

type Props = {
  mood?: DayMood | null
}

export function Navbar({ mood = null }: Props = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    setOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: '/home', label: 'Início' },
    { href: '/ranking', label: 'Ranking' },
    { href: '/faq', label: 'FAQ' },
    { href: '/referencias', label: 'Referências' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/home" className="text-lg font-bold text-primary">CapiRun</Link>

          <div className="hidden items-center gap-4 sm:flex">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium ${pathname === href ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sair
            </button>
          </div>

          <button
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen(prev => !prev)}
            className="-mr-1 rounded-md p-1 text-gray-700 hover:bg-gray-100 sm:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="mx-auto mt-3 max-w-3xl border-t border-gray-200 pt-3 sm:hidden">
            <div className="flex flex-col gap-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-2 py-2 text-sm font-medium ${pathname === href ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="rounded-md px-2 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </nav>
      <CapiVisioFloatingAvatar mood={mood} />
    </>
  )
}
