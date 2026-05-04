import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PlacarTable } from "@/components/placar/PlacarTable";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMood } from "@/lib/capiVisioMood";
import { canAccessPlacar } from "@/lib/auth/canAccessPlacar";

export default async function PlacarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowed = await canAccessPlacar(supabase, user);
  if (!allowed) redirect("/home");

  const [mood, { count: totalPuzzles }] = await Promise.all([
    getCurrentMood(supabase, user?.id),
    supabase.from("puzzles_public").select("*", { count: "exact", head: true }),
  ]);

  return (
    <>
      <Navbar mood={mood} canAccessPlacar />
      <PageWrapper title="Placar">
        <div className="mb-6 rounded-lg border border-border bg-muted px-5 py-4 text-sm leading-relaxed text-foreground">
          Aqui você acompanha como a galera tá indo nos puzzles.{" "}
          <strong className="font-semibold text-foreground">
            Não vale como classificação pro sorteio do All Hands de sexta
          </strong>{" "}
          — todo mundo que completar todos os puzzles entra com a mesma chance.
        </div>
        <PlacarTable currentPlayerId={user!.id} totalPuzzles={totalPuzzles ?? 0} />
      </PageWrapper>
    </>
  );
}
