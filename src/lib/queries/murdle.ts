import { createClient } from "@/lib/supabase/client";

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
