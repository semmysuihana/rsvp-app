"use client";

import InputForm from "./inputForm";
import SelectForm from "./selectForm";
import type { Field } from "../types/field";
import CardContainer from "./cardContainer";
import ModalDesign from "~/component/modalDesign";
import { useState, useRef } from "react";

interface Props {
  fields: Field[];
  submitText: string;
  onSubmit: (data: FormData) => void;
  cols?: number;
  modal?: boolean;
}

export default function FormSetting({ fields, submitText, onSubmit, cols = 1, modal = false }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const triggerSubmit = () => {
    formRef.current?.requestSubmit();
    setModalOpen(false);
  };

  return (
    <>
      {modalOpen && (
        <ModalDesign isOpen={modalOpen} title="Submit Form" onClose={() => setModalOpen(false)}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Are you sure to submit?</h2>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={triggerSubmit}
            >
              Confirm
            </button>
          </div>
        </ModalDesign>
      )}

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget));
        }}
        className="space-y-5"
      >
        <CardContainer cols={cols}>
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
        </CardContainer>

        <button
          type={modal ? "button" : "submit"}
          onClick={modal ? () => setModalOpen(true) : undefined}
          className="
            w-full py-2.5 font-semibold rounded-lg transition-all shadow-md
            bg-indigo-500 hover:bg-indigo-400 text-white
            dark:bg-indigo-600 dark:hover:bg-indigo-500
          "
        >
          {submitText}
        </button>
      </form>
    </>
  );
}
