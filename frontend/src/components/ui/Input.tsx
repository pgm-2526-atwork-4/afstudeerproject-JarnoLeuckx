import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full
          rounded-xl
          border border-slate-300 bg-white
          px-4 py-3
          focus:outline-none
          focus:ring-2
          focus:ring-[#0043A8]/30
          focus:border-[#0043A8]
          transition-all
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
