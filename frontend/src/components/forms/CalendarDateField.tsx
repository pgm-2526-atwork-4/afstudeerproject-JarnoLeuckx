import { useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

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

function toDateList(startValue: string, endValue: string) {
  const start = parseDate(startValue);
  const end = parseDate(endValue);

  if (!start || !end) {
    return [];
  }

  const from = start <= end ? start : end;
  const to = start <= end ? end : start;
  const dates: Date[] = [];
  const current = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  while (current <= to) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
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

  const selectedSingle = !isRangeMode
    ? (parseDate(effectiveStart) ?? undefined)
    : undefined;

  const selectedRange = isRangeMode
    ? (() => {
        const from = parseDate(effectiveStart);
        const to = parseDate(effectiveEnd);

        if (!from) {
          return undefined;
        }

        return {
          from,
          to: to ?? from,
        } as DateRange;
      })()
    : undefined;

  const previewRangeDates = useMemo(
    () => (!isRangeMode ? toDateList(displayStart, displayEnd) : []),
    [displayEnd, displayStart, isRangeMode],
  );

  const dayHighlightDates = useMemo(() => {
    const highlights: Record<
      "available" | "leave_pending" | "leave_approved" | "sick",
      Date[]
    > = {
      available: [],
      leave_pending: [],
      leave_approved: [],
      sick: [],
    };

    if (!dayHighlights) {
      return highlights;
    }

    Object.entries(dayHighlights).forEach(([dateValue, variant]) => {
      const date = parseDate(dateValue);
      if (!date) {
        return;
      }

      highlights[variant].push(date);
    });

    return highlights;
  }, [dayHighlights]);

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

  const fromDate = parseDate(minSelectableDate) ?? undefined;

  const classNames = {
    root: "w-full",
    month: "w-full",
    month_grid: "w-full border-collapse",
    caption:
      "mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2",
    caption_label: "text-sm font-bold text-slate-900",
    nav: "flex items-center gap-2",
    button_previous: "btn-outline px-3 py-1.5 text-xs",
    button_next: "btn-outline px-3 py-1.5 text-xs",
    weekdays: "grid grid-cols-7 gap-2",
    weekday:
      "py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500",
    week: "mt-2 grid grid-cols-7 gap-2",
    day: "h-12",
    day_button:
      "h-12 w-full rounded-xl border text-sm font-semibold shadow-sm transition",
    outside: "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100",
    disabled:
      "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 hover:bg-slate-50",
    today: "border-slate-300 bg-white text-slate-900",
    selected: highlightClasses.selected,
    range_start: highlightClasses.selected,
    range_middle: highlightClasses.range,
    range_end: highlightClasses.selected,
  };

  const modifiers = {
    previewRange: previewRangeDates,
    available: dayHighlightDates.available,
    leave_pending: dayHighlightDates.leave_pending,
    leave_approved: dayHighlightDates.leave_approved,
    sick: dayHighlightDates.sick,
  };

  const modifiersClassNames = {
    previewRange: highlightClasses.range,
    available: dayHighlightClasses.available,
    leave_pending: dayHighlightClasses.leave_pending,
    leave_approved: dayHighlightClasses.leave_approved,
    sick: dayHighlightClasses.sick,
  };

  return (
    <div className={className ? `${className} w-full` : "w-full"}>
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

      <div className="w-full rounded-2xl border border-[#dbe7ff] bg-white p-3 shadow-sm">
        <div className="mb-4 w-full rounded-2xl border border-[#dbe7ff] bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] p-4">
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

        <div className="mb-3 flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-sm font-bold text-slate-900">{monthLabel}</p>
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

        {isRangeMode ? (
          <DayPicker
            style={{ width: "100%" }}
            mode="range"
            selected={selectedRange}
            onSelect={(range: DateRange | undefined) => {
              if (!onRangeChange || !range?.from) {
                onRangeChange?.("", "");
                return;
              }

              const startDate = range.from;
              const endDate = range.to ?? range.from;
              onRangeChange(formatDate(startDate), formatDate(endDate));
              setVisibleMonth(startOfMonth(startDate));
            }}
            weekStartsOn={1}
            showOutsideDays
            fromDate={fromDate}
            month={visibleMonth}
            onMonthChange={(month) => setVisibleMonth(startOfMonth(month))}
            classNames={classNames}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            labels={{
              labelPrevious: () => "Vorige maand",
              labelNext: () => "Volgende maand",
            }}
            formatters={{
              formatCaption: () => monthLabel,
              formatWeekdayName: (weekday) =>
                weekdayLabels[(weekday.getDay() + 6) % 7],
            }}
          />
        ) : (
          <DayPicker
            style={{ width: "100%" }}
            mode="single"
            selected={selectedSingle}
            onSelect={(date: Date | undefined) => {
              if (!date) {
                onChange("");
                return;
              }

              onChange(formatDate(date));
              setVisibleMonth(startOfMonth(date));
            }}
            weekStartsOn={1}
            showOutsideDays
            fromDate={fromDate}
            month={visibleMonth}
            onMonthChange={(month) => setVisibleMonth(startOfMonth(month))}
            classNames={classNames}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            labels={{
              labelPrevious: () => "Vorige maand",
              labelNext: () => "Volgende maand",
            }}
            formatters={{
              formatCaption: () => monthLabel,
              formatWeekdayName: (weekday) =>
                weekdayLabels[(weekday.getDay() + 6) % 7],
            }}
          />
        )}
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Klik rechtstreeks op een dag in de kalender.
      </p>
    </div>
  );
}
