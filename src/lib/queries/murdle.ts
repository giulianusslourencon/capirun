import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

// Day 5 All Hands accusation. The RPC `submit_murdle_accusation` always returns
// success — the app does not validate the answer. The correct culprit is
// revealed in person at the real All Hands. The RPC is responsible for marking
// `player_puzzles.completed = true` and persisting the accusation for later
// analysis.
export async function submitMurdleAccusation(
  puzzleId: string,
  accusation: string,
) {
  const supabase = createClient();
  const { error } = await supabase.rpc("submit_murdle_accusation", {
    p_puzzle_id: puzzleId,
    p_accusation: accusation,
  });
  if (error) throw error;
}

// Returns the latest accusation the player has submitted for a Murdle puzzle.
// `player_accusations` has no UNIQUE on (player_id, puzzle_id): each submission
// inserts a new row, so "current answer" = row with the greatest `submitted_at`.
// Any All-Hands analytics must de-duplicate the same way.
export async function getMyLastMurdleAccusation(
  supabase: SupabaseClient<Database>,
  playerId: string,
  puzzleId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("player_accusations")
    .select("accusation")
    .eq("player_id", playerId)
    .eq("puzzle_id", puzzleId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data.accusation;
}
