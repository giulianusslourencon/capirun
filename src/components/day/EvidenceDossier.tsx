import ReactMarkdown from "react-markdown";

type Testimony = {
  name: string;
  quote: string;
};

type Props = {
  clues: string[];
  testimonies: Testimony[];
};

export function EvidenceDossier({ clues, testimonies }: Props) {
  if (clues.length === 0 && testimonies.length === 0) return null;

  return (
    <section className="rounded-lg border-2 border-stone-800 dark:border-stone-300 bg-stone-50 dark:bg-stone-900 px-5 py-6 shadow-sm font-serif flex flex-col gap-6">
      {clues.length > 0 && (
        <div>
          <h3 className="text-base font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span aria-hidden>🔎</span>
            <span>Pistas</span>
          </h3>
          <div className="mt-2 mb-4 h-px bg-stone-400 dark:bg-stone-600" />
          <ol className="flex flex-col gap-3">
            {clues.map((clue, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-stone-800 dark:text-stone-200 leading-relaxed"
              >
                <span className="font-mono text-stone-500 dark:text-stone-400 w-5 shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <span className="text-stone-500 dark:text-stone-400 shrink-0" aria-hidden>
                  ──
                </span>
                <div className="prose prose-sm max-w-none text-stone-800 dark:text-stone-200 prose-p:my-0 dark:prose-invert">
                  <ReactMarkdown>{clue}</ReactMarkdown>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {testimonies.length > 0 && (
        <div>
          <h3 className="text-base font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span aria-hidden>🎤</span>
            <span>Depoimentos</span>
          </h3>
          <div className="mt-2 mb-4 h-px bg-stone-400 dark:bg-stone-600" />
          <div className="flex flex-col gap-5">
            {testimonies.map((t, i) => (
              <figure key={i} className="flex gap-3">
                <span
                  className="text-4xl leading-none text-stone-400 dark:text-stone-500 font-serif shrink-0 select-none"
                  aria-hidden
                >
                  “
                </span>
                <div className="flex-1 min-w-0">
                  <div className="italic text-stone-800 dark:text-stone-200 leading-relaxed prose prose-sm max-w-none prose-p:my-0 dark:prose-invert">
                    <ReactMarkdown>{t.quote}</ReactMarkdown>
                  </div>
                  <figcaption className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-600 dark:text-stone-400 text-right">
                    — {t.name}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
