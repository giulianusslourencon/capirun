import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AdminDayToggle } from './AdminDayToggle'
import { AdminPlayerTestToggle } from './AdminPlayerTestToggle'
import type { Day, Player } from '@/types/tables'

const ADMINS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMINS.includes(user.email!)) redirect('/home')

  const [{ data: days }, { data: players }] = await Promise.all([
    supabase.from('days').select('*').order('day_number'),
    supabase.from('players').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <>
      <Navbar canAccessRanking />
      <PageWrapper title="Painel Admin">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Dias</h2>
          {(days as Day[] ?? []).map((day) => (
            <AdminDayToggle key={day.day_number} day={day} />
          ))}
        </section>

        <section className="mt-8 flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Players ({(players as Player[] ?? []).length})
          </h2>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-amber-700 dark:text-amber-400">teste</span> = oculto do ranking ·{' '}
            <span className="font-medium text-emerald-700 dark:text-emerald-400">desafio</span> = aparece no ranking
          </p>
          {(players as Player[] ?? []).map((player) => (
            <AdminPlayerTestToggle key={player.id} player={player} />
          ))}
        </section>
      </PageWrapper>
    </>
  )
}
