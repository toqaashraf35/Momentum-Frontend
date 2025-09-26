type FormInputProps = {
  id: string;
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string | number | File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
};

export default function Input({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  icon,
  error,
  disabled = false,
  size = "md",
}: FormInputProps) {
  const sizeClasses =
    size === "sm"
      ? "w-64 h-12"
      : size === "lg"
      ? "w-90 h-12"
      : size === "xl"
      ? "w-120 h-9"
      : size === "2xl"
      ? "w-150 h-20"
      : "w-73 h-12";

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
          value={type === "file" ? undefined : (value as string | number)} // file ما ليهش value
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={` ${icon ? "pl-10" : "pl-4"} pr-4 
            border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--main)] 
            focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
            focus:border-transparent transition-all duration-200
            ${error ? "border-red-500 ring-2 ring-red-200" : ""} 
            ${disabled ? "opacity-70 cursor-not-allowed" : ""} 
            ${sizeClasses}`}
        />
      </div>

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
