"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SUSPECTS, type Suspect } from "@/lib/murdle";
import { submitMurdleAccusation } from "@/lib/queries/murdle";

type Props = {
  puzzleId: string;
  onSubmitted?: () => void;
};

type Status = "idle" | "loading" | "error";

export function MurdleAnswerPicker({ puzzleId, onSubmitted }: Props) {
  const [selected, setSelected] = useState<Suspect | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selected) return;
    setStatus("loading");
    try {
      await submitMurdleAccusation(puzzleId, selected);
      onSubmitted?.();
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-3">
      <p className="text-sm text-gray-700">
        <strong>Quem roubou o Lorenzzo Lopez?</strong>
      </p>
      <div className="flex flex-wrap gap-2">
        {SUSPECTS.map((name) => {
          const isSelected = selected === name;
          return (
            <Button
              key={name}
              variant={isSelected ? "default" : "outline"}
              onClick={() => {
                setSelected(name);
                setStatus("idle");
              }}
              disabled={status === "loading"}
            >
              {name}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!selected || status === "loading"}
        >
          {status === "loading" ? "Enviando..." : "Confirmar acusação"}
        </Button>
        {selected && status !== "loading" && (
          <span className="text-xs text-gray-500">
            Acusando: <strong>{selected}</strong>
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400">
        A resposta correta será revelada presencialmente no All Hands.
      </p>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Não foi possível registrar a acusação. Tente novamente.
        </p>
      )}
    </div>
  );
}
