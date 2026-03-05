import { useMemo, useState } from "react";

type CalendarDateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
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

export default function CalendarDateField({
  id,
  label,
  value,
  onChange,
  minDate,
  required = false,
  className,
}: CalendarDateFieldProps) {
  const todayDateValue = formatDate(new Date());
  const minSelectableDate = minDate ?? "";

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = parseDate(value);
    if (selected) {
      return startOfMonth(selected);
    }

    if (minSelectableDate) {
      const min = parseDate(minSelectableDate);
      if (min) {
        return startOfMonth(min);
      }
    }

    return startOfMonth(new Date());
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
        isSelected: value === dateValue,
        isToday: dateValue === todayDateValue,
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
        isSelected: value === dateValue,
        isToday: dateValue === todayDateValue,
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
        isSelected: value === dateValue,
        isToday: dateValue === todayDateValue,
      });
    }

    return cells;
  }, [minSelectableDate, todayDateValue, value, visibleMonth]);

  const selectedDate = parseDate(value);

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
        value={value}
        required={required}
      />

      <div className="rounded-xl border border-slate-200 bg-white p-2">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
            className="btn-outline px-2.5 py-1 text-xs"
          >
            Vorige
          </button>

          <p className="text-sm font-bold text-slate-900">{monthLabel}</p>

          <button
            type="button"
            onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
            className="btn-outline px-2.5 py-1 text-xs"
          >
            Volgende
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {weekdayLabels.map((weekdayLabel) => (
            <div
              key={weekdayLabel}
              className="py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500"
            >
              {weekdayLabel}
            </div>
          ))}

          {calendarCells.map((cell) => (
            <button
              key={`${id}-${cell.dateValue}-${cell.dayNumber}`}
              type="button"
              disabled={cell.isDisabled}
              onClick={() => {
                onChange(cell.dateValue);
                const selected = parseDate(cell.dateValue);
                if (selected) {
                  setVisibleMonth(startOfMonth(selected));
                }
              }}
              className={[
                "h-8 rounded-md border text-xs font-semibold transition",
                cell.isDisabled
                  ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                  : cell.isSelected
                    ? "border-[#0043A8] bg-[#EAF3FF] text-[#0043A8]"
                    : cell.isToday
                      ? "border-slate-300 bg-white text-slate-900"
                      : cell.isCurrentMonth
                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        : "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100",
              ].join(" ")}
            >
              {cell.dayNumber}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {selectedDate
          ? new Intl.DateTimeFormat("nl-BE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(selectedDate)
          : "Nog geen datum geselecteerd."}
      </p>
    </div>
  );
}
