"use client";

import { cn, formatTimeLabel, TIME_SLOTS } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/icons";

export function TimeSlotGrid({
  disabled,
  selected,
  onSelect,
}: {
  disabled?: boolean;
  selected: string | null;
  onSelect: (time: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {TIME_SLOTS.map((time) => {
        const isSelected = selected === time;
        return (
          <button
            key={time}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(time)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              isSelected
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50"
            )}
          >
            {formatTimeLabel(time)}
            {isSelected && <CheckIcon className="h-3.5 w-3.5" />}
          </button>
        );
      })}
    </div>
  );
}
