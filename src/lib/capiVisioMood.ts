import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  PRESSURE_INTENSITY,
  type CapiVisioExpression,
} from "@/lib/capiVisioExpressions";

export type FridayPressure =
  | "leve"
  | "moderada"
  | "forte"
  | "urgente"
  | "critica";

export type MoodAccent = {
  banner: string;
  strip: string;
  chip: string;
  badge: string;
};

export type DayMood = {
  day: number;
  weekday: string;
  mood: string;
  quotes: string[];
  pressure: FridayPressure;
  pressureLabel: string;
  accent: MoodAccent;
  defaultExpression: CapiVisioExpression;
  intensity: number;
};

export const DAY_MOODS: Record<number, DayMood> = {
  1: {
    day: 1,
    weekday: "Segunda",
    mood: "Tranquila, curiosa",
    quotes: [
      "A semana está só começando…",
      "Tem café na implantação?",
      "Bora com calma, dá tempo.",
      "Quinta parece tão longe daqui.",
      "Vou dar uma olhada nos eventos de hoje.",
    ],
    pressure: "leve",
    pressureLabel: "Pressão pra sexta: leve",
    accent: {
      banner: "bg-sky-50 border-sky-200 text-sky-900",
      strip: "bg-sky-100 text-sky-900 border-sky-200",
      chip: "bg-sky-100 text-sky-800 border-sky-200",
      badge: "bg-sky-200 text-sky-900",
    },
    defaultExpression: "curious",
    intensity: PRESSURE_INTENSITY.leve,
  },
  2: {
    day: 2,
    weekday: "Terça",
    mood: "Animada, depois frustrada",
    quotes: [
      "Metade da semana ainda pela frente.",
      "Já deveria estar mais adiantada, né?",
      "Vou organizar as prioridades.",
      "Foco no que importa.",
      "Cadê aquela motivação de ontem?",
    ],
    pressure: "moderada",
    pressureLabel: "Pressão pra sexta: moderada",
    accent: {
      banner: "bg-amber-50 border-amber-200 text-amber-900",
      strip: "bg-amber-100 text-amber-900 border-amber-200",
      chip: "bg-amber-100 text-amber-800 border-amber-200",
      badge: "bg-amber-200 text-amber-900",
    },
    defaultExpression: "focused",
    intensity: PRESSURE_INTENSITY.moderada,
  },
  3: {
    day: 3,
    weekday: "Quarta",
    mood: "Estressada, perdida",
    quotes: [
      "Quarta-feira já — e nada concreto.",
      "Respira. Respira.",
      "Cadê o café?",
      "Tenho muita coisa pra entregar.",
      "Será que dá tempo?",
    ],
    pressure: "forte",
    pressureLabel: "Pressão pra sexta: forte",
    accent: {
      banner: "bg-orange-50 border-orange-300 text-orange-900",
      strip: "bg-orange-100 text-orange-900 border-orange-300",
      chip: "bg-orange-100 text-orange-800 border-orange-300",
      badge: "bg-orange-300 text-orange-950",
    },
    defaultExpression: "stressed",
    intensity: PRESSURE_INTENSITY.forte,
  },
  4: {
    day: 4,
    weekday: "Quinta",
    mood: "Focada, determinada",
    quotes: [
      "A dinâmica começa amanhã AAAAAAA.",
      "Modo foco ativado!",
      "Sem tempo pra distração.",
      "Vou virar a noite se precisar.",
      "Quase lá.",
    ],
    pressure: "urgente",
    pressureLabel: "Pressão pra sexta: urgente",
    accent: {
      banner: "bg-rose-50 border-rose-300 text-rose-900",
      strip: "bg-rose-100 text-rose-900 border-rose-300",
      chip: "bg-rose-100 text-rose-800 border-rose-300",
      badge: "bg-rose-300 text-rose-950",
    },
    defaultExpression: "determined",
    intensity: PRESSURE_INTENSITY.urgente,
  },
  5: {
    day: 5,
    weekday: "Sexta",
    mood: "Aliviada, correndo",
    quotes: [
      "Já pode almoçar?",
      "SEXTAAA!",
      "Agora vai.",
      "Só falta um empurrãozinho.",
      "Aguenta firme, capivara.",
    ],
    pressure: "critica",
    pressureLabel: "Pressão pra sexta: crítica",
    accent: {
      banner: "bg-red-50 border-red-400 text-red-900 animate-pulse",
      strip: "bg-red-100 text-red-900 border-red-400",
      chip: "bg-red-100 text-red-900 border-red-400",
      badge: "bg-red-500 text-white",
    },
    defaultExpression: "stressed",
    intensity: PRESSURE_INTENSITY.critica,
  },
};

export const DAY_5_POST_SUBMISSION: DayMood = {
  day: 5,
  weekday: "Sexta",
  mood: "Detetive satisfeita",
  quotes: [
    "Caso encerrado (por ora).",
    "A resposta sai no All Hands.",
    "Tenho meus palpites.",
    "Guarda essa suspeita.",
    "Elementar, meu caro.",
  ],
  pressure: "leve",
  pressureLabel: "Caso entregue",
  accent: {
    banner: "bg-indigo-50 border-indigo-300 text-indigo-900",
    strip: "bg-indigo-100 text-indigo-900 border-indigo-300",
    chip: "bg-indigo-100 text-indigo-800 border-indigo-300",
    badge: "bg-indigo-300 text-indigo-950",
  },
  defaultExpression: "sleuth",
  intensity: 0.3,
};

export function moodForDay(day: number | null | undefined): DayMood | null {
  if (day == null) return null;
  return DAY_MOODS[day] ?? null;
}

export function computeLastFinishedDay(
  puzzlesByDay: Record<number, string[]>,
  completedIds: Set<string>,
): number {
  let maxFinished = 0;
  for (const [dayStr, ids] of Object.entries(puzzlesByDay)) {
    if (ids.length === 0) continue;
    if (!ids.every((id) => completedIds.has(id))) continue;
    const day = Number(dayStr);
    if (day > maxFinished) maxFinished = day;
  }
  return maxFinished;
}

export async function getCurrentMood(
  supabase: SupabaseClient<Database>,
  playerId: string | null | undefined,
): Promise<DayMood | null> {
  const { data: openData, error: openErr } = await supabase
    .from("days")
    .select("day_number")
    .eq("is_unlocked", true)
    .order("day_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (openErr || !openData) return null;
  const currentOpenDay = openData.day_number;
  const calendar = DAY_MOODS[currentOpenDay];
  if (!calendar) return null;

  let effectiveDay = currentOpenDay;
  let day5Submitted = false;

  if (playerId) {
    const [{ data: puzzles }, { data: progress }] = await Promise.all([
      supabase.from("puzzles_public").select("id, day_number"),
      supabase
        .from("player_puzzles")
        .select("puzzle_id, completed")
        .eq("player_id", playerId),
    ]);

    const puzzlesByDay = (puzzles ?? []).reduce<Record<number, string[]>>(
      (acc, p) => {
        if (p.day_number == null || p.id == null) return acc;
        if (!acc[p.day_number]) acc[p.day_number] = [];
        acc[p.day_number].push(p.id);
        return acc;
      },
      {},
    );

    const completedIds = new Set(
      (progress ?? []).filter((p) => p.completed).map((p) => p.puzzle_id),
    );

    const lastFinishedDay = computeLastFinishedDay(puzzlesByDay, completedIds);
    const expectedFinished = currentOpenDay - 1;
    const lag = Math.max(expectedFinished - lastFinishedDay, 0);
    effectiveDay = Math.min(currentOpenDay + lag, 5);

    const day5Ids = puzzlesByDay[5];
    day5Submitted =
      !!day5Ids && day5Ids.length > 0 && day5Ids.every((id) => completedIds.has(id));
  }

  const usePostSubmission = effectiveDay === 5 && day5Submitted;
  const intensity = usePostSubmission
    ? DAY_5_POST_SUBMISSION
    : DAY_MOODS[effectiveDay] ?? calendar;

  return {
    day: calendar.day,
    weekday: calendar.weekday,
    quotes: usePostSubmission ? DAY_5_POST_SUBMISSION.quotes : calendar.quotes,
    mood: intensity.mood,
    pressure: intensity.pressure,
    pressureLabel: intensity.pressureLabel,
    accent: intensity.accent,
    defaultExpression: intensity.defaultExpression,
    intensity: intensity.intensity,
  };
}
