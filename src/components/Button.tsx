// components/form/Button.tsx
import React from "react";

type ButtonProps = {
  type?: "button" | "submit";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
};

export default function Button({
  type = "button",
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-3 bg-[var(--primary)] text-white rounded-xl font-semibold 
        hover:bg-[var(--secondary)] transform hover:-translate-y-0.5 
        transition-all duration-300 shadow-md hover:shadow-lg 
        focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50 
        disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {children}...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
