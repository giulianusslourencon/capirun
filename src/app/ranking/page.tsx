import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { RankingTable } from '@/components/ranking/RankingTable'
import { createClient } from '@/lib/supabase/server'
import { getCurrentMood } from '@/lib/capiVisioMood'

export default async function RankingPage() {
  const supabase = await createClient()
  const mood = await getCurrentMood(supabase)
  return (
    <>
      <Navbar mood={mood} />
      <PageWrapper title="Ranking ao vivo">
        <RankingTable />
      </PageWrapper>
    </>
  )
}
