import type { SelectField } from "~/types/field"

export default function SelectForm({ name, label, options, optional }: SelectField) {
    return(
               <div>
  <label htmlFor="gender" className="block text-sm font-medium text-white">
    {label}
    {optional && <span className="text-gray-400"> (optional)</span>}
  </label>
  <select
    id={name}
    name={name}
    className="mt-2 w-full rounded-lg bg-white/20 text-white px-4 py-2 
               focus:ring-2 focus:ring-indigo-400 outline-none transition
               appearance-none"
  >
    <option value="" className="text-black">Select {label}</option>
    {options.map((option) => (
      <option key={option} value={option} className="text-black">
        {option}
      </option>
    ))}
  </select>
          </div>
    )
}