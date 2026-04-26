"use client";

import { HelpCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { MurdleAnswerPicker } from "./MurdleAnswerPicker";
import { MurdleBoard } from "./MurdleBoard";
import { MurdleDossier } from "./MurdleDossier";
import {
  type CategoryKey,
  type MurdleGridState,
  loadGridState,
  nextCellValue,
  pairKey,
  saveGridState,
} from "@/lib/murdle";

type Props = {
  puzzleId: string;
  initialAccusation?: string | null;
};

export function MurdlePuzzle({ puzzleId, initialAccusation }: Props) {
  const [state, setState] = useState<MurdleGridState>({});
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    setState(loadGridState(puzzleId));
  }, [puzzleId]);

  const cycle = useCallback(
    (catA: CategoryKey, itemA: string, catB: CategoryKey, itemB: string) => {
      const key = pairKey(catA, itemA, catB, itemB);
      setState((prev) => {
        const next = { ...prev, [key]: nextCellValue(prev[key] ?? null) };
        saveGridState(puzzleId, next);
        return next;
      });
    },
    [puzzleId],
  );

  const getValue = useCallback(
    (catA: CategoryKey, itemA: string, catB: CategoryKey, itemB: string) => {
      return state[pairKey(catA, itemA, catB, itemB)] ?? null;
    },
    [state],
  );

  return (
    <div className="mt-3 flex flex-col gap-5">
      <MurdleDossier />

      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-gray-700">
          Use o grid abaixo para anotar suas deduções. Clique em uma célula para
          alternar entre <strong className="text-emerald-600">✓</strong>,{" "}
          <strong className="text-red-600">✗</strong>,{" "}
          <strong className="text-gray-500">?</strong> e vazio.
        </p>
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          aria-label="Como funciona o Murdle"
          className="shrink-0 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <HelpCircle className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <MurdleBoard getValue={getValue} onCycle={cycle} />

      <MurdleAnswerPicker
        puzzleId={puzzleId}
        initialAccusation={initialAccusation}
      />

      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Como funciona o Murdle"
      >
        <div className="space-y-3 text-sm leading-relaxed text-gray-700">
          <p>
            Descubra quem roubou o Lorenzzo Lopez, qual a motivação e qual outra
            ação cometeu. Cada suspeito tem exatamente uma motivação e uma ação.
          </p>

          <p>
            Cada célula da grade cruza dois itens. Clique para alternar entre{" "}
            <strong className="text-emerald-600">✓</strong> verdadeiro,{" "}
            <strong className="text-red-600">✗</strong> falso,{" "}
            <strong className="text-gray-500">?</strong> em dúvida e vazio.
          </p>

          <p>
            Em cada bloco 3×3 só cabe um{" "}
            <strong className="text-emerald-600">✓</strong> por linha e por
            coluna — quando marcar um, as outras células daquela linha e coluna
            viram <strong className="text-red-600">✗</strong>.
          </p>

          <p>
            Quando tiver certeza, faça a acusação no formulário abaixo. O grid
            fica salvo neste navegador.
          </p>
        </div>
      </Modal>
    </div>
  );
}
