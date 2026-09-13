"use client";

import { useMemo, useState } from "react";
import { cn, toISODate } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function Calendar({
  validDates,
  selected,
  onSelect,
}: {
  /** ISO dates (YYYY-MM-DD) that are selectable. */
  validDates: string[];
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  const validSet = useMemo(() => new Set(validDates), [validDates]);
  const firstValid = useMemo(
    () => (validDates[0] ? new Date(`${validDates[0]}T00:00:00`) : new Date()),
    [validDates]
  );
  const lastValid = useMemo(
    () =>
      validDates.length
        ? new Date(`${validDates[validDates.length - 1]}T00:00:00`)
        : new Date(),
    [validDates]
  );

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(firstValid));

  const canGoPrev = !sameMonth(viewMonth, startOfMonth(firstValid));
  const canGoNext = !sameMonth(viewMonth, startOfMonth(lastValid));

  const weeks = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const daysInMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0
    ).getDate();
    const leadingBlanks = first.getDay();

    const cells: (Date | null)[] = [
      ...Array(leadingBlanks).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => new Date(
        viewMonth.getFullYear(),
        viewMonth.getMonth(),
        i + 1
      )),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [viewMonth]);

  const monthLabel = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!canGoPrev}
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold text-slate-900">{monthLabel}</p>
        <button
          type="button"
          aria-label="Next month"
          disabled={!canGoNext}
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flatMap((row, ri) =>
          row.map((date, ci) => {
            if (!date) return <div key={`${ri}-${ci}`} />;
            const iso = toISODate(date);
            const isValid = validSet.has(iso);
            const isSelected = selected === iso;
            return (
              <button
                key={iso}
                type="button"
                disabled={!isValid}
                onClick={() => onSelect(iso)}
                className={cn(
                  "aspect-square rounded-lg text-sm transition-colors",
                  !isValid && "text-slate-300",
                  isValid && !isSelected && "text-slate-700 hover:bg-brand-50",
                  isSelected && "bg-navy-900 font-semibold text-white"
                )}
              >
                {date.getDate()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
