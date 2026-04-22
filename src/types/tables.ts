import { Tables } from "./database";

export type Day = Tables<"days">;
export type Puzzle = Tables<"puzzles_public">;
export type PlayerPuzzle = Tables<"player_puzzles">;
export type RankingRow = Tables<"ranking">;
