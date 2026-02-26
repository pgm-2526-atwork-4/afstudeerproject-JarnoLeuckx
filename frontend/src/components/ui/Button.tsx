import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "accent" | "primary" | "outline";
};

export default function Button({
  variant = "accent",
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition shadow-sm";

  const style =
    variant === "primary"
      ? "bg-primary text-white hover:bg-secondary"
      : variant === "outline"
      ? "border border-primary bg-transparent text-primary hover:bg-primary hover:text-white shadow-none"
      : "bg-accent text-black hover:bg-yellow-400";

  return <button className={`${base} ${style} ${className}`} {...props} />;
}