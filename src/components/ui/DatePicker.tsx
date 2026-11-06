import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  addDays, addMonths, endOfMonth, endOfWeek, format, isSameMonth, parseISO, startOfMonth, startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const iso = (d: Date) => format(d, "yyyy-MM-dd");

/**
 * Inline, keyboard-usable calendar (grid pattern): arrows move by day/week,
 * Home/End to week start/end, PageUp/PageDown by month, Enter/Space selects.
 */
export function DatePicker({
  value,
  onChange,
  isDisabled,
  label = "Choisir une date",
}: {
  value: string | null;
  onChange: (isoDate: string) => void;
  isDisabled: (isoDate: string) => boolean;
  label?: string;
}) {
  const [month, setMonth] = useState(() => startOfMonth(value ? parseISO(value) : addDays(new Date(), 1)));
  const [focusDate, setFocusDate] = useState(() => value ?? iso(addDays(new Date(), 1)));
  const grid = useRef<HTMLDivElement>(null);

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const days: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
    return Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7));
  }, [month]);

  const moveFocus = (next: Date) => {
    const nextIso = iso(next);
    setFocusDate(nextIso);
    if (!isSameMonth(next, month)) setMonth(startOfMonth(next));
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>(`[data-date="${nextIso}"]`)?.focus());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, day: Date) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(day, -1),
      ArrowRight: () => addDays(day, 1),
      ArrowUp: () => addDays(day, -7),
      ArrowDown: () => addDays(day, 7),
      Home: () => startOfWeek(day, { weekStartsOn: 1 }),
      End: () => endOfWeek(day, { weekStartsOn: 1 }),
      PageUp: () => addMonths(day, -1),
      PageDown: () => addMonths(day, 1),
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      moveFocus(move());
    }
  };

  const weekdays = ["lu", "ma", "me", "je", "ve", "sa", "di"];

  return (
    <div className="w-full select-none" role="group" aria-label={label}>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => setMonth(addMonths(month, -1))} className="grid size-9 place-items-center rounded-full hover:bg-sand-200" aria-label="Mois précédent">
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <p className="font-semibold capitalize" aria-live="polite">
          {format(month, "MMMM yyyy", { locale: fr })}
        </p>
        <button type="button" onClick={() => setMonth(addMonths(month, 1))} className="grid size-9 place-items-center rounded-full hover:bg-sand-200" aria-label="Mois suivant">
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
      <div ref={grid} role="grid" aria-label={format(month, "MMMM yyyy", { locale: fr })} className="grid gap-1">
        <div role="row" className="grid grid-cols-7 gap-1">
          {weekdays.map((d) => (
            <span key={d} role="columnheader" className="py-1 text-center text-xs font-medium uppercase text-muted">
              {d}
            </span>
          ))}
        </div>
        {weeks.map((week) => (
          <div role="row" key={iso(week[0]!)} className="grid grid-cols-7 gap-1">
            {week.map((day) => {
              const d = iso(day);
              const disabled = isDisabled(d);
              const selected = d === value;
              const outside = !isSameMonth(day, month);
              return (
                <div role="gridcell" key={d} aria-selected={selected}>
                  <button
                    type="button"
                    data-date={d}
                    tabIndex={d === focusDate ? 0 : -1}
                    disabled={disabled}
                    onClick={() => onChange(d)}
                    onKeyDown={(e) => onKeyDown(e, day)}
                    onFocus={() => setFocusDate(d)}
                    aria-label={format(day, "EEEE d MMMM yyyy", { locale: fr }) + (disabled ? ", indisponible" : "")}
                    className={cn(
                      "tabular aspect-square w-full rounded-full text-sm transition-colors",
                      selected ? "bg-navy font-semibold text-white" : "hover:bg-sand-200",
                      disabled && "cursor-not-allowed text-muted/40 line-through decoration-muted/30 hover:bg-transparent",
                      outside && !selected && "opacity-40",
                    )}
                  >
                    {format(day, "d")}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
