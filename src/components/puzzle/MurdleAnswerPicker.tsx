"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SUSPECTS, type Suspect } from "@/lib/murdle";
import { submitMurdleAccusation } from "@/lib/queries/murdle";

type Props = {
  puzzleId: string;
  initialAccusation?: string | null;
};

type Status = "idle" | "loading" | "error";

function toSuspect(value: string | null | undefined): Suspect | null {
  if (!value) return null;
  return (SUSPECTS as readonly string[]).includes(value)
    ? (value as Suspect)
    : null;
}

export function MurdleAnswerPicker({ puzzleId, initialAccusation }: Props) {
  const initial = toSuspect(initialAccusation);
  const [selected, setSelected] = useState<Suspect | null>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const router = useRouter();

  const hasSubmitted = initial !== null;
  const isUnchanged = selected !== null && selected === initial;

  const handleSubmit = async () => {
    if (!selected || isUnchanged) return;
    setStatus("loading");
    try {
      await submitMurdleAccusation(puzzleId, selected);
      router.refresh();
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-3 flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-gray-700">
        <strong>Quem roubou o Lorenzzo Lopez?</strong>
      </p>
      {hasSubmitted && (
        <p className="text-xs text-gray-500">
          Acusação atual: <strong>{initial}</strong>
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
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
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!selected || isUnchanged || status === "loading"}
        >
          {status === "loading"
            ? "Enviando..."
            : hasSubmitted
              ? "Atualizar acusação"
              : "Confirmar acusação"}
        </Button>
        {selected && status !== "loading" && !isUnchanged && (
          <span className="text-xs text-gray-500">
            Acusando: <strong>{selected}</strong>
          </span>
        )}
        {isUnchanged && status !== "loading" && (
          <span className="text-xs text-gray-400">Nenhuma alteração</span>
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
