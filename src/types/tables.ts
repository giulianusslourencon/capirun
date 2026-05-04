import { Tables } from "./database";

export type Day = Tables<"days">;
export type Puzzle = Tables<"puzzles_public">;
export type Player = Tables<"players">;
export type PlayerPuzzle = Tables<"player_puzzles">;
export type PlacarRow = Tables<"ranking">;
