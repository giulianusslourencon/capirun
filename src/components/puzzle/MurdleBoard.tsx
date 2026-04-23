"use client";

import {
  ACTIONS,
  ACTION_EMOJI,
  MOTIVATIONS,
  MOTIVATION_EMOJI,
  SUSPECTS,
  SUSPECT_EMOJI,
  type Action,
  type CategoryKey,
  type Motivation,
  type MurdleCellValue,
  type Suspect,
} from "@/lib/murdle";

type Props = {
  getValue: (
    catA: CategoryKey,
    itemA: string,
    catB: CategoryKey,
    itemB: string,
  ) => MurdleCellValue;
  onCycle: (
    catA: CategoryKey,
    itemA: string,
    catB: CategoryKey,
    itemB: string,
  ) => void;
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

type ActiveCellProps = {
  rowItem: string;
  colItem: string;
  value: MurdleCellValue;
  onCycle: () => void;
};

function ActiveCell({ rowItem, colItem, value, onCycle }: ActiveCellProps) {
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={cellAriaLabel(rowItem, colItem, value)}
      className="flex h-10 w-12 items-center justify-center rounded border border-gray-200 bg-white transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      <CellContent value={value} />
    </button>
  );
}

const COL_CATEGORY_HEADER =
  "px-1 pb-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-500";
const ROW_CATEGORY_HEADER =
  "px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 [writing-mode:vertical-rl] rotate-180";
const ITEM_HEADER_COL =
  "w-12 px-1 pb-1 align-bottom text-xl leading-none font-medium text-gray-700";
const ITEM_HEADER_ROW =
  "w-12 pr-2 text-right text-xl leading-none font-medium text-gray-700";

export function MurdleBoard({ getValue, onCycle }: Props) {
  const suspectEmoji = (s: Suspect) => SUSPECT_EMOJI[s];
  const motivationEmoji = (m: Motivation) => MOTIVATION_EMOJI[m];
  const actionEmoji = (a: Action) => ACTION_EMOJI[a];

  return (
    <div className="flex justify-center overflow-x-auto">
      <table className="border-separate border-spacing-0.5 text-xs">
        <thead>
          <tr>
            <th aria-hidden="true" />
            <th aria-hidden="true" />
            <th colSpan={3} scope="colgroup" className={COL_CATEGORY_HEADER}>
              Suspeitos
            </th>
            <th colSpan={3} scope="colgroup" className={COL_CATEGORY_HEADER}>
              Motivações
            </th>
          </tr>
          <tr>
            <th aria-hidden="true" />
            <th aria-hidden="true" />
            {SUSPECTS.map((s) => (
              <th key={s} scope="col" title={s} className={ITEM_HEADER_COL}>
                <div className="flex items-end justify-center">
                  <span aria-hidden>{suspectEmoji(s)}</span>
                  <span className="sr-only">{s}</span>
                </div>
              </th>
            ))}
            {MOTIVATIONS.map((m) => (
              <th key={m} scope="col" title={m} className={ITEM_HEADER_COL}>
                <div className="flex items-end justify-center">
                  <span aria-hidden>{motivationEmoji(m)}</span>
                  <span className="sr-only">{m}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ACTIONS.map((action, idx) => (
            <tr key={action}>
              {idx === 0 ? (
                <th
                  rowSpan={3}
                  scope="rowgroup"
                  className={ROW_CATEGORY_HEADER}
                >
                  Ações
                </th>
              ) : null}
              <th scope="row" title={action} className={ITEM_HEADER_ROW}>
                <div className="flex items-center justify-end">
                  <span aria-hidden>{actionEmoji(action)}</span>
                  <span className="sr-only">{action}</span>
                </div>
              </th>
              {SUSPECTS.map((s) => (
                <td key={s} className="p-0">
                  <ActiveCell
                    rowItem={action}
                    colItem={s}
                    value={getValue("A", action, "S", s)}
                    onCycle={() => onCycle("A", action, "S", s)}
                  />
                </td>
              ))}
              {MOTIVATIONS.map((m) => (
                <td key={m} className="p-0">
                  <ActiveCell
                    rowItem={action}
                    colItem={m}
                    value={getValue("A", action, "M", m)}
                    onCycle={() => onCycle("A", action, "M", m)}
                  />
                </td>
              ))}
            </tr>
          ))}
          {MOTIVATIONS.map((motivation, idx) => (
            <tr key={motivation}>
              {idx === 0 ? (
                <th
                  rowSpan={3}
                  scope="rowgroup"
                  className={ROW_CATEGORY_HEADER}
                >
                  Motivações
                </th>
              ) : null}
              <th scope="row" title={motivation} className={ITEM_HEADER_ROW}>
                <div className="flex items-center justify-end">
                  <span aria-hidden>{motivationEmoji(motivation)}</span>
                  <span className="sr-only">{motivation}</span>
                </div>
              </th>
              {SUSPECTS.map((s) => (
                <td key={s} className="p-0">
                  <ActiveCell
                    rowItem={motivation}
                    colItem={s}
                    value={getValue("M", motivation, "S", s)}
                    onCycle={() => onCycle("M", motivation, "S", s)}
                  />
                </td>
              ))}
              {MOTIVATIONS.map((m) => (
                <td key={`empty-${m}`} className="p-0" aria-hidden="true" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
