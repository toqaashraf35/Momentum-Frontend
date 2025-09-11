import React from "react";

type FormInputProps = {
  id: string;
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean; 
};

export default function Input({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  icon,
  error,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-[var(--dim)] font-semibold text-sm">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-90 ${icon ? "pl-10" : "pl-4"} pr-4 py-3 
            border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--main)] 
            focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
            focus:border-transparent transition-all duration-200
            ${error ? "border-red-500 ring-2 ring-red-200" : ""}
            ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
        />
      </div>

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
