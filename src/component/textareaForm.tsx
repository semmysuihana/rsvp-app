import type { TextField } from "~/types/field";
import { useState } from "react";

export default function TextareaForm({
  name,
  label,
  placeholder,
  optional,
  value,
}: TextField) {
  
  const formatValue = (val: string | number | Date | undefined | null): string => {
    if (val === null || val === undefined) return "";
    if (val instanceof Date) return val.toISOString().split("T")[0] ?? "";
    return String(val);
  };

  const [inputValue, setInputValue] = useState<string>(formatValue(value));

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-800 dark:text-gray-200"
      >
        {label}
        {optional && (
          <span className="text-gray-400 dark:text-gray-500"> (optional)</span>
        )}
      </label>

      <textarea
        id={name}
        name={name}
        rows={4}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="
            w-full rounded-lg
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700
            text-gray-800 dark:text-gray-200
            text-sm
            px-4 py-2
            transition
            focus:outline-none focus:ring-2 focus:ring-indigo-600
        "
      />
    </div>
  );
}
