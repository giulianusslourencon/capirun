"use client";

import { useCallback, useEffect, useState } from "react";
import { MurdleAnswerPicker } from "./MurdleAnswerPicker";
import { MurdleBoard } from "./MurdleBoard";
import { MurdleDossier } from "./MurdleDossier";
import {
  type CategoryKey,
  type MurdleGridState,
  clearGridState,
  loadGridState,
  nextCellValue,
  pairKey,
  saveGridState,
} from "@/lib/murdle";

type Props = {
  puzzleId: string;
};

export function MurdlePuzzle({ puzzleId }: Props) {
  const [state, setState] = useState<MurdleGridState>({});

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

  const handleSubmitted = useCallback(() => {
    clearGridState(puzzleId);
  }, [puzzleId]);

  return (
    <div className="mt-3 flex flex-col gap-5">
      <MurdleDossier />

      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-700">
          Use o grid abaixo para anotar suas deduções. Clique em uma célula para
          alternar entre <strong className="text-emerald-600">✓</strong>,{" "}
          <strong className="text-red-600">✗</strong>,{" "}
          <strong className="text-gray-500">?</strong> e vazio.
        </p>
      </div>

      <MurdleBoard getValue={getValue} onCycle={cycle} />

      <MurdleAnswerPicker puzzleId={puzzleId} onSubmitted={handleSubmitted} />
    </div>
  );
}
