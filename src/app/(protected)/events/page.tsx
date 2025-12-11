"use client";
import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import { useEvent } from "~/app/utils/actionEvent";
import Loading from "~/component/loading";
import Alert from "~/component/alert";
import CardList from "~/component/cardList";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList, faCreditCard } from "@fortawesome/free-solid-svg-icons";

import type { DataItem } from "~/types/eventType";
import CreateEventTemplate from "~/component/eventCreate";
import type { Field } from "~/types/field";
import SubcriptionPlan from "~/component/subcriptionPlan";
export default function Event() {
  const { events, loading, alert, showAlert, handleDelete, refetch, setShowAlert, handleEvent } = useEvent();
  const [page, setPage] = useState<"menu" | "create" | "subplan">("menu");
  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}

      {/* Alert */}
      {showAlert && (
        <div className="mb-4">
          <Alert alert={alert} setShowAlert={setShowAlert} />
        </div>
      )}

      <PageContainer>
        {/* Title */}
        <PageHeader title="Events" subtitle="Overview & quick stats" />

        {/* Select Menu / Tabs */}
       <div className="mb-4 inline-flex rounded-md shadow-sm p-1 border border-gray-300 dark:border-gray-800" role="group">
  <button
    onClick={() => setPage("menu")}
    className={`px-4 py-2 ${page === "menu" ? "bg-indigo-100 dark:bg-indigo-700 dark:text-indigo-100 text-indigo-700 rounded-l-md" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
  >
    <FontAwesomeIcon icon={faList} className="mr-2" />
    Menu
  </button>

  <button
    onClick={() => setPage("create")}
    className={`px-4 py-2 border-l border-r ${page === "create" ? "bg-indigo-100 dark:bg-indigo-700 dark:text-indigo-100 text-indigo-700" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"} border-gray-300 dark:border-gray-800`}
  >
    <FontAwesomeIcon icon={faPlus} className="mr-2" />
    Create Event
  </button>

  <button
    onClick={() => setPage("subplan")}
    className={`px-4 py-2 ${page === "subplan" ? "bg-indigo-100 dark:bg-indigo-700 dark:text-indigo-100 text-indigo-700 rounded-r-md" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
  >
    <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
    Subscription Plan
  </button>
</div>


        {/* Content berdasarkan page */}
        {page === "menu" && (
          <Menu events={events as DataItem[]} onDelete={handleDelete} />
        )}

        {page === "create" && (
          <CreateEvent handleAction={handleEvent} />
        )}

        {page === "subplan" && (
          <SubcriptionPlan />
        )}
      </PageContainer>
    </>
  );
}


function Menu({events, onDelete}: {events: DataItem[], onDelete: (id: string) => Promise<void>}) {
  return (
    <div className="w-full max-w-full overflow-x-auto">
      <CardList
        name="event"
        data={events}
        link="/events"
        onDelete={onDelete}
        detailIdTo="guest"
        display={["name", "date", "time", "venueName", "address"]}
      />
    </div>
  );
}

function CreateEvent({ handleAction }: { handleAction: (formData: FormData) => void }) {
       const fields: Field[] = [
  { type: "text", name: "name", label: "Event Name", placeholder: "Enter event name" },
  { type: "date", name: "date", label: "Date" },
  { type: "time", name: "time", label: "Time" },
  { type: "text", name: "venueName", label: "Venue Name", placeholder: "Enter venue" },
  { type: "text", name: "address", label: "Address", placeholder: "Enter address" },
  { type: "text", name: "rtRw", label: "RT/RW", placeholder: "Enter RT/RW", optional: true },
  { type: "text", name: "district", label: "District", placeholder: "Enter district", optional: true },
  { type: "text", name: "subDistrict", label: "Sub District", placeholder: "Enter sub district", optional: true },
  { type: "text", name: "city", label: "City", placeholder: "Enter city", optional: true },
  { type: "url", name: "googleMapUrl", label: "Google Map URL", placeholder: "Enter Google Map URL", optional: true },
  { type: "number", name: "maxPax", label: "Max Pax", placeholder: "Enter max pax" },
];

  return <CreateEventTemplate fields={fields} handleAction={handleAction} />;
}


