export type MurdleCellValue = "V" | "F" | "?" | null;

export type MurdleGridState = Record<string, MurdleCellValue>;

export const SUSPECTS = ["Enzo", "Penajo", "Isabella"] as const;

export const MOTIVATIONS = [
  "Provar que consegue",
  "Irritação",
  "Provocar alguém",
] as const;

export const ACTIONS = [
  "Roubou o Lorenzzo Lopez",
  "Hackeou equipamentos do WikiLab",
  "Apagou o bloco de vídeo da câmera",
] as const;

export type Suspect = (typeof SUSPECTS)[number];
export type Motivation = (typeof MOTIVATIONS)[number];
export type Action = (typeof ACTIONS)[number];

export const SUSPECT_EMOJI: Record<Suspect, string> = {
  Enzo: "🎉",
  Penajo: "🗺️",
  Isabella: "🧼",
};

export const MOTIVATION_EMOJI: Record<Motivation, string> = {
  "Provar que consegue": "🏆",
  Irritação: "😤",
  "Provocar alguém": "😈",
};

export const ACTION_EMOJI: Record<Action, string> = {
  "Roubou o Lorenzzo Lopez": "👟",
  "Hackeou equipamentos do WikiLab": "❄️",
  "Apagou o bloco de vídeo da câmera": "✂️",
};

export type CategoryKey = "S" | "M" | "A";

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  S: "Suspeito",
  M: "Motivação",
  A: "Ação",
};

export function pairKey(
  catA: CategoryKey,
  itemA: string,
  catB: CategoryKey,
  itemB: string,
): string {
  const a = `${catA}:${itemA}`;
  const b = `${catB}:${itemB}`;
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function nextCellValue(current: MurdleCellValue): MurdleCellValue {
  switch (current) {
    case null:
      return "V";
    case "V":
      return "F";
    case "F":
      return "?";
    case "?":
      return null;
  }
}

const STORAGE_PREFIX = "capirun:murdle:";

export function storageKey(puzzleId: string): string {
  return `${STORAGE_PREFIX}${puzzleId}`;
}

export function loadGridState(puzzleId: string): MurdleGridState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(puzzleId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as MurdleGridState;
    }
    return {};
  } catch {
    return {};
  }
}

export function saveGridState(puzzleId: string, state: MurdleGridState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(puzzleId), JSON.stringify(state));
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function clearGridState(puzzleId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey(puzzleId));
  } catch {
    // ignore
  }
}
