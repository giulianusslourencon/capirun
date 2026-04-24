'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { DayMood } from '@/lib/capiVisioMood'
import { CapiVisioFloatingAvatar } from '@/components/capivisio/CapiVisioFloatingAvatar'

type Props = {
  mood?: DayMood | null
}

export function Navbar({ mood = null }: Props = {}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleShowIntro = () => {
    localStorage.removeItem('capirun:intro_seen')
    window.dispatchEvent(new Event('show-intro'))
    if (pathname !== '/home') router.push('/home')
  }

  const links = [
    { href: '/home', label: 'Início' },
    { href: '/ranking', label: 'Ranking' },
    { href: '/faq', label: 'FAQ' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/home" className="text-lg font-bold text-primary">CapiRun</Link>
          <div className="flex items-center gap-4">
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
              onClick={handleShowIntro}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Introdução
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
      <CapiVisioFloatingAvatar mood={mood} />
    </>
  )
}
