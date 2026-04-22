"use client";

import type { MurdleCellValue } from "@/lib/murdle";

type Props = {
  title: string;
  rows: readonly string[];
  cols: readonly string[];
  getValue: (row: string, col: string) => MurdleCellValue;
  onCycle: (row: string, col: string) => void;
};

function CellContent({ value }: { value: MurdleCellValue }) {
  if (value === "V") {
    return <span className="text-base font-semibold text-emerald-600">✓</span>;
  }
  if (value === "F") {
    return <span className="text-base font-semibold text-red-600">✗</span>;
  }
  if (value === "?") {
    return <span className="text-sm font-semibold text-gray-400">?</span>;
  }
  return null;
}

function cellAriaLabel(row: string, col: string, value: MurdleCellValue): string {
  const state =
    value === "V"
      ? "verdadeiro"
      : value === "F"
        ? "falso"
        : value === "?"
          ? "incerto"
          : "vazio";
  return `${row} × ${col}: ${state}`;
}

export function LogicGrid({ title, rows, cols, getValue, onCycle }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h4>
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-0.5 text-xs">
          <thead>
            <tr>
              <th className="w-20" aria-hidden="true" />
              {cols.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="w-12 px-1 pb-1 align-bottom text-[10px] font-medium leading-tight text-gray-600"
                >
                  <div className="line-clamp-2 break-words">{col}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <th
                  scope="row"
                  className="w-20 pr-2 text-right text-[11px] font-medium leading-tight text-gray-700"
                >
                  <div className="line-clamp-2 break-words">{row}</div>
                </th>
                {cols.map((col) => {
                  const value = getValue(row, col);
                  return (
                    <td key={col} className="p-0">
                      <button
                        type="button"
                        onClick={() => onCycle(row, col)}
                        aria-label={cellAriaLabel(row, col, value)}
                        className="flex h-10 w-12 items-center justify-center rounded border border-gray-200 bg-white transition-colors hover:bg-gray-50 active:bg-gray-100"
                      >
                        <CellContent value={value} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
