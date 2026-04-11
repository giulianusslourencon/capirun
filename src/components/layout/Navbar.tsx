'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: '/home', label: 'Início' },
    { href: '/ranking', label: 'Ranking' },
  ]

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/home" className="text-lg font-bold text-indigo-600">CapiRun</Link>
        <div className="flex items-center gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium ${pathname === href ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
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
      </div>
    </nav>
  )
}
