import { createClient } from "@/lib/supabase/client";

// Uses the puzzles_public view — no completion_code
export async function getPuzzlesByDay(dayNumber: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("puzzles_public")
    .select(`*`)
    .eq("day_number", dayNumber)
    .order("order_in_day");
  if (error) throw error;
  return data;
}

// Submits the password via RPC — never compares on the client
export async function submitCode(puzzleId: string, code: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("submit_completion_code", {
    p_puzzle_id: puzzleId,
    p_code: code,
  });
  if (error) throw error;
  return data as boolean;
}
