import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AdminDayToggle } from './AdminDayToggle'
import type { Day } from '@/types/tables'

const ADMINS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMINS.includes(user.email!)) redirect('/home')

  const { data: days } = await supabase.from('days').select('*').order('day_number')

  return (
    <>
      <Navbar />
      <PageWrapper title="Painel Admin">
        <div className="flex flex-col gap-4">
          {(days as Day[] ?? []).map((day) => (
            <AdminDayToggle key={day.day_number} day={day} />
          ))}
        </div>
      </PageWrapper>
    </>
  )
}
