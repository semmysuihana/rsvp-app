import type { SelectField } from "~/types/field";

export default function SelectForm({
  name,
  label,
  options,
  optional,
  value,
}: SelectField) {
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

      <select
        id={name}
        name={name}
        defaultValue={value ?? ""}
        className="
          w-full rounded-lg
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-700
          text-gray-800 dark:text-gray-200
          text-sm
          px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500
          transition
          appearance-none
        "
      >
        <option value="" disabled>
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
