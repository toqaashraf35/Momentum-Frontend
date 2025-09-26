// components/Select.tsx
import React, { useMemo, useRef, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SelectProps {
  id: string;
  label: string;
  name: string;
  value: string | string[];
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  size?:  "md" | "lg";
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  name,
  value,
  size,
  options,
  onChange,
  error,
  multiple = false,
  disabled = false,
  required = false,
  placeholder = `Select ${label.toLowerCase()}`,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedValues = useMemo((): string[] => {
    if (multiple) {
      return Array.isArray(value) ? value : value ? [value] : [];
    } else {
      return value && typeof value === "string" ? [value] : [];
    }
  }, [value, multiple]);

  const triggerChange = (newValue: string | string[]) => {
    const event = {
      target: {
        name: name,
        value: newValue,
        type: "select-multiple",
        multiple: multiple,
        selectedOptions: Array.isArray(newValue)
          ? newValue.map((val) => ({ value: val, selected: true }))
          : [{ value: newValue, selected: true }],
      },
    } as never;

    onChange(event);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionToggle = (option: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (disabled) return;

    if (multiple) {
      const isSelected = selectedValues.includes(option);
      const newValues = isSelected
        ? selectedValues.filter((v) => v !== option)
        : [...selectedValues, option];
      triggerChange(newValues);
    } else {
      triggerChange(option);
      setIsOpen(false);
    }
  };

  const removeSelected = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    if (multiple) {
      const newValues = selectedValues.filter((v) => v !== option);
      triggerChange(newValues);
    } else {
      triggerChange("");
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    triggerChange(multiple ? [] : "");
  };

  const getContainerClass = () => {
    const sizeClass =
     size === "md" ? "w-73 h-12" : "w-90 h-12";
    const baseClass = `${sizeClass} px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none cursor-pointer transition-colors flex flex-wrap gap-2 ${
      multiple ? "overflow-y-scroll" : "overflow-hidden"
    }`;

    if (error) return `${baseClass} border-red-500 ring-2 ring-red-200`;
    if (disabled)
      return `${baseClass} bg-gray-100 cursor-not-allowed opacity-60`;
    if (isOpen) return `${baseClass} ring-2 ring-blue-200 border-blue-500`;
    return `${baseClass} border-gray-300 hover:border-gray-400`;
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={selectRef}>
      <label htmlFor={id} className="text-gray-500 font-semibold text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={getContainerClass()}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-400 py-2">{placeholder}</span>
        ) : (
          <>
            {selectedValues.map((opt) => (
              <span
                key={opt}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  multiple ? "bg-blue-100 text-blue-800" : "text-gray-800"
                }`}
              >
                {opt}
                {multiple && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => removeSelected(opt, e)}
                    className="text-blue-600 hover:text-blue-800 rounded-full w-4 h-4 flex items-center justify-center"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </>
        )}

        <div className="ml-auto flex items-center gap-1">
          {multiple && selectedValues.length > 0 && !disabled && (
            <button
              type="button"
              onClick={clearAll}
              className="text-gray-400 hover:text-gray-600 p-1 rounded"
              title="Clear All"
            >
              ×
            </button>
          )}
          {isOpen ? (
            <ChevronUp className="text-[var(--dim)] w-5 h-5" />
          ) : (
            <ChevronDown className="text-[var(--dim)] w-5 h-5" />
          )}
        </div>
      </div>

      {/* Options list */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-400 text-sm">
              No items available
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = selectedValues.includes(opt);
              return (
                <div
                  key={opt}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                    isSelected ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={(e) => handleOptionToggle(opt, e)}
                >
                  {multiple && (
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                  )}
                  <span>{opt}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Error message */}
      {error && <span className="text-red-500 text-xs">{error}</span>}

      {/* Selected count (multiple only) */}
      {multiple && selectedValues.length > 0 && (
        <span className="text-xs text-gray-500">
          {selectedValues.length === 1
            ? selectedValues.length + " Tag selected"
            : selectedValues.length + " Tags selected"}
        </span>
      )}
    </div>
  );
};

export default Select;
