import {
  ACTIONS,
  ACTION_EMOJI,
  MOTIVATIONS,
  MOTIVATION_EMOJI,
  SUSPECTS,
  SUSPECT_EMOJI,
} from "@/lib/murdle";

type Section = {
  title: string;
  icon: string;
  items: readonly { label: string; emoji: string }[];
};

const SECTIONS: Section[] = [
  {
    title: "Suspeitos",
    icon: "🕵️",
    items: SUSPECTS.map((name) => ({ label: name, emoji: SUSPECT_EMOJI[name] })),
  },
  {
    title: "Motivações",
    icon: "🎯",
    items: MOTIVATIONS.map((m) => ({ label: m, emoji: MOTIVATION_EMOJI[m] })),
  },
  {
    title: "O que fez",
    icon: "🎬",
    items: ACTIONS.map((a) => ({ label: a, emoji: ACTION_EMOJI[a] })),
  },
];

export function MurdleDossier() {
  return (
    <section className="rounded-lg border-2 border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-900 px-5 py-6 shadow-sm font-serif flex flex-col gap-6">
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="text-base font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span aria-hidden>{section.icon}</span>
            <span>{section.title}</span>
          </h3>
          <div className="mt-2 mb-4 h-px bg-stone-400 dark:bg-stone-600" />
          <ul className="flex flex-col gap-2">
            {section.items.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 text-stone-800 dark:text-stone-200 leading-relaxed"
              >
                <span className="text-2xl leading-none w-8 text-center shrink-0" aria-hidden>
                  {item.emoji}
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
