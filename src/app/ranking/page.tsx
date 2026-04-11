import { Navbar } from '@/components/layout/Navbar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { RankingTable } from '@/components/ranking/RankingTable'

export default function RankingPage() {
  return (
    <>
      <Navbar />
      <PageWrapper title="Ranking ao vivo">
        <RankingTable />
      </PageWrapper>
    </>
  )
}
