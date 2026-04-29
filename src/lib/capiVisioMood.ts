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
  dayQuotes: string[];
  moodQuotes: string[];
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
    mood: "Animada, acabou de chegar",
    dayQuotes: [
      "8h de busão mas a capivara CHEGOU.",
      "Cheguei, tô aqui, vamos que vamos!",
      "Semana nova, capivara nova. Tô com fé.",
      "Dormi torta no ônibus mas tô de bom humor, não estraga.",
      "Ai gente, que saudade de vocês!",
      "Essa semana vai ser a nossa, eu sinto.",
      "Café da manhã foi incrível, tô pronta pra qualquer coisa.",
      "Reunião de KPI hoje — bora mostrar o que a capivara fez!",
    ],
    moodQuotes: [
      "Tem café na implantação?",
      "Gente, cheguei! Começou!",
      "Tô animada, não tira isso de mim.",
      "Vamos brilhar essa semana.",
      "É a capivara não tem jeito — apareceu.",
    ],
    pressure: "leve",
    pressureLabel: "Pressão pra sexta: leve",
    accent: {
      banner: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200",
      strip: "bg-sky-100 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 border-sky-200 dark:border-sky-800",
      chip: "bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800",
      badge: "bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100",
    },
    defaultExpression: "curious",
    intensity: PRESSURE_INTENSITY.leve,
  },
  2: {
    day: 2,
    weekday: "Terça",
    mood: "Animada virando frustrada",
    dayQuotes: [
      "É a super terça!",
      "Ansiosa pela game night.",
      "Cadê a galera pra game night?",
    ],
    moodQuotes: [
      "Cadê aquela motivação de ontem?",
      "Já deveria estar mais adiantada, né?",
      "Será que eu dou conta disso tudo?",
      "Tô tentando, juro que tô tentando.",
      "Aquele frio na barriga já começou.",
      "Olha o tanto de coisa, gente.",
      "Tô organizando a cabeça aqui, calma.",
      "Já vi que vai dar trabalho.",
    ],
    pressure: "moderada",
    pressureLabel: "Pressão pra sexta: moderada",
    accent: {
      banner: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200",
      strip: "bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800",
      chip: "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      badge: "bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100",
    },
    defaultExpression: "focused",
    intensity: PRESSURE_INTENSITY.moderada,
  },
  3: {
    day: 3,
    weekday: "Quarta",
    mood: "Estressada, perdida",
    dayQuotes: [
      "Quarta já?! Cadê meu chão.",
      "Leg day hoje, não sei se aguento pro futebol de sabão.",
      "Quartou.",
      "É 4ª feira ou 14ª?",
      "Metade da semana — e da minha sanidade.",
    ],
    moodQuotes: [
      "CADÊ O CAFÉ.",
      "Respira. Respira. Respira.",
      "Será que dá tempo? Não responde.",
      "Ai gente do céu…",
      "Tô passada com a quantidade de coisa.",
      "Alguém me traz um Bonobon de beijinho pelamor.",
      "Surtando em silêncio aqui.",
      "Tô funcionando no automático, não pergunta.",
      "Pelamor de Deus, alguém.",
      "Já não sei mais o que tô fazendo.",
      "A capivara hoje só responde no grito.",
    ],
    pressure: "forte",
    pressureLabel: "Pressão pra sexta: forte",
    accent: {
      banner: "bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-200",
      strip: "bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-800",
      chip: "bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800",
      badge: "bg-orange-300 dark:bg-orange-800 text-orange-950 dark:text-orange-100",
    },
    defaultExpression: "stressed",
    intensity: PRESSURE_INTENSITY.forte,
  },
  4: {
    day: 4,
    weekday: "Quinta",
    mood: "Foco com pânico",
    dayQuotes: [
      "A dinâmica começa AMANHÃ AAAAAAA.",
      "Hoje eu me acabo no bar.",
      "Ninguém segura a capivara na sinuca.",
      "Vamos cantar o que no karaokê?",
      "Quinta é sexta da galera valente.",
      "Amanhã o circo pega fogo.",
      "Hoje tem happy hour ou não tem?",
      "É hoje que a sinuca decide quem é quem.",
    ],
    moodQuotes: [
      "Guys, come to help.",
      "This is fine...",
      "Tô no meu último neurônio.",
      "Capivara não foi feita pra deadline.",
      "Tá tudo bem. Não tá. Mas tá.",
      "Se eu chorar agora alguém me julga?",
      "Capivara no auge da crise existencial.",
      "É agora ou nunca — tô votando no nunca.",
    ],
    pressure: "urgente",
    pressureLabel: "Pressão pra sexta: urgente",
    accent: {
      banner: "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200",
      strip: "bg-rose-100 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800",
      chip: "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800",
      badge: "bg-rose-300 dark:bg-rose-800 text-rose-950 dark:text-rose-100",
    },
    defaultExpression: "determined",
    intensity: PRESSURE_INTENSITY.urgente,
  },
  5: {
    day: 5,
    weekday: "Sexta",
    mood: "Aliviada, correndo",
    dayQuotes: [
      "SEXTA-FEIRA PAPAI!",
      "O All Hands tá chegandoooooo.",
      "E o pix? Nada ainda.",
      "SEXTOU.",
      "Sexta-feira eu não sou de ninguém.",
      "É hoje que a capivara brilha. Ou colapsa, vai saber.",
    ],
    moodQuotes: [
      "Já pode almoçar?",
      "Tô tremendo de ansiedade ou de cafeína? Sim.",
      "Aerofólio para meu Palio.",
      "TÔ NUM SURTO.",
      "É muita coisa, eu não sou de ferro.",
      "AAAAAAAAA (tradução: socorro).",
      "Capivara surtada em horário comercial.",
    ],
    pressure: "critica",
    pressureLabel: "Pressão pra sexta: crítica",
    accent: {
      banner: "bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-700 text-red-900 dark:text-red-200 animate-pulse",
      strip: "bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-200 border-red-400 dark:border-red-700",
      chip: "bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-400 dark:border-red-700",
      badge: "bg-red-500 dark:bg-red-700 text-white",
    },
    defaultExpression: "stressed",
    intensity: PRESSURE_INTENSITY.critica,
  },
};

export const DAY_5_POST_SUBMISSION: DayMood = {
  day: 5,
  weekday: "Sexta",
  mood: "Detetive satisfeita",
  dayQuotes: [
    "É a capivara não tem jeito.",
    "Caso encerrado (por ora).",
    "Foi osso mas a capivara venceu.",
    "Anota aí: missão cumprida.",
  ],
  moodQuotes: [
    "Elementar, meu caro.",
    "TUM TUM.",
    "Mistério resolvido. Ou quase.",
    "Olha eu detetive, gente.",
    "Hora do bar, mereci.",
    "A capivara saiu vitoriosa.",
    "Caso encerrado, agora me deixa em paz.",
  ],
  pressure: "leve",
  pressureLabel: "Caso entregue",
  accent: {
    banner: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200",
    strip: "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800",
    chip: "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
    badge: "bg-indigo-300 dark:bg-indigo-800 text-indigo-950 dark:text-indigo-100",
  },
  defaultExpression: "sleuth",
  intensity: PRESSURE_INTENSITY.moderada,
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
      !!day5Ids &&
      day5Ids.length > 0 &&
      day5Ids.every((id) => completedIds.has(id));
  }

  const usePostSubmission = effectiveDay === 5 && day5Submitted;
  const intensity = usePostSubmission
    ? DAY_5_POST_SUBMISSION
    : (DAY_MOODS[effectiveDay] ?? calendar);

  return {
    day: calendar.day,
    weekday: calendar.weekday,
    dayQuotes: usePostSubmission
      ? DAY_5_POST_SUBMISSION.dayQuotes
      : calendar.dayQuotes,
    moodQuotes: usePostSubmission
      ? DAY_5_POST_SUBMISSION.moodQuotes
      : intensity.moodQuotes,
    mood: intensity.mood,
    pressure: intensity.pressure,
    pressureLabel: intensity.pressureLabel,
    accent: intensity.accent,
    defaultExpression: intensity.defaultExpression,
    intensity: intensity.intensity,
  };
}
