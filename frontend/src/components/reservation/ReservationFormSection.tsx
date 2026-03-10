import type { ReactNode } from "react";

type ReservationFormSectionProps = {
  step?: number;
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function ReservationFormSection({
  step,
  title,
  description,
  children,
}: ReservationFormSectionProps) {
  return (
    <section className="grid gap-4 border-t border-slate-200 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
      <div className="sm:pt-1">
        <div className="flex items-start gap-3 sm:block">
          {typeof step === "number" && (
            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#cfe0ff] bg-[#edf4ff] text-sm font-black text-[#0043A8] sm:mb-3">
              {step}
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {description && (
              <p className="mt-1 max-w-[22ch] text-sm leading-relaxed text-slate-600">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-white/70 sm:pl-2">
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}
