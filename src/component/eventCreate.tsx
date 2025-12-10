"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faPlus } from "@fortawesome/free-solid-svg-icons";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";

export default function CreateEventTemplate({ fields, handleAction }: { fields: Field[], handleAction: (formData: FormData) => void;}) {

  return (
    <>
        <div className="w-full max-w-4xl mx-auto mt-6 bg-white dark:bg-gray-800 
            rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Card Header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r 
              from-indigo-500/10 to-purple-500/10 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold">Detail Event</h2>
          </div>

          {/* Card Body – Form Setting */}
          <div className="p-6">
            <FormSetting fields={fields} submitText="Create Event" onSubmit={handleAction} cols={2} />
          </div>
        </div>
    </>
  );
}
