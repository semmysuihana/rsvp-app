import type { TextField } from "~/types/field";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function InputForm({
  type,
  name,
  label,
  placeholder,
  optional,
  value,
}: TextField) {
  const formatValue = (val: string | number | Date | null | undefined): string => {
    if (val === null || val === undefined) return "";

    if (type === "date") {
      return new Date(val).toISOString().split("T")[0] ?? "";
    }

    if (type === "time") {
      return new Date(val).toISOString().substring(11, 16);
    }

    return String(val);
  };

  const [inputValue, setInputValue] = useState(formatValue(value));
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-800 dark:text-gray-200"
      >
        {label}
        {optional && (
          <span className="text-gray-400 dark:text-gray-500"> (optional)</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={inputType}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder ?? label}
        className="
          w-full rounded-lg border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-700
          text-gray-800 dark:text-gray-200
          placeholder-gray-400 dark:placeholder-gray-500
          text-sm
          px-4 py-2
          focus:outline-none focus:ring-2 
          focus:ring-indigo-400 dark:focus:ring-indigo-500
          transition
        "
      />

      {/* PASSWORD ICON ONLY */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute right-3 top-8
            text-gray-500 dark:text-gray-400
            hover:text-gray-700 dark:hover:text-gray-300
          "
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      )}
    </div>
  );
}
