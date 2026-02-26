import React, { createContext, useContext } from "react";

/* -----------------------------
   Context
----------------------------- */

type CardContextType = {
  variant?: "default" | "highlight";
};

const CardContext = createContext<CardContextType | null>(null);

function useCardContext() {
  const context = useContext(CardContext);

  if (!context) {
    throw new Error("Card components must be used inside <Card>");
  }

  return context;
}

/* -----------------------------
   Card Root
----------------------------- */

type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "highlight";
};

export function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        className={`
          rounded-2xl
          bg-white
          border
          ${
            variant === "highlight"
              ? "border-accent shadow-lg"
              : "border-primary/10 shadow-sm"
          }
          transition-all
          duration-300
          hover:shadow-xl
          hover:-translate-y-1
          ${className}
        `}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

/* -----------------------------
   Card Header
----------------------------- */

type CardSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardHeader({
  children,
  className = "",
}: CardSectionProps) {
  const { variant } = useCardContext();

  return (
    <div
      className={`
        px-8 pt-8
        ${
          variant === "highlight"
            ? "text-accent"
            : "text-primary"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* -----------------------------
   Card Content
----------------------------- */

export function CardContent({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <div className={`px-8 py-6 ${className}`}>
      {children}
    </div>
  );
}

/* -----------------------------
   Card Footer
----------------------------- */

export function CardFooter({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <div className={`px-8 pb-8 ${className}`}>
      {children}
    </div>
  );
}