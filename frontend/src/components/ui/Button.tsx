import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "accent" | "primary" | "outline" | "ghost";
};

export default function Button({
  variant = "accent",
  className = "",
  ...props
}: Props) {
  const style =
    variant === "primary"
      ? "btn-primary"
      : variant === "outline"
        ? "btn-outline"
        : variant === "ghost"
          ? "btn-ghost"
          : "btn-accent";

  return <button className={`${style} ${className}`} {...props} />;
}
