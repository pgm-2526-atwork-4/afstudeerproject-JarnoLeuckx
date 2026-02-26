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
          className="block text-sm font-medium text-primary mb-2"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full
          rounded-xl
          border border-primary/20
          px-4 py-3
          focus:outline-none
          focus:ring-2
          focus:ring-primary
          transition
          ${className}
        `}
        {...props}
      />
    </div>
  );
}