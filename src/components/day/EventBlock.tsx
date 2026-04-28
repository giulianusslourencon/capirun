import ReactMarkdown from "react-markdown";
import type { EventContent } from "@/lib/content";
import type { Puzzle } from "@/types/tables";
import { PuzzleCard } from "@/components/puzzle/PuzzleCard";
import { EvidenceDossier } from "@/components/day/EvidenceDossier";

type Props = {
  event: EventContent;
  puzzle: Puzzle;
  isCompleted: boolean;
  isAccessible: boolean;
  initialAccusation?: string | null;
};

type NarrativeBlock =
  | { type: "dialog"; name: string; content: string; isThought: boolean }
  | { type: "prose"; content: string };

function detectThought(text: string): { isThought: boolean; content: string } {
  const wrappedAsterisk =
    text.startsWith("*") &&
    text.endsWith("*") &&
    !text.startsWith("**") &&
    !text.endsWith("**") &&
    text.length >= 2;
  const wrappedUnderscore =
    text.startsWith("_") &&
    text.endsWith("_") &&
    !text.startsWith("__") &&
    !text.endsWith("__") &&
    text.length >= 2;
  if (wrappedAsterisk || wrappedUnderscore) {
    return { isThought: true, content: text.slice(1, -1).trim() };
  }
  return { isThought: false, content: text };
}

function parseNarrativeBlocks(markdown: string): NarrativeBlock[] {
  return markdown
    .split(/\n\n+/)
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return [];
      const m = trimmed.match(/^>\s*\*\*(.+?):\*\*\s*([\s\S]*)$/);
      if (!m) return [{ type: "prose" as const, content: trimmed }];
      const { isThought, content } = detectThought(m[2].trim());
      return [{ type: "dialog" as const, name: m[1], content, isThought }];
    })
    .flat();
}

const PISTAS_HEADING = /^\*\*🔎\s*Pistas\*\*/;
const DEPOIMENTOS_HEADING = /^\*\*🎤\s*Depoimentos\*\*/;
const DIALOG_BLOCKQUOTE = /^>\s*\*\*(.+?):\*\*\s*([\s\S]*)$/;
const DIVIDER_LINE = /^\\?_\\?_$/;
const CLUE_LABEL = /^_Pista\s+\d+\._\s*/;

type DossierExtraction = {
  clues: string[];
  testimonies: { name: string; quote: string }[];
  narrativeWithoutDossier: string;
};

function extractDossier(markdown: string): DossierExtraction {
  const paragraphs = markdown.split(/\n\n+/);
  const clues: string[] = [];
  const testimonies: { name: string; quote: string }[] = [];
  const narrativeParagraphs: string[] = [];
  let mode: "none" | "clues" | "testimonies" = "none";

  for (const raw of paragraphs) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const linesWithoutDividers = trimmed
      .split("\n")
      .filter((l) => !DIVIDER_LINE.test(l.trim()));
    const firstLine = linesWithoutDividers[0]?.trim() ?? "";

    if (PISTAS_HEADING.test(firstLine)) {
      mode = "clues";
      continue;
    }
    if (DEPOIMENTOS_HEADING.test(firstLine)) {
      mode = "testimonies";
      continue;
    }

    if (mode === "clues") {
      const bullets = trimmed
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("- "))
        .map((l) => l.replace(/^-\s+/, "").replace(CLUE_LABEL, "").trim());
      if (bullets.length > 0) {
        clues.push(...bullets);
        continue;
      }
      mode = "none";
    }

    if (mode === "testimonies") {
      const m = trimmed.match(DIALOG_BLOCKQUOTE);
      if (m) {
        testimonies.push({ name: m[1], quote: m[2].trim() });
        continue;
      }
      mode = "none";
    }

    const cleaned = linesWithoutDividers.join("\n").trim();
    if (cleaned) narrativeParagraphs.push(cleaned);
  }

  return {
    clues,
    testimonies,
    narrativeWithoutDossier: narrativeParagraphs.join("\n\n"),
  };
}

const PERSON_EMOJI: Record<string, string> = {
  CapiVisio: "🦫",
  Leo: "🍫",
  MauMau: "🕵️‍♂️",
  Isabella: "🧼",
  Nicolas: "🐊",
  Penajo: "🗺️",
  Ramos: "🦝",
  Chowder: "🧙",
  Enzo: "🎉",
  Colega: "🦒",
};

function DialogBox({
  name,
  isThought,
  children,
}: {
  name: string;
  isThought: boolean;
  children: React.ReactNode;
}) {
  const emoji = PERSON_EMOJI[name];
  const containerClass = isThought
    ? "rounded-lg border border-dashed border-gray-300 overflow-hidden text-sm"
    : "rounded-lg border border-gray-200 overflow-hidden text-sm shadow-sm";
  const headerClass = isThought
    ? "bg-gray-50/60 border-b border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5"
    : "bg-gray-50 border-b border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide";
  return (
    <div className={containerClass}>
      <div className={headerClass}>
        {emoji && <span>{emoji}</span>}
        <span>{name}</span>
        {isThought && (
          <span
            className="ml-auto text-sm normal-case tracking-normal"
            aria-label="pensa"
            title="pensa"
          >
            💭
          </span>
        )}
      </div>
      <div className="px-3 py-2.5 text-gray-800 leading-relaxed italic prose prose-sm max-w-none">
        {children}
      </div>
    </div>
  );
}

function NarrativeSection({
  markdown,
  proseClassName,
}: {
  markdown: string;
  proseClassName: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {parseNarrativeBlocks(markdown).map((block, i) =>
        block.type === "dialog" ? (
          <DialogBox key={i} name={block.name} isThought={block.isThought}>
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </DialogBox>
        ) : (
          <div key={i} className={proseClassName}>
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        ),
      )}
    </div>
  );
}

export function EventBlock({
  event,
  puzzle,
  isCompleted,
  isAccessible,
  initialAccusation,
}: Props) {
  const { clues, testimonies, narrativeWithoutDossier } = extractDossier(
    event.text_before ?? "",
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
        {event.location && (
          <p className="mt-0.5 text-sm text-gray-500 flex items-center gap-1">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {event.location}
          </p>
        )}
      </div>

      {narrativeWithoutDossier && (
        <NarrativeSection
          markdown={narrativeWithoutDossier}
          proseClassName="text-sm text-gray-600 leading-relaxed italic prose prose-sm max-w-none"
        />
      )}

      <EvidenceDossier clues={clues} testimonies={testimonies} />

      <PuzzleCard
        puzzle={puzzle}
        isCompleted={isCompleted}
        isAccessible={isAccessible}
        initialAccusation={initialAccusation}
      />

      {isCompleted && event.text_after && (
        <div className="rounded-lg bg-green-50 p-3">
          <NarrativeSection
            markdown={event.text_after}
            proseClassName="text-sm text-green-800 leading-relaxed prose prose-sm max-w-none"
          />
        </div>
      )}
    </section>
  );
}
