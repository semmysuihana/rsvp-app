import InputForm from "./inputForm";
import SelectForm from "./selectForm";
import type { Field } from "../types/field";

interface Props {
  fields: Field[];
  submitText: string;
  onSubmit: (data: FormData) => void;
}

export default function FormSetting({ fields, submitText, onSubmit }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-5"
    >
      {fields.map((field) => {
        switch (field.type) {
          case "text":
          case "password":
          case "date":
          case "email":
          case "number":
          case "tel":
          case "time":
          case "url":
            return <InputForm key={field.name} {...field} />;
          case "select":
            return <SelectForm key={field.name} {...field} />;
          default:
            return null;
        }
      })}

      <button
        type="submit"
        className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition-all shadow-md"
      >
        {submitText}
      </button>
    </form>
  );
}
