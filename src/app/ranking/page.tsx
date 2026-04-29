import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { RankingTable } from '@/components/ranking/RankingTable'
import { createClient } from '@/lib/supabase/server'
import { getCurrentMood } from '@/lib/capiVisioMood'

const ADMINS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)

export default async function RankingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: player } = await supabase
    .from('players')
    .select('is_test')
    .eq('id', user!.id)
    .single()

  if (player?.is_test && !ADMINS.includes(user!.email!)) redirect('/home')

  const mood = await getCurrentMood(supabase, user?.id)
  return (
    <>
      <Navbar mood={mood} />
      <PageWrapper title="Ranking ao vivo">
        <RankingTable />
      </PageWrapper>
    </>
  )
}
