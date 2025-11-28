import type { Field } from "../types/field"; // kalau dijadikan file terpisah

export default function InputForm({ type, name, label, placeholder, optional }: Field) {
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
        placeholder={placeholder ?? label}
        className="mt-2 w-full rounded-lg bg-white/20 text-white px-4 py-2 placeholder-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none transition"
      />
    </div>
  );
}
