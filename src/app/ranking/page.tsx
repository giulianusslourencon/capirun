import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { RankingTable } from "@/components/ranking/RankingTable";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMood } from "@/lib/capiVisioMood";
import { canAccessRanking } from "@/lib/auth/canAccessRanking";

export default async function RankingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowed = await canAccessRanking(supabase, user);
  if (!allowed) redirect("/home");

  const mood = await getCurrentMood(supabase, user?.id);
  return (
    <>
      <Navbar mood={mood} canAccessRanking />
      <PageWrapper title="Ranking ao vivo">
        <div className="mb-6 rounded-lg border border-border bg-muted px-5 py-4 text-sm leading-relaxed text-foreground">
          Esse ranking é só informativo — serve pra fomentar a competição
          saudável e a coletividade.{" "}
          <strong className="font-semibold text-foreground">
            Ele não é usado no sorteio do All Hands de sexta.
          </strong>{" "}
          Todo mundo que completar todos os puzzles até lá entra no sorteio com
          a mesma chance de levar o prêmio pra casa.
        </div>
        <RankingTable currentPlayerId={user!.id} />
      </PageWrapper>
    </>
  );
}
