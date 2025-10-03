// components/form/Button.tsx
import React from "react";

type ButtonProps = {
  type?: "button" | "submit";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  color?: "primary" | "secondary" | "red" | "green" | "yellow";
  size?: "xsm" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export default function Button({
  type = "button",
  isLoading = false,
  disabled = false,
  onClick,
  color = "primary",
  size = "md",
  children,
  icon,
}: ButtonProps) {
  const colorClasses: Record<typeof color, string> = {
    primary:
      "bg-[var(--primary)] hover:bg-[var(--secondary)] text-white focus:ring-[var(--primary)]",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500",
    red: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    green: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
    yellow:
      "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500",
  };

  const sizeClasses: Record<typeof size, string> = {
    xsm: "w-25 h-10 text-sm rounded-lg",
    sm: "w-35 h-10 text-sm rounded-lg",
    md: "w-60 h-10 text-base rounded-xl",
    lg: "w-90 h-10 text-lg rounded-2xl",
    xl: "w-120 h-10 text-lg rounded-2xl",
  };

  return (
    <div className="relative">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`
    flex items-center justify-center gap-2
    font-semibold shadow-md transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none
    transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
    ${colorClasses[color]} ${sizeClasses[size]}
  `}
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
          <>
            {icon && <span className="flex items-center">{icon}</span>}
            {children}
          </>
        )}
      </button>
    </div>
  );
}
