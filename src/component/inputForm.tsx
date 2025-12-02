import type { TextField } from "~/types/field";
import { useState } from "react";
export default function InputForm({ type, name, label, placeholder, optional, value }: TextField) {

  const formatValue = (val: string | number | Date | null | undefined): string => {
    if (val === null || val === undefined) return "";
    
    if (type === "date" && val) {
      return new Date(val).toISOString().split("T")[0] ?? "";
    }
    
    if (type === "time" && val) {
      return new Date(val).toISOString().substring(11, 16);
    }
    
    if (typeof val === "number") return val.toString();
    if (val instanceof Date) return val.toISOString();
    
    return String(val);
  };

  const formattedValue: string = formatValue(value);
  const [inputValue, setInputValue] = useState(formattedValue);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label}
        {optional && <span className="text-gray-400"> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder ?? label}
        className="mt-2 w-full rounded-lg bg-white/20 text-white px-4 py-2 placeholder-gray-200 
                   focus:ring-2 focus:ring-indigo-400 outline-none transition"
      />
    </div>
  );
}
