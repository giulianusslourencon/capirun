import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const ADMINS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export async function canAccessPlacar(
  supabase: SupabaseClient<Database>,
  user: User | null,
): Promise<boolean> {
  if (!user) return false;
  if (user.email && ADMINS.includes(user.email)) return true;
  const { data: player } = await supabase
    .from("players")
    .select("is_test")
    .eq("id", user.id)
    .single();
  return !player?.is_test;
}
