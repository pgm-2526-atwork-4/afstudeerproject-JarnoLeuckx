import { useMemo, useState } from "react";

type CalendarDateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rangeStart?: string;
  rangeEnd?: string;
  onRangeChange?: (start: string, end: string) => void;
  highlightStart?: string;
  highlightEnd?: string;
  highlightVariant?:
    | "default"
    | "available"
    | "leave_pending"
    | "leave_approved"
    | "sick";
  dayHighlights?: Record<
    string,
    "available" | "leave_pending" | "leave_approved" | "sick"
  >;
  minDate?: string;
  required?: boolean;
  className?: string;
};

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatDisplayDate(value: string) {
  const date = parseDate(value);

  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("nl-BE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function resolveDefaultMonth(minSelectableDate: string) {
  if (minSelectableDate) {
    const min = parseDate(minSelectableDate);
    if (min) {
      return startOfMonth(min);
    }
  }

  return startOfMonth(new Date());
}

export default function CalendarDateField({
  id,
  label,
  value,
  onChange,
  rangeStart,
  rangeEnd,
  onRangeChange,
  highlightStart,
  highlightEnd,
  highlightVariant = "default",
  dayHighlights,
  minDate,
  required = false,
  className,
}: CalendarDateFieldProps) {
  const isRangeMode = typeof onRangeChange === "function";
  const effectiveStart = isRangeMode ? (rangeStart ?? "") : value;
  const effectiveEnd = isRangeMode ? (rangeEnd ?? "") : value;
  const displayStart = isRangeMode
    ? effectiveStart
    : (highlightStart ?? effectiveStart);
  const displayEnd = isRangeMode
    ? effectiveEnd
    : (highlightEnd ?? displayStart);

  const todayDateValue = formatDate(new Date());
  const minSelectableDate = minDate ?? "";

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = parseDate(effectiveStart);
    if (selected) {
      return startOfMonth(selected);
    }

    return resolveDefaultMonth(minSelectableDate);
  });

  const weekdayLabels = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

  const monthLabel = useMemo(() => {
    const formatted = new Intl.DateTimeFormat("nl-BE", {
      month: "long",
      year: "numeric",
    }).format(visibleMonth);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [visibleMonth]);

  const calendarCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const cells: Array<{
      dateValue: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isSelected: boolean;
      isToday: boolean;
      dayHighlight:
        | "available"
        | "leave_pending"
        | "leave_approved"
        | "sick"
        | null;
    }> = [];

    for (let index = firstWeekday - 1; index >= 0; index -= 1) {
      const dayNumber = daysInPreviousMonth - index;
      const date = new Date(year, month - 1, dayNumber);
      const dateValue = formatDate(date);

      cells.push({
        dateValue,
        dayNumber,
        isCurrentMonth: false,
        isDisabled: Boolean(minSelectableDate && dateValue < minSelectableDate),
        isSelected: displayStart === dateValue || displayEnd === dateValue,
        isToday: dateValue === todayDateValue,
        dayHighlight: dayHighlights?.[dateValue] ?? null,
      });
    }

    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
      const date = new Date(year, month, dayNumber);
      const dateValue = formatDate(date);

      cells.push({
        dateValue,
        dayNumber,
        isCurrentMonth: true,
        isDisabled: Boolean(minSelectableDate && dateValue < minSelectableDate),
        isSelected: displayStart === dateValue || displayEnd === dateValue,
        isToday: dateValue === todayDateValue,
        dayHighlight: dayHighlights?.[dateValue] ?? null,
      });
    }

    const remaining = 42 - cells.length;
    for (let dayNumber = 1; dayNumber <= remaining; dayNumber += 1) {
      const date = new Date(year, month + 1, dayNumber);
      const dateValue = formatDate(date);

      cells.push({
        dateValue,
        dayNumber,
        isCurrentMonth: false,
        isDisabled: Boolean(minSelectableDate && dateValue < minSelectableDate),
        isSelected: displayStart === dateValue || displayEnd === dateValue,
        isToday: dateValue === todayDateValue,
        dayHighlight: dayHighlights?.[dateValue] ?? null,
      });
    }

    return cells;
  }, [
    displayEnd,
    displayStart,
    dayHighlights,
    minSelectableDate,
    todayDateValue,
    visibleMonth,
  ]);

  const highlightClasses = {
    selected:
      highlightVariant === "available"
        ? "border-emerald-300 bg-emerald-100 text-emerald-900"
        : highlightVariant === "leave_pending"
          ? "border-gray-400 bg-gray-200 text-gray-900"
          : highlightVariant === "leave_approved"
            ? "border-orange-300 bg-orange-100 text-orange-900"
            : highlightVariant === "sick"
              ? "border-red-300 bg-red-100 text-red-900"
              : "border-[#0043A8] bg-[#EAF3FF] text-[#0043A8]",
    range:
      highlightVariant === "available"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : highlightVariant === "leave_pending"
          ? "border-gray-300 bg-gray-100 text-gray-800"
          : highlightVariant === "leave_approved"
            ? "border-orange-200 bg-orange-50 text-orange-800"
            : highlightVariant === "sick"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-slate-200 bg-[#F3F8FF] text-[#0043A8]",
  };

  const selectedDate = parseDate(effectiveStart);
  const selectedEndDate = parseDate(effectiveEnd);
  const dayHighlightClasses: Record<
    "available" | "leave_pending" | "leave_approved" | "sick",
    string
  > = {
    available: "border-emerald-200 bg-emerald-50 text-emerald-800",
    leave_pending: "border-gray-300 bg-gray-100 text-gray-800",
    leave_approved: "border-orange-200 bg-orange-50 text-orange-800",
    sick: "border-red-200 bg-red-50 text-red-800",
  };

  const formattedStart = formatDisplayDate(effectiveStart);
  const formattedEnd = formatDisplayDate(effectiveEnd);
  const selectionLabel = formattedStart
    ? isRangeMode && formattedEnd
      ? `Van ${formattedStart} t.e.m. ${formattedEnd}`
      : formattedStart
    : "Nog geen datum geselecteerd.";

  return (
    <div className={className}>
      <span className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </span>

      <input
        id={id}
        name={id}
        type="hidden"
        value={effectiveStart}
        required={required}
      />
      {isRangeMode && (
        <input
          name={`${id}-end`}
          type="hidden"
          value={effectiveEnd}
          required={required}
        />
      )}

      <div className="rounded-2xl border border-[#dbe7ff] bg-white p-3 shadow-sm">
        <div className="mb-4 rounded-2xl border border-[#dbe7ff] bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0043A8]">
            Geselecteerde datum
          </p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {selectionLabel}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Kies hieronder rechtstreeks een dag in de kalender.
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <button
            type="button"
            onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
            className="btn-outline px-3 py-1.5 text-xs"
          >
            Vorige
          </button>

          <p className="text-sm font-bold text-slate-900">{monthLabel}</p>

          <button
            type="button"
            onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
            className="btn-outline px-3 py-1.5 text-xs"
          >
            Volgende
          </button>
        </div>

        {(effectiveStart || effectiveEnd) && (
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (isRangeMode && onRangeChange) {
                  onRangeChange("", "");
                } else {
                  onChange("");
                }

                setVisibleMonth(resolveDefaultMonth(minSelectableDate));
              }}
              className="btn-outline px-2.5 py-1 text-xs"
            >
              Reset periode
            </button>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2">
          {weekdayLabels.map((weekdayLabel) => (
            <div
              key={weekdayLabel}
              className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
            >
              {weekdayLabel}
            </div>
          ))}

          {calendarCells.map((cell) =>
            (() => {
              const inRange =
                displayStart &&
                displayEnd &&
                cell.dateValue >= displayStart &&
                cell.dateValue <= displayEnd;

              return (
                <button
                  key={`${id}-${cell.dateValue}-${cell.dayNumber}`}
                  type="button"
                  disabled={cell.isDisabled}
                  onClick={() => {
                    if (isRangeMode && onRangeChange) {
                      const currentStart = effectiveStart;
                      const currentEnd = effectiveEnd;

                      if (!currentStart) {
                        onRangeChange(cell.dateValue, cell.dateValue);
                      } else if (
                        currentStart &&
                        currentEnd &&
                        currentStart !== currentEnd
                      ) {
                        if (cell.dateValue < currentStart) {
                          onRangeChange(cell.dateValue, currentEnd);
                        } else {
                          onRangeChange(currentStart, cell.dateValue);
                        }
                      } else {
                        if (cell.dateValue < currentStart) {
                          onRangeChange(cell.dateValue, currentStart);
                        } else {
                          onRangeChange(currentStart, cell.dateValue);
                        }
                      }
                    } else {
                      onChange(cell.dateValue);
                    }

                    const selected = parseDate(cell.dateValue);
                    if (selected) {
                      setVisibleMonth(startOfMonth(selected));
                    }
                  }}
                  className={[
                    "h-12 rounded-xl border text-sm font-semibold shadow-sm transition",
                    cell.isDisabled
                      ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                      : cell.isSelected
                        ? highlightClasses.selected
                        : inRange
                          ? highlightClasses.range
                          : cell.dayHighlight
                            ? dayHighlightClasses[cell.dayHighlight]
                            : cell.isToday
                              ? "border-slate-300 bg-white text-slate-900"
                              : cell.isCurrentMonth
                                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                                : "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {cell.dayNumber}
                </button>
              );
            })(),
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Klik rechtstreeks op een dag in de kalender.
      </p>
    </div>
  );
}
