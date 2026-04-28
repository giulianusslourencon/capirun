import type { CapiVisioExpression } from "@/lib/capiVisioExpressions";

export const REACTION_QUOTES: Partial<Record<CapiVisioExpression, string[]>> = {
  celebrating: [
    "Isso aí!",
    "Boa!",
    "UHUL!",
    "Sabia que era essa!",
    "Eita, acertei!",
    "Dá-lhe!",
  ],
  confused: [
    "Vish…",
    "Hmm… não foi dessa vez.",
    "Tenta de novo.",
    "Eita, errei feio.",
    "Tô passada.",
  ],
  relieved: ["Ufa.", "Ainda bem.", "Ai que susto.", "Quase infartei."],
  frustrated: [
    "Ah, qual é…",
    "Tô quase surtando.",
    "Gente do céu.",
    "Por queeeee.",
  ],
  sleuth: ["Elementar.", "Hmm, interessante…", "Eu sabia.", "Caso encerrado."],
};

export function pickQuote(list: readonly string[], exclude?: string): string {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  const pool = exclude ? list.filter((q) => q !== exclude) : list;
  const source = pool.length > 0 ? pool : list;
  return source[Math.floor(Math.random() * source.length)];
}

export function pickReactionQuote(
  expression: CapiVisioExpression,
  exclude?: string,
): string | null {
  const list = REACTION_QUOTES[expression];
  if (!list || list.length === 0) return null;
  return pickQuote(list, exclude);
}
